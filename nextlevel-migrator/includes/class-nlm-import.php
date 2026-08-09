<?php
/**
 * Import orchestrator.
 *
 * Restores a Next Level Migrator archive across many AJAX steps:
 *   init      -> read manifest, index files, extract the SQL, build replace map
 *   files     -> stream wp-content files out of the .zip
 *   db_import -> run the SQL dump (batched, prefix-rewritten)
 *   db_replace-> serialized-safe URL/path replacement across every table
 *   finalize  -> flush caches + rewrite rules
 *
 * IMPORTANT: importing overwrites the users table, which breaks the
 * destination admin's auth cookie mid-run. So the first step issues a random
 * job token (while auth is still valid); every later step is authorized by
 * that token instead of a WordPress nonce.
 *
 * @package NextLevelMigrator
 */

defined( 'ABSPATH' ) || exit;

/**
 * Coordinates the multi-step import.
 */
class NLM_Import {

	/**
	 * Status store for the import job.
	 *
	 * @var NLM_Status
	 */
	protected $status;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->status = new NLM_Status( 'import' );
	}

	/**
	 * The token of the currently running import job, or '' if none.
	 *
	 * @return string
	 */
	public function running_token() {
		return (string) $this->status->get( 'token', '' );
	}

	/**
	 * Advance one step.
	 *
	 * @param array $args Optional args used only on the first (init) step,
	 *                    e.g. array( 'backup' => 'file.zip' ) to restore an
	 *                    archive that already lives on the server.
	 * @return array
	 */
	public function step( $args = array() ) {
		$stage = $this->status->get( 'stage', 'init' );

		switch ( $stage ) {
			case 'init':
				return $this->init( $args );
			case 'files':
				return $this->files();
			case 'db_import':
				return $this->db_import();
			case 'db_replace':
				return $this->db_replace();
			case 'finalize':
				return $this->finalize();
			case 'done':
				return $this->done_payload();
			default:
				return $this->init();
		}
	}

	/**
	 * Stage 1: read the archive manifest and prepare the job.
	 *
	 * @param array $args Optional. 'backup' => filename to restore an archive
	 *                    already stored on the server (no upload needed).
	 * @return array
	 */
	protected function init( $args = array() ) {
		// Restore directly from a server-side backup, or from an upload.
		$keep_zip = false;
		if ( ! empty( $args['backup'] ) ) {
			$backup   = sanitize_file_name( $args['backup'] );
			$zip_path = NLM_Utils::backups_dir() . $backup;
			$keep_zip = true; // Never delete a stored backup after restoring it.
			if ( ! file_exists( $zip_path ) || 'zip' !== strtolower( pathinfo( $zip_path, PATHINFO_EXTENSION ) ) ) {
				return $this->error( __( 'The selected backup could not be found on the server.', 'nextlevel-migrator' ) );
			}
		} else {
			$zip_path = NLM_Utils::tmp_dir() . 'import.zip';
			if ( ! file_exists( $zip_path ) ) {
				return $this->error( __( 'No uploaded archive was found. Please upload a .zip first.', 'nextlevel-migrator' ) );
			}
		}

		$zip = new ZipArchive();
		if ( true !== $zip->open( $zip_path ) ) {
			return $this->error( __( 'The uploaded file is not a valid .zip archive.', 'nextlevel-migrator' ) );
		}

		$manifest_raw = $zip->getFromName( 'package.json' );
		if ( false === $manifest_raw ) {
			$zip->close();
			return $this->error( __( 'This archive was not created by Next Level Migrator (no manifest found).', 'nextlevel-migrator' ) );
		}
		$manifest = json_decode( $manifest_raw, true );
		if ( ! is_array( $manifest ) ) {
			$zip->close();
			return $this->error( __( 'The archive manifest is corrupted.', 'nextlevel-migrator' ) );
		}

		// Extract the SQL dump to the working directory.
		$work_dir = NLM_Utils::tmp_dir() . 'import-work/';
		NLM_Utils::rrmdir( $work_dir );
		wp_mkdir_p( $work_dir );

		$sql_raw = $zip->getFromName( 'database.sql' );
		if ( false === $sql_raw ) {
			$zip->close();
			return $this->error( __( 'The archive does not contain a database dump.', 'nextlevel-migrator' ) );
		}
		file_put_contents( $work_dir . 'database.sql', $sql_raw ); // phpcs:ignore WordPress.WP.AlternativeFunctions
		unset( $sql_raw );

		// Index the content files inside the archive.
		$source_content = isset( $manifest['content_dir'] ) ? trim( $manifest['content_dir'], '/' ) : 'wp-content';
		$file_entries   = array();
		for ( $i = 0; $i < $zip->numFiles; $i++ ) {
			$name = $zip->getNameIndex( $i );
			if ( false === $name || 'database.sql' === $name || 'package.json' === $name ) {
				continue;
			}
			if ( '/' === substr( $name, -1 ) ) {
				continue; // directory entry.
			}
			// Only extract files under the source content directory.
			if ( 0 === strpos( $name, $source_content . '/' ) ) {
				$file_entries[] = $name;
			}
		}
		$zip->close();

		$pairs = $this->build_replace_pairs( $manifest );
		$token = wp_generate_password( 32, false );

		$this->status->replace(
			array(
				'stage'          => 'files',
				'token'          => $token,
				'zip_path'       => $zip_path,
				'keep_zip'       => $keep_zip,
				'work_dir'       => $work_dir,
				'manifest'       => $manifest,
				'source_content' => $source_content,
				'file_entries'   => $file_entries,
				'file_index'     => 0,
				'total_files'    => count( $file_entries ),
				'src_prefix'     => isset( $manifest['table_prefix'] ) ? $manifest['table_prefix'] : $GLOBALS['wpdb']->prefix,
				'sql_offset'     => 0,
				'queries_run'    => 0,
				'pairs'          => $pairs,
				'started_at'     => time(),
			)
		);
		$this->status->save();

		return array(
			'stage'   => 'files',
			'percent' => 5,
			'message' => __( 'Archive validated. Restoring files…', 'nextlevel-migrator' ),
			'token'   => $token,
			'done'    => false,
			'source'  => isset( $manifest['home'] ) ? $manifest['home'] : '',
		);
	}

	/**
	 * Stage 2: stream files from the zip into wp-content.
	 *
	 * @return array
	 */
	protected function files() {
		$zip_path       = $this->status->get( 'zip_path' );
		$entries        = (array) $this->status->get( 'file_entries', array() );
		$file_index     = (int) $this->status->get( 'file_index', 0 );
		$total_files    = max( 1, (int) $this->status->get( 'total_files', 1 ) );
		$source_content = (string) $this->status->get( 'source_content', 'wp-content' );

		$zip = new ZipArchive();
		if ( true !== $zip->open( $zip_path ) ) {
			return $this->error( __( 'Could not reopen the archive.', 'nextlevel-migrator' ) );
		}

		$dest_content = wp_normalize_path( untrailingslashit( WP_CONTENT_DIR ) );
		$added        = 0;

		while ( $added < NLM_FILES_PER_REQUEST && $file_index < count( $entries ) ) {
			$name = $entries[ $file_index ];
			$file_index++;
			$added++;

			// Remap source content dir -> local content dir; reject traversal.
			$relative = ltrim( substr( $name, strlen( $source_content ) ), '/' );
			if ( '' === $relative || false !== strpos( $relative, '..' ) ) {
				continue;
			}
			$dest = $dest_content . '/' . $relative;

			$stream = $zip->getStream( $name );
			if ( ! $stream ) {
				continue;
			}
			wp_mkdir_p( dirname( $dest ) );
			$out = fopen( $dest, 'wb' ); // phpcs:ignore WordPress.WP.AlternativeFunctions
			if ( $out ) {
				stream_copy_to_stream( $stream, $out );
				fclose( $out ); // phpcs:ignore WordPress.WP.AlternativeFunctions
			}
			fclose( $stream ); // phpcs:ignore WordPress.WP.AlternativeFunctions
		}

		$zip->close();
		$this->status->set( 'file_index', $file_index );

		if ( $file_index >= count( $entries ) ) {
			$this->status->set( 'stage', 'db_import' );
			$this->status->save();
			return $this->progress( 'db_import', 45, __( 'Files restored. Importing database…', 'nextlevel-migrator' ) );
		}

		$this->status->save();
		$percent = 5 + (int) round( ( $file_index / $total_files ) * 35 ); // 5%..40%
		return $this->progress(
			'files',
			$percent,
			sprintf(
				/* translators: 1: files done, 2: total files */
				__( 'Restoring files… %1$s / %2$s', 'nextlevel-migrator' ),
				number_format_i18n( $file_index ),
				number_format_i18n( $total_files )
			)
		);
	}

	/**
	 * Stage 3: run the SQL dump in slices.
	 *
	 * @return array
	 */
	protected function db_import() {
		$sql_file   = $this->status->get( 'work_dir' ) . 'database.sql';
		$offset     = (int) $this->status->get( 'sql_offset', 0 );
		$src_prefix = (string) $this->status->get( 'src_prefix', $GLOBALS['wpdb']->prefix );
		$total      = max( 1, (int) @filesize( $sql_file ) ); // phpcs:ignore WordPress.PHP.NoSilencedErrors

		$result = NLM_Database_Import::run_slice( $sql_file, $offset, $src_prefix, 300 );

		if ( ! empty( $result['error'] ) ) {
			return $this->error( $result['error'] );
		}

		$this->status->set( 'sql_offset', $result['new_offset'] );

		if ( ! empty( $result['done'] ) ) {
			// Prepare the replacement sweep over the freshly imported tables.
			$this->status->set( 'stage', 'db_replace' );
			$this->status->set( 'rep_tables', NLM_Database_Export::get_tables() );
			$this->status->set( 'rep_table_index', 0 );
			$this->status->set( 'rep_offset', 0 );
			$this->status->save();
			return $this->progress( 'db_replace', 80, __( 'Database imported. Updating URLs…', 'nextlevel-migrator' ) );
		}

		$this->status->save();
		$percent = 45 + (int) round( ( $result['new_offset'] / $total ) * 33 ); // 45%..78%
		return $this->progress( 'db_import', $percent, __( 'Importing database…', 'nextlevel-migrator' ) );
	}

	/**
	 * Stage 4: serialized-safe URL/path replacement over every table.
	 *
	 * @return array
	 */
	protected function db_replace() {
		$pairs    = (array) $this->status->get( 'pairs', array() );
		$replacer = new NLM_String_Replace( $pairs );

		// Nothing to change (e.g. same-domain restore) -> skip straight to done.
		if ( ! $replacer->has_pairs() ) {
			$this->status->set( 'stage', 'finalize' );
			$this->status->save();
			return $this->progress( 'finalize', 95, __( 'Finishing up…', 'nextlevel-migrator' ) );
		}

		$tables = (array) $this->status->get( 'rep_tables', array() );
		$index  = (int) $this->status->get( 'rep_table_index', 0 );
		$offset = (int) $this->status->get( 'rep_offset', 0 );

		$budget = NLM_ROWS_PER_REQUEST;

		while ( $budget > 0 && $index < count( $tables ) ) {
			$processed = NLM_Database_Import::replace_in_table( $tables[ $index ], $offset, min( $budget, 1000 ), $replacer );
			if ( 0 === $processed ) {
				$index++;
				$offset = 0;
				continue;
			}
			$offset += $processed;
			$budget -= $processed;
		}

		$this->status->set( 'rep_table_index', $index );
		$this->status->set( 'rep_offset', $offset );

		if ( $index >= count( $tables ) ) {
			$this->status->set( 'stage', 'finalize' );
			$this->status->save();
			return $this->progress( 'finalize', 95, __( 'URLs updated. Finishing up…', 'nextlevel-migrator' ) );
		}

		$this->status->save();
		$done_tables = max( 1, count( $tables ) );
		$percent     = 80 + (int) round( ( $index / $done_tables ) * 14 ); // 80%..94%
		return $this->progress( 'db_replace', $percent, __( 'Updating URLs and paths…', 'nextlevel-migrator' ) );
	}

	/**
	 * Stage 5: flush and clean up.
	 *
	 * @return array
	 */
	protected function finalize() {
		global $wpdb;

		// Make sure siteurl/home reflect this installation's real address.
		$wpdb->query( $wpdb->prepare( "UPDATE `{$wpdb->options}` SET option_value = %s WHERE option_name = 'siteurl'", untrailingslashit( site_url() ) ) ); // phpcs:ignore WordPress.DB
		$wpdb->query( $wpdb->prepare( "UPDATE `{$wpdb->options}` SET option_value = %s WHERE option_name = 'home'", untrailingslashit( home_url() ) ) ); // phpcs:ignore WordPress.DB

		if ( function_exists( 'wp_cache_flush' ) ) {
			wp_cache_flush();
		}
		delete_option( 'rewrite_rules' );

		// Remove the working files and the uploaded archive.
		$work_dir = $this->status->get( 'work_dir' );
		if ( $work_dir ) {
			NLM_Utils::rrmdir( $work_dir );
		}
		$zip_path = $this->status->get( 'zip_path' );
		if ( $zip_path && file_exists( $zip_path ) && ! $this->status->get( 'keep_zip' ) ) {
			@unlink( $zip_path ); // phpcs:ignore WordPress.PHP.NoSilencedErrors
		}

		$this->status->set( 'stage', 'done' );
		$this->status->save();

		return $this->done_payload();
	}

	/**
	 * The final response.
	 *
	 * @return array
	 */
	protected function done_payload() {
		$manifest = (array) $this->status->get( 'manifest', array() );
		$this->status->clear();

		return array(
			'stage'     => 'done',
			'percent'   => 100,
			'done'      => true,
			'message'   => __( 'Import complete! Log in with the credentials from the source site.', 'nextlevel-migrator' ),
			'login_url' => wp_login_url(),
		);
	}

	/**
	 * Reset the import job and delete its temp files.
	 *
	 * @return void
	 */
	public function reset() {
		$work_dir = $this->status->get( 'work_dir' );
		if ( $work_dir ) {
			NLM_Utils::rrmdir( $work_dir );
		}
		$zip_path = $this->status->get( 'zip_path' );
		if ( $zip_path && file_exists( $zip_path ) && ! $this->status->get( 'keep_zip' ) ) {
			@unlink( $zip_path ); // phpcs:ignore WordPress.PHP.NoSilencedErrors
		}
		$this->status->clear();
	}

	/**
	 * Build the ordered search => replace map from the source manifest.
	 *
	 * Covers plain URLs, protocol-relative URLs, JSON-escaped slashes, and the
	 * absolute filesystem path.
	 *
	 * @param array $manifest Source manifest.
	 * @return array
	 */
	protected function build_replace_pairs( array $manifest ) {
		$pairs = array();

		$old_home = isset( $manifest['home'] ) ? untrailingslashit( $manifest['home'] ) : '';
		$old_site = isset( $manifest['siteurl'] ) ? untrailingslashit( $manifest['siteurl'] ) : '';
		$new_home = untrailingslashit( home_url() );
		$new_site = untrailingslashit( site_url() );

		$url_pairs = array();
		if ( $old_home && $old_home !== $new_home ) {
			$url_pairs[ $old_home ] = $new_home;
		}
		if ( $old_site && $old_site !== $new_site && ! isset( $url_pairs[ $old_site ] ) ) {
			$url_pairs[ $old_site ] = $new_site;
		}

		foreach ( $url_pairs as $from => $to ) {
			$pairs[ $from ] = $to;

			// Protocol-relative (//host/path).
			$from_pr = preg_replace( '#^https?:#', '', $from );
			$to_pr   = preg_replace( '#^https?:#', '', $to );
			if ( $from_pr !== $from ) {
				$pairs[ $from_pr ] = $to_pr;
			}

			// JSON / escaped-slash variant (http:\/\/host).
			$from_esc = str_replace( '/', '\/', $from );
			$to_esc   = str_replace( '/', '\/', $to );
			if ( $from_esc !== $from ) {
				$pairs[ $from_esc ] = $to_esc;
			}
		}

		// Absolute filesystem path (e.g. /var/www/old -> /var/www/new).
		$old_abs = isset( $manifest['abspath'] ) ? wp_normalize_path( untrailingslashit( $manifest['abspath'] ) ) : '';
		$new_abs = wp_normalize_path( untrailingslashit( ABSPATH ) );
		if ( $old_abs && $old_abs !== $new_abs ) {
			$pairs[ $old_abs ] = $new_abs;
		}

		return $pairs;
	}

	/**
	 * Standard progress payload.
	 *
	 * @param string $stage   Next stage.
	 * @param int    $percent Percentage.
	 * @param string $message Message.
	 * @return array
	 */
	protected function progress( $stage, $percent, $message ) {
		return array(
			'stage'   => $stage,
			'percent' => max( 0, min( 99, (int) $percent ) ),
			'message' => $message,
			'done'    => false,
		);
	}

	/**
	 * Error payload.
	 *
	 * @param string $message Message.
	 * @return array
	 */
	protected function error( $message ) {
		return array(
			'stage'   => 'error',
			'error'   => true,
			'message' => $message,
		);
	}
}
