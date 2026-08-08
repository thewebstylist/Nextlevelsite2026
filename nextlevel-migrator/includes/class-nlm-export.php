<?php
/**
 * Export orchestrator.
 *
 * Drives a full site export across many AJAX steps:
 *   init  -> scan files, count rows, write the manifest + SQL header
 *   database -> append the SQL dump in row batches
 *   files -> stream files into the .zip in batches (plus database.sql + manifest)
 *   done  -> hand back a download URL
 *
 * @package NextLevelMigrator
 */

defined( 'ABSPATH' ) || exit;

/**
 * Coordinates the multi-step export.
 */
class NLM_Export {

	/**
	 * Status store for the export job.
	 *
	 * @var NLM_Status
	 */
	protected $status;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->status = new NLM_Status( 'export' );
	}

	/**
	 * Advance the export one step and return a progress payload.
	 *
	 * @return array
	 */
	public function step() {
		$stage = $this->status->get( 'stage', 'init' );

		switch ( $stage ) {
			case 'init':
				return $this->init();
			case 'database':
				return $this->database();
			case 'files':
				return $this->files();
			case 'done':
				return $this->done_payload();
			default:
				return $this->init();
		}
	}

	/**
	 * Stage 1: prepare working files and inventories.
	 *
	 * @return array
	 */
	protected function init() {
		NLM_Utils::prepare_storage();

		$id       = substr( md5( uniqid( 'nlm', true ) ), 0, 12 );
		$work_dir = NLM_Utils::tmp_dir() . 'export-' . $id . '/';
		wp_mkdir_p( $work_dir );

		$name         = NLM_Utils::generate_archive_name();
		$archive_path = NLM_Utils::backups_dir() . $name;

		// Inventory the database.
		$tables     = NLM_Database_Export::get_tables();
		$total_rows = NLM_Database_Export::count_rows( $tables );

		// Inventory the files (everything under wp-content, minus our own dir).
		$file_list = $this->scan_files();

		// Write the manifest and the SQL header.
		$this->write_manifest( $work_dir, $tables );
		NLM_Database_Export::write_header( $work_dir . 'database.sql' );

		$this->status->replace(
			array(
				'stage'        => 'database',
				'id'           => $id,
				'work_dir'     => $work_dir,
				'name'         => $name,
				'archive_path' => $archive_path,
				'tables'       => $tables,
				'table_index'  => 0,
				'row_offset'   => 0,
				'rows_done'    => 0,
				'total_rows'   => $total_rows,
				'file_list'    => $file_list,
				'file_index'   => 0,
				'total_files'  => count( $file_list ),
				'zip_started'  => false,
				'started_at'   => time(),
			)
		);
		$this->status->save();

		return $this->progress( 'database', 5, __( 'Preparing export…', 'nextlevel-migrator' ) );
	}

	/**
	 * Stage 2: dump database rows in batches.
	 *
	 * @return array
	 */
	protected function database() {
		$tables      = (array) $this->status->get( 'tables', array() );
		$table_index = (int) $this->status->get( 'table_index', 0 );
		$row_offset  = (int) $this->status->get( 'row_offset', 0 );
		$rows_done   = (int) $this->status->get( 'rows_done', 0 );
		$total_rows  = max( 1, (int) $this->status->get( 'total_rows', 1 ) );
		$sql_file    = $this->status->get( 'work_dir' ) . 'database.sql';

		$budget = NLM_ROWS_PER_REQUEST;

		while ( $budget > 0 && $table_index < count( $tables ) ) {
			$table = $tables[ $table_index ];

			// First time we touch this table, write its structure.
			if ( 0 === $row_offset ) {
				NLM_Database_Export::write_structure( $sql_file, $table );
			}

			$written = NLM_Database_Export::write_rows( $sql_file, $table, $row_offset, $budget );

			if ( 0 === $written ) {
				// Table exhausted: move on.
				$table_index++;
				$row_offset = 0;
				continue;
			}

			$row_offset += $written;
			$rows_done  += $written;
			$budget     -= $written;
		}

		$this->status->set( 'table_index', $table_index );
		$this->status->set( 'row_offset', $row_offset );
		$this->status->set( 'rows_done', $rows_done );

		if ( $table_index >= count( $tables ) ) {
			$this->status->set( 'stage', 'files' );
			$this->status->save();
			return $this->progress( 'files', 40, __( 'Database exported. Packaging files…', 'nextlevel-migrator' ) );
		}

		$this->status->save();
		$percent = 5 + (int) round( ( $rows_done / $total_rows ) * 30 ); // 5%..35%
		return $this->progress(
			'database',
			$percent,
			sprintf(
				/* translators: 1: rows done, 2: total rows */
				__( 'Exporting database… %1$s / %2$s rows', 'nextlevel-migrator' ),
				number_format_i18n( $rows_done ),
				number_format_i18n( $total_rows )
			)
		);
	}

	/**
	 * Stage 3: add files (and the SQL + manifest) to the zip in batches.
	 *
	 * @return array
	 */
	protected function files() {
		$archive_path = $this->status->get( 'archive_path' );
		$work_dir     = $this->status->get( 'work_dir' );
		$file_list    = (array) $this->status->get( 'file_list', array() );
		$file_index   = (int) $this->status->get( 'file_index', 0 );
		$total_files  = max( 1, (int) $this->status->get( 'total_files', 1 ) );
		$zip_started  = (bool) $this->status->get( 'zip_started', false );

		$zip   = new ZipArchive();
		$flags = $zip_started ? 0 : ( ZipArchive::CREATE | ZipArchive::OVERWRITE );
		if ( true !== $zip->open( $archive_path, $flags ) ) {
			return $this->error( __( 'Could not create the archive file.', 'nextlevel-migrator' ) );
		}

		// On the first files pass, drop in the SQL dump and the manifest.
		if ( ! $zip_started ) {
			$zip->addFile( $work_dir . 'database.sql', 'database.sql' );
			$zip->addFile( $work_dir . 'package.json', 'package.json' );
			$this->status->set( 'zip_started', true );
		}

		$added = 0;
		while ( $added < NLM_FILES_PER_REQUEST && $file_index < count( $file_list ) ) {
			$entry = $file_list[ $file_index ];
			$abs   = ABSPATH . $entry;
			if ( is_file( $abs ) && is_readable( $abs ) ) {
				$zip->addFile( $abs, $entry );
			}
			$file_index++;
			$added++;
		}

		$zip->close();

		$this->status->set( 'file_index', $file_index );

		if ( $file_index >= count( $file_list ) ) {
			$this->status->set( 'stage', 'done' );
			$this->status->set( 'size', filesize( $archive_path ) );
			$this->status->save();
			// Working directory is no longer needed.
			NLM_Utils::rrmdir( $work_dir );
			return $this->done_payload();
		}

		$this->status->save();
		$percent = 40 + (int) round( ( $file_index / $total_files ) * 58 ); // 40%..98%
		return $this->progress(
			'files',
			$percent,
			sprintf(
				/* translators: 1: files done, 2: total files */
				__( 'Packaging files… %1$s / %2$s', 'nextlevel-migrator' ),
				number_format_i18n( $file_index ),
				number_format_i18n( $total_files )
			)
		);
	}

	/**
	 * Build the "done" response with the download link.
	 *
	 * @return array
	 */
	protected function done_payload() {
		$name = $this->status->get( 'name' );
		$size = (int) $this->status->get( 'size', 0 );

		return array(
			'stage'    => 'done',
			'percent'  => 100,
			'message'  => __( 'Export complete.', 'nextlevel-migrator' ),
			'done'     => true,
			'file'     => $name,
			'size'     => $size,
			'size_h'   => NLM_Utils::format_bytes( $size ),
			'download' => NLM_Utils::download_url( $name ),
		);
	}

	/**
	 * Reset any in-progress export state.
	 *
	 * @return void
	 */
	public function reset() {
		$work_dir = $this->status->get( 'work_dir' );
		if ( $work_dir ) {
			NLM_Utils::rrmdir( $work_dir );
		}
		$this->status->clear();
	}

	/**
	 * Scan wp-content and return archive-relative file paths.
	 *
	 * @return array
	 */
	protected function scan_files() {
		$root       = wp_normalize_path( untrailingslashit( WP_CONTENT_DIR ) );
		$abspath    = wp_normalize_path( untrailingslashit( ABSPATH ) );
		$skip_dir   = wp_normalize_path( untrailingslashit( NLM_Utils::storage_dir() ) );
		$content_rel = ltrim( str_replace( $abspath, '', $root ), '/' ); // usually "wp-content"

		$list = array();

		if ( ! is_dir( $root ) ) {
			return $list;
		}

		$iterator = new RecursiveIteratorIterator(
			new RecursiveDirectoryIterator( $root, FilesystemIterator::SKIP_DOTS | FilesystemIterator::FOLLOW_SYMLINKS ),
			RecursiveIteratorIterator::LEAVES_ONLY
		);

		foreach ( $iterator as $file ) {
			if ( ! $file->isFile() ) {
				continue;
			}
			$path = wp_normalize_path( $file->getPathname() );

			// Never archive our own backups / temp files.
			if ( 0 === strpos( $path, $skip_dir ) ) {
				continue;
			}

			$rel = ltrim( str_replace( $root, '', $path ), '/' );
			$list[] = $content_rel . '/' . $rel;
		}

		return $list;
	}

	/**
	 * Write package.json describing the source site.
	 *
	 * @param string $work_dir Working directory.
	 * @param array  $tables   Exported tables.
	 * @return void
	 */
	protected function write_manifest( $work_dir, array $tables ) {
		global $wpdb, $wp_version;

		$content_rel = ltrim(
			str_replace(
				wp_normalize_path( untrailingslashit( ABSPATH ) ),
				'',
				wp_normalize_path( untrailingslashit( WP_CONTENT_DIR ) )
			),
			'/'
		);

		$manifest = array(
			'generator'    => 'Next Level Migrator',
			'version'      => NLM_VERSION,
			'created_at'   => gmdate( 'c' ),
			'siteurl'      => get_option( 'siteurl' ),
			'home'         => get_option( 'home' ),
			'abspath'      => wp_normalize_path( ABSPATH ),
			'content_dir'  => $content_rel,
			'table_prefix' => $wpdb->prefix,
			'charset'      => $wpdb->charset,
			'wp_version'   => isset( $wp_version ) ? $wp_version : '',
			'php_version'  => PHP_VERSION,
			'multisite'    => is_multisite(),
			'tables'       => $tables,
		);

		file_put_contents( $work_dir . 'package.json', wp_json_encode( $manifest, JSON_PRETTY_PRINT ) ); // phpcs:ignore WordPress.WP.AlternativeFunctions
	}

	/**
	 * Standard progress payload.
	 *
	 * @param string $stage   Next stage.
	 * @param int    $percent Percentage 0-100.
	 * @param string $message Human message.
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
