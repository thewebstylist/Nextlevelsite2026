<?php
/**
 * Admin UI: menu, page, and asset loading.
 *
 * @package NextLevelMigrator
 */

defined( 'ABSPATH' ) || exit;

/**
 * Registers the admin menu and renders the migrator screen.
 */
class NLM_Admin {

	/**
	 * Admin page hook suffix.
	 *
	 * @var string
	 */
	protected $hook = '';

	/**
	 * Hook up admin actions.
	 */
	public function __construct() {
		add_action( 'admin_menu', array( $this, 'menu' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'assets' ) );
	}

	/**
	 * Register the top-level menu.
	 *
	 * @return void
	 */
	public function menu() {
		$this->hook = add_menu_page(
			__( 'Next Level Migrator', 'nextlevel-migrator' ),
			__( 'Migrator', 'nextlevel-migrator' ),
			NLM_CAPABILITY,
			'nextlevel-migrator',
			array( $this, 'render' ),
			'dashicons-migrate',
			76
		);
	}

	/**
	 * Enqueue CSS/JS only on our screen.
	 *
	 * @param string $hook Current admin page hook.
	 * @return void
	 */
	public function assets( $hook ) {
		if ( $hook !== $this->hook ) {
			return;
		}

		wp_enqueue_style(
			'nlm-admin',
			NLM_PLUGIN_URL . 'admin/assets/admin.css',
			array(),
			NLM_VERSION
		);

		wp_enqueue_script(
			'nlm-admin',
			NLM_PLUGIN_URL . 'admin/assets/admin.js',
			array( 'jquery' ),
			NLM_VERSION,
			true
		);

		wp_localize_script(
			'nlm-admin',
			'NLM',
			array(
				'ajaxUrl'    => admin_url( 'admin-ajax.php' ),
				'nonce'      => wp_create_nonce( 'nlm_ajax' ),
				'chunkSize'  => 5 * 1024 * 1024, // 5 MB upload slices.
				'homeUrl'    => home_url(),
				'i18n'       => array(
					'confirmImport' => __( 'This will OVERWRITE this site\'s database and files with the contents of the archive. This cannot be undone. Continue?', 'nextlevel-migrator' ),
					'confirmDelete' => __( 'Delete this backup permanently?', 'nextlevel-migrator' ),
					'uploading'     => __( 'Uploading archive…', 'nextlevel-migrator' ),
					'exportError'   => __( 'Export failed. See details below.', 'nextlevel-migrator' ),
					'importError'   => __( 'Import failed. See details below.', 'nextlevel-migrator' ),
					'noFile'        => __( 'Please choose a .zip archive first.', 'nextlevel-migrator' ),
					'done'          => __( 'Done!', 'nextlevel-migrator' ),
				),
			)
		);
	}

	/**
	 * Render the admin page shell.
	 *
	 * @return void
	 */
	public function render() {
		if ( ! current_user_can( NLM_CAPABILITY ) ) {
			return;
		}
		require NLM_PLUGIN_DIR . 'admin/views/page.php';
	}
}
