<?php
/**
 * Shared helpers: storage paths, security, formatting.
 *
 * @package NextLevelMigrator
 */

defined( 'ABSPATH' ) || exit;

/**
 * Static utility helpers used across the plugin.
 */
class NLM_Utils {

	/**
	 * Absolute path to the private storage directory (inside uploads).
	 *
	 * @return string Path with a trailing slash.
	 */
	public static function storage_dir() {
		$uploads = wp_upload_dir( null, false );
		$dir     = trailingslashit( $uploads['basedir'] ) . 'nextlevel-migrator';
		return trailingslashit( $dir );
	}

	/**
	 * Public URL of the storage directory (used for the download link).
	 *
	 * @return string
	 */
	public static function storage_url() {
		$uploads = wp_upload_dir( null, false );
		return trailingslashit( trailingslashit( $uploads['baseurl'] ) . 'nextlevel-migrator' );
	}

	/**
	 * Directory that finished backups live in.
	 *
	 * @return string
	 */
	public static function backups_dir() {
		return trailingslashit( self::storage_dir() . 'backups' );
	}

	/**
	 * Scratch directory used while importing (extraction target).
	 *
	 * @return string
	 */
	public static function tmp_dir() {
		return trailingslashit( self::storage_dir() . 'tmp' );
	}

	/**
	 * Create the storage directory tree and protect it from the web.
	 *
	 * @return void
	 */
	public static function prepare_storage() {
		$dirs = array( self::storage_dir(), self::backups_dir(), self::tmp_dir() );

		foreach ( $dirs as $dir ) {
			if ( ! is_dir( $dir ) ) {
				wp_mkdir_p( $dir );
			}
		}

		// Block direct listing / access to raw archives.
		$htaccess = self::storage_dir() . '.htaccess';
		if ( ! file_exists( $htaccess ) ) {
			$rules  = "Options -Indexes\n";
			$rules .= "<FilesMatch \"\\.(sql|json|log)$\">\n";
			$rules .= "  Require all denied\n";
			$rules .= "</FilesMatch>\n";
			@file_put_contents( $htaccess, $rules ); // phpcs:ignore WordPress.PHP.NoSilencedErrors
		}

		$index = self::storage_dir() . 'index.php';
		if ( ! file_exists( $index ) ) {
			@file_put_contents( $index, "<?php\n// Silence is golden.\n" ); // phpcs:ignore WordPress.PHP.NoSilencedErrors
		}
	}

	/**
	 * Human-readable file size.
	 *
	 * @param int $bytes Byte count.
	 * @return string
	 */
	public static function format_bytes( $bytes ) {
		$bytes = (float) $bytes;
		$units = array( 'B', 'KB', 'MB', 'GB', 'TB' );
		$i     = 0;
		while ( $bytes >= 1024 && $i < count( $units ) - 1 ) {
			$bytes /= 1024;
			$i++;
		}
		return round( $bytes, 2 ) . ' ' . $units[ $i ];
	}

	/**
	 * Verify the AJAX request: nonce + capability. Dies with JSON on failure.
	 *
	 * @return void
	 */
	public static function verify_request() {
		if ( ! current_user_can( NLM_CAPABILITY ) ) {
			wp_send_json_error( array( 'message' => __( 'You are not allowed to run migrations.', 'nextlevel-migrator' ) ), 403 );
		}
		check_ajax_referer( 'nlm_ajax', 'nonce' );
	}

	/**
	 * Recursively delete a directory.
	 *
	 * @param string $dir Directory path.
	 * @return void
	 */
	public static function rrmdir( $dir ) {
		if ( ! is_dir( $dir ) ) {
			return;
		}
		$items = new RecursiveIteratorIterator(
			new RecursiveDirectoryIterator( $dir, FilesystemIterator::SKIP_DOTS ),
			RecursiveIteratorIterator::CHILD_FIRST
		);
		foreach ( $items as $item ) {
			if ( $item->isDir() ) {
				@rmdir( $item->getRealPath() ); // phpcs:ignore WordPress.PHP.NoSilencedErrors
			} else {
				@unlink( $item->getRealPath() ); // phpcs:ignore WordPress.PHP.NoSilencedErrors
			}
		}
		@rmdir( $dir ); // phpcs:ignore WordPress.PHP.NoSilencedErrors
	}

	/**
	 * Build a nonce-protected download URL for a backup file.
	 *
	 * NOTE: this is deliberately built with add_query_arg (raw "&") rather than
	 * wp_nonce_url(), because the URL is delivered to the browser as JSON and
	 * assigned via JS. wp_nonce_url() HTML-encodes the ampersands (&#038;),
	 * which would then not be decoded and would corrupt the _wpnonce param.
	 *
	 * @param string $file Archive file name.
	 * @return string
	 */
	public static function download_url( $file ) {
		return add_query_arg(
			array(
				'action'   => 'nlm_download',
				'file'     => $file,
				'_wpnonce' => wp_create_nonce( 'nlm_download_' . $file ),
			),
			admin_url( 'admin-ajax.php' )
		);
	}

	/**
	 * Generate a filesystem- and URL-safe archive name for this site.
	 *
	 * @return string
	 */
	public static function generate_archive_name() {
		$host = wp_parse_url( home_url(), PHP_URL_HOST );
		$host = $host ? preg_replace( '/[^a-z0-9\-]/i', '-', $host ) : 'site';
		return sprintf(
			'%s-%s-%s.zip',
			strtolower( $host ),
			gmdate( 'Ymd-His' ),
			substr( md5( uniqid( '', true ) ), 0, 8 )
		);
	}
}
