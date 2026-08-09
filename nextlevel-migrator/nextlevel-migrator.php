<?php
/**
 * Plugin Name:       Next Level Migrator
 * Plugin URI:        https://github.com/thewebstylist/nextlevelsite2026
 * Description:        Export any WordPress website (database + media + themes + plugins) into a single portable .zip file, then import it onto any other WordPress install with automatic, serialized-safe URL and path replacement.
 * Version:           1.0.2
 * Requires at least: 5.6
 * Requires PHP:      7.2
 * Author:            The Web Stylist
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       nextlevel-migrator
 *
 * @package NextLevelMigrator
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

define( 'NLM_VERSION', '1.0.2' );
define( 'NLM_PLUGIN_FILE', __FILE__ );
define( 'NLM_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'NLM_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'NLM_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );

// The capability required to use the migrator.
if ( ! defined( 'NLM_CAPABILITY' ) ) {
	define( 'NLM_CAPABILITY', 'manage_options' );
}

// How much work each AJAX request is allowed to do before returning progress.
if ( ! defined( 'NLM_ROWS_PER_REQUEST' ) ) {
	define( 'NLM_ROWS_PER_REQUEST', 5000 );   // DB rows per export/import step.
}
if ( ! defined( 'NLM_FILES_PER_REQUEST' ) ) {
	define( 'NLM_FILES_PER_REQUEST', 400 );   // Files per export/import step.
}

/**
 * PSR-style require of every class the plugin needs.
 */
require_once NLM_PLUGIN_DIR . 'includes/class-nlm-utils.php';
require_once NLM_PLUGIN_DIR . 'includes/class-nlm-status.php';
require_once NLM_PLUGIN_DIR . 'includes/class-nlm-string-replace.php';
require_once NLM_PLUGIN_DIR . 'includes/class-nlm-database-export.php';
require_once NLM_PLUGIN_DIR . 'includes/class-nlm-database-import.php';
require_once NLM_PLUGIN_DIR . 'includes/class-nlm-export.php';
require_once NLM_PLUGIN_DIR . 'includes/class-nlm-import.php';
require_once NLM_PLUGIN_DIR . 'includes/class-nlm-ajax.php';
require_once NLM_PLUGIN_DIR . 'admin/class-nlm-admin.php';
require_once NLM_PLUGIN_DIR . 'includes/class-nlm-migrator.php';

/**
 * Runs on activation: prepare the storage directory and lock it down.
 */
function nlm_activate() {
	NLM_Utils::prepare_storage();
}
register_activation_hook( __FILE__, 'nlm_activate' );

/**
 * Boot the plugin.
 */
function nlm() {
	return NLM_Migrator::instance();
}
nlm();
