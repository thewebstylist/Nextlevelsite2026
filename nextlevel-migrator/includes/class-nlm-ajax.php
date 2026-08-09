<?php
/**
 * AJAX endpoints for the migrator.
 *
 * @package NextLevelMigrator
 */

defined( 'ABSPATH' ) || exit;

/**
 * Registers and handles every admin-ajax action the plugin exposes.
 */
class NLM_Ajax {

	/**
	 * Hook the endpoints.
	 */
	public function __construct() {
		// Export (privileged only).
		add_action( 'wp_ajax_nlm_export', array( $this, 'export' ) );
		add_action( 'wp_ajax_nlm_export_reset', array( $this, 'export_reset' ) );
		add_action( 'wp_ajax_nlm_download', array( $this, 'download' ) );

		// Backups management.
		add_action( 'wp_ajax_nlm_list_backups', array( $this, 'list_backups' ) );
		add_action( 'wp_ajax_nlm_delete_backup', array( $this, 'delete_backup' ) );

		// Upload happens while the destination admin is still authenticated.
		add_action( 'wp_ajax_nlm_upload', array( $this, 'upload' ) );

		// Import steps must keep working after the users table is replaced, so
		// they are reachable logged-out and gated by the job token instead.
		add_action( 'wp_ajax_nlm_import', array( $this, 'import' ) );
		add_action( 'wp_ajax_nopriv_nlm_import', array( $this, 'import' ) );
		add_action( 'wp_ajax_nlm_import_reset', array( $this, 'import_reset' ) );
		add_action( 'wp_ajax_nopriv_nlm_import_reset', array( $this, 'import_reset' ) );
	}

	/**
	 * Advance the export one step.
	 *
	 * @return void
	 */
	public function export() {
		NLM_Utils::verify_request();
		$export = new NLM_Export();
		$result = $export->step();
		$this->respond( $result );
	}

	/**
	 * Abort the current export.
	 *
	 * @return void
	 */
	public function export_reset() {
		NLM_Utils::verify_request();
		$export = new NLM_Export();
		$export->reset();
		wp_send_json_success( array( 'message' => __( 'Export reset.', 'nextlevel-migrator' ) ) );
	}

	/**
	 * Chunked upload receiver for the import archive.
	 *
	 * The browser posts the file in slices (append=1 after the first slice) so
	 * large archives are not limited by upload_max_filesize on a single POST.
	 *
	 * @return void
	 */
	public function upload() {
		NLM_Utils::verify_request();
		NLM_Utils::prepare_storage();

		if ( empty( $_FILES['chunk'] ) || ! isset( $_FILES['chunk']['tmp_name'] ) ) {
			wp_send_json_error( array( 'message' => __( 'No data received.', 'nextlevel-migrator' ) ), 400 );
		}

		$append = ! empty( $_POST['append'] );
		$tmp    = $_FILES['chunk']['tmp_name']; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
		if ( ! is_uploaded_file( $tmp ) ) {
			wp_send_json_error( array( 'message' => __( 'Invalid upload.', 'nextlevel-migrator' ) ), 400 );
		}

		$dest = NLM_Utils::tmp_dir() . 'import.zip';

		if ( ! $append && file_exists( $dest ) ) {
			@unlink( $dest ); // phpcs:ignore WordPress.PHP.NoSilencedErrors
		}

		$in  = fopen( $tmp, 'rb' ); // phpcs:ignore WordPress.WP.AlternativeFunctions
		$out = fopen( $dest, $append ? 'ab' : 'wb' ); // phpcs:ignore WordPress.WP.AlternativeFunctions
		if ( ! $in || ! $out ) {
			wp_send_json_error( array( 'message' => __( 'Could not write upload to disk.', 'nextlevel-migrator' ) ), 500 );
		}
		stream_copy_to_stream( $in, $out );
		fclose( $in );  // phpcs:ignore WordPress.WP.AlternativeFunctions
		fclose( $out ); // phpcs:ignore WordPress.WP.AlternativeFunctions

		wp_send_json_success(
			array(
				'size' => filesize( $dest ),
			)
		);
	}

	/**
	 * Advance the import one step (token- or nonce-gated).
	 *
	 * @return void
	 */
	public function import() {
		$import        = new NLM_Import();
		$running_token = $import->running_token();
		$sent_token    = isset( $_REQUEST['token'] ) ? sanitize_text_field( wp_unslash( $_REQUEST['token'] ) ) : '';

		if ( '' !== $sent_token ) {
			// Continuing an in-flight job: authorize purely by its token.
			if ( ! hash_equals( $running_token, $sent_token ) ) {
				wp_send_json_error( array( 'message' => __( 'Invalid or expired import session. Reload the page and start the import again.', 'nextlevel-migrator' ) ), 403 );
			}
		} else {
			// Fresh start from the admin UI: require nonce + capability.
			NLM_Utils::verify_request();
			// Self-heal: discard any stale/abandoned job so a previously
			// interrupted import can't block this one. Files on disk (the
			// just-uploaded archive) are preserved.
			if ( '' !== $running_token ) {
				$import->forget();
				$import = new NLM_Import();
			}
		}

		// 'backup' is only honored on the fresh/init call (verified above); it
		// lets the user restore an archive already stored on the server.
		$args = array();
		if ( '' === $sent_token && isset( $_REQUEST['backup'] ) ) {
			$args['backup'] = sanitize_file_name( wp_unslash( $_REQUEST['backup'] ) );
		}

		$result = $import->step( $args );
		$this->respond( $result );
	}

	/**
	 * Abort the current import.
	 *
	 * @return void
	 */
	public function import_reset() {
		$import        = new NLM_Import();
		$running_token = $import->running_token();
		$sent_token    = isset( $_REQUEST['token'] ) ? sanitize_text_field( wp_unslash( $_REQUEST['token'] ) ) : '';

		if ( '' !== $running_token ) {
			if ( ! hash_equals( $running_token, $sent_token ) ) {
				wp_send_json_error( array( 'message' => __( 'Invalid import session.', 'nextlevel-migrator' ) ), 403 );
			}
		} else {
			NLM_Utils::verify_request();
		}

		$import->reset();
		wp_send_json_success( array( 'message' => __( 'Import reset.', 'nextlevel-migrator' ) ) );
	}

	/**
	 * Stream a finished backup to the browser as a download.
	 *
	 * @return void
	 */
	public function download() {
		if ( ! current_user_can( NLM_CAPABILITY ) ) {
			wp_die( esc_html__( 'You are not allowed to download backups.', 'nextlevel-migrator' ) );
		}

		$file = isset( $_GET['file'] ) ? sanitize_file_name( wp_unslash( $_GET['file'] ) ) : '';
		check_admin_referer( 'nlm_download_' . $file );

		$path = NLM_Utils::backups_dir() . $file;
		if ( '' === $file || ! file_exists( $path ) || 'zip' !== strtolower( pathinfo( $path, PATHINFO_EXTENSION ) ) ) {
			wp_die( esc_html__( 'Backup not found.', 'nextlevel-migrator' ) );
		}

		nocache_headers();
		header( 'Content-Type: application/zip' );
		header( 'Content-Disposition: attachment; filename="' . $file . '"' );
		header( 'Content-Length: ' . filesize( $path ) );

		// Flush output buffers so large files stream without exhausting memory.
		while ( ob_get_level() ) {
			ob_end_clean();
		}
		readfile( $path ); // phpcs:ignore WordPress.WP.AlternativeFunctions
		exit;
	}

	/**
	 * Return the list of stored backups.
	 *
	 * @return void
	 */
	public function list_backups() {
		NLM_Utils::verify_request();
		wp_send_json_success( array( 'backups' => $this->collect_backups() ) );
	}

	/**
	 * Delete a stored backup.
	 *
	 * @return void
	 */
	public function delete_backup() {
		NLM_Utils::verify_request();
		$file = isset( $_POST['file'] ) ? sanitize_file_name( wp_unslash( $_POST['file'] ) ) : '';
		$path = NLM_Utils::backups_dir() . $file;

		if ( '' !== $file && file_exists( $path ) && 'zip' === strtolower( pathinfo( $path, PATHINFO_EXTENSION ) ) ) {
			@unlink( $path ); // phpcs:ignore WordPress.PHP.NoSilencedErrors
		}

		wp_send_json_success( array( 'backups' => $this->collect_backups() ) );
	}

	/**
	 * Gather backup metadata from the backups directory.
	 *
	 * @return array
	 */
	protected function collect_backups() {
		$backups = array();
		$dir     = NLM_Utils::backups_dir();

		foreach ( (array) glob( $dir . '*.zip' ) as $path ) {
			$name      = basename( $path );
			$backups[] = array(
				'file'     => $name,
				'size'     => filesize( $path ),
				'size_h'   => NLM_Utils::format_bytes( filesize( $path ) ),
				'date'     => gmdate( 'Y-m-d H:i', filemtime( $path ) ),
				'download' => NLM_Utils::download_url( $name ),
			);
		}

		// Newest first.
		usort(
			$backups,
			static function ( $a, $b ) {
				return strcmp( $b['date'], $a['date'] );
			}
		);

		return $backups;
	}

	/**
	 * Send a step result, distinguishing errors from progress.
	 *
	 * @param array $result Result payload from an engine step.
	 * @return void
	 */
	protected function respond( array $result ) {
		if ( ! empty( $result['error'] ) ) {
			wp_send_json_error( $result );
		}
		wp_send_json_success( $result );
	}
}
