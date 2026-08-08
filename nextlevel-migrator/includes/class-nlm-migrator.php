<?php
/**
 * Plugin bootstrapper.
 *
 * @package NextLevelMigrator
 */

defined( 'ABSPATH' ) || exit;

/**
 * Singleton that wires up the admin UI and AJAX endpoints.
 */
final class NLM_Migrator {

	/**
	 * Sole instance.
	 *
	 * @var NLM_Migrator|null
	 */
	protected static $instance = null;

	/**
	 * Admin controller.
	 *
	 * @var NLM_Admin
	 */
	public $admin;

	/**
	 * AJAX controller.
	 *
	 * @var NLM_Ajax
	 */
	public $ajax;

	/**
	 * Get / create the instance.
	 *
	 * @return NLM_Migrator
	 */
	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor: instantiate controllers.
	 */
	private function __construct() {
		$this->admin = new NLM_Admin();
		$this->ajax  = new NLM_Ajax();

		add_action( 'plugins_loaded', array( $this, 'load_textdomain' ) );
		add_filter( 'plugin_action_links_' . NLM_PLUGIN_BASENAME, array( $this, 'action_links' ) );
	}

	/**
	 * Load translations.
	 *
	 * @return void
	 */
	public function load_textdomain() {
		load_plugin_textdomain( 'nextlevel-migrator', false, dirname( NLM_PLUGIN_BASENAME ) . '/languages' );
	}

	/**
	 * Add a quick link on the Plugins screen.
	 *
	 * @param array $links Existing links.
	 * @return array
	 */
	public function action_links( $links ) {
		$url  = admin_url( 'admin.php?page=nextlevel-migrator' );
		$link = '<a href="' . esc_url( $url ) . '">' . esc_html__( 'Migrate', 'nextlevel-migrator' ) . '</a>';
		array_unshift( $links, $link );
		return $links;
	}
}
