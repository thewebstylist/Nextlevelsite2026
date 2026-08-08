<?php
/**
 * Uninstall cleanup.
 *
 * Removes the plugin's private storage directory (backups + temp files).
 * Runs only when the plugin is deleted from the WordPress admin.
 *
 * @package NextLevelMigrator
 */

defined( 'WP_UNINSTALL_PLUGIN' ) || exit;

$uploads = wp_upload_dir( null, false );
$dir     = trailingslashit( $uploads['basedir'] ) . 'nextlevel-migrator';

if ( is_dir( $dir ) ) {
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
