<?php
/**
 * Migrator admin screen markup.
 *
 * @package NextLevelMigrator
 */

defined( 'ABSPATH' ) || exit;

global $wpdb, $wp_version;

$nlm_tables    = NLM_Database_Export::get_tables();
$nlm_db_size   = 0;
foreach ( $nlm_tables as $nlm_t ) {
	$nlm_db_size += (int) $wpdb->get_var( 'SELECT SUM(data_length + index_length) FROM information_schema.TABLES WHERE table_name = "' . esc_sql( $nlm_t ) . '"' ); // phpcs:ignore WordPress.DB
}
?>
<div class="wrap nlm-wrap">

	<h1 class="nlm-title">
		<span class="dashicons dashicons-migrate"></span>
		<?php esc_html_e( 'Next Level Migrator', 'nextlevel-migrator' ); ?>
	</h1>
	<p class="nlm-subtitle">
		<?php esc_html_e( 'Export your entire WordPress site into a single .zip, or import one onto this site.', 'nextlevel-migrator' ); ?>
	</p>

	<h2 class="nav-tab-wrapper nlm-tabs">
		<a href="#export" class="nav-tab nav-tab-active" data-tab="export"><?php esc_html_e( 'Export', 'nextlevel-migrator' ); ?></a>
		<a href="#import" class="nav-tab" data-tab="import"><?php esc_html_e( 'Import', 'nextlevel-migrator' ); ?></a>
		<a href="#backups" class="nav-tab" data-tab="backups"><?php esc_html_e( 'Backups', 'nextlevel-migrator' ); ?></a>
	</h2>

	<?php // -------------------------------------------------- EXPORT ?>
	<div class="nlm-panel" id="nlm-tab-export">
		<div class="nlm-card">
			<h2><?php esc_html_e( 'Export this site', 'nextlevel-migrator' ); ?></h2>
			<p><?php esc_html_e( 'Packages your database, media uploads, themes, plugins, and settings into one portable archive.', 'nextlevel-migrator' ); ?></p>

			<ul class="nlm-facts">
				<li><strong><?php esc_html_e( 'Site URL', 'nextlevel-migrator' ); ?>:</strong> <?php echo esc_html( home_url() ); ?></li>
				<li><strong><?php esc_html_e( 'Database tables', 'nextlevel-migrator' ); ?>:</strong> <?php echo esc_html( number_format_i18n( count( $nlm_tables ) ) ); ?></li>
				<li><strong><?php esc_html_e( 'Approx. DB size', 'nextlevel-migrator' ); ?>:</strong> <?php echo esc_html( NLM_Utils::format_bytes( $nlm_db_size ) ); ?></li>
				<li><strong><?php esc_html_e( 'WordPress', 'nextlevel-migrator' ); ?>:</strong> <?php echo esc_html( $wp_version ); ?> &nbsp; <strong>PHP:</strong> <?php echo esc_html( PHP_VERSION ); ?></li>
			</ul>

			<button type="button" class="button button-primary button-hero" id="nlm-export-start">
				<span class="dashicons dashicons-download"></span>
				<?php esc_html_e( 'Export site', 'nextlevel-migrator' ); ?>
			</button>

			<div class="nlm-progress" id="nlm-export-progress" hidden>
				<div class="nlm-progress-bar"><span></span></div>
				<p class="nlm-progress-msg"></p>
			</div>

			<div class="nlm-result notice notice-success" id="nlm-export-result" hidden>
				<p>
					<span class="dashicons dashicons-yes-alt"></span>
					<?php esc_html_e( 'Your archive is ready.', 'nextlevel-migrator' ); ?>
					<a href="#" class="button button-primary" id="nlm-export-download"><?php esc_html_e( 'Download .zip', 'nextlevel-migrator' ); ?></a>
					<span class="nlm-result-meta"></span>
				</p>
			</div>

			<div class="nlm-error notice notice-error" id="nlm-export-error" hidden><p></p></div>
		</div>
	</div>

	<?php // -------------------------------------------------- IMPORT ?>
	<div class="nlm-panel" id="nlm-tab-import" hidden>
		<div class="nlm-card">
			<h2><?php esc_html_e( 'Import an archive', 'nextlevel-migrator' ); ?></h2>

			<div class="notice notice-warning inline nlm-warn">
				<p>
					<span class="dashicons dashicons-warning"></span>
					<?php esc_html_e( 'Importing replaces this site\'s database and files. Take a backup first. After import you must log in with the SOURCE site\'s username and password.', 'nextlevel-migrator' ); ?>
				</p>
			</div>

			<p class="nlm-hint">
				<span class="dashicons dashicons-info-outline"></span>
				<?php esc_html_e( 'Restoring a backup that was exported on THIS server? Skip the upload — go to the Backups tab and click Restore.', 'nextlevel-migrator' ); ?>
			</p>

			<div class="nlm-dropzone" id="nlm-dropzone">
				<span class="dashicons dashicons-upload"></span>
				<p><?php esc_html_e( 'Drag a .zip archive here, or', 'nextlevel-migrator' ); ?></p>
				<label class="button">
					<?php esc_html_e( 'Choose file', 'nextlevel-migrator' ); ?>
					<input type="file" id="nlm-import-file" accept=".zip" hidden>
				</label>
				<p class="nlm-chosen" id="nlm-chosen"></p>
			</div>

			<button type="button" class="button button-primary button-hero" id="nlm-import-start" disabled>
				<span class="dashicons dashicons-upload"></span>
				<?php esc_html_e( 'Import', 'nextlevel-migrator' ); ?>
			</button>

			<div class="nlm-progress" id="nlm-import-progress" hidden>
				<div class="nlm-progress-bar"><span></span></div>
				<p class="nlm-progress-msg"></p>
			</div>

			<div class="nlm-result notice notice-success" id="nlm-import-result" hidden>
				<p>
					<span class="dashicons dashicons-yes-alt"></span>
					<span class="nlm-import-msg"></span>
					<a href="#" class="button button-primary" id="nlm-import-login"><?php esc_html_e( 'Go to login', 'nextlevel-migrator' ); ?></a>
				</p>
			</div>

			<div class="nlm-error notice notice-error" id="nlm-import-error" hidden><p></p></div>
		</div>
	</div>

	<?php // -------------------------------------------------- BACKUPS ?>
	<div class="nlm-panel" id="nlm-tab-backups" hidden>
		<div class="nlm-card">
			<h2><?php esc_html_e( 'Stored backups', 'nextlevel-migrator' ); ?></h2>
			<p><?php esc_html_e( 'Archives you have exported are kept on the server until you download and delete them.', 'nextlevel-migrator' ); ?></p>
			<table class="widefat striped nlm-backups">
				<thead>
					<tr>
						<th><?php esc_html_e( 'File', 'nextlevel-migrator' ); ?></th>
						<th><?php esc_html_e( 'Size', 'nextlevel-migrator' ); ?></th>
						<th><?php esc_html_e( 'Created (UTC)', 'nextlevel-migrator' ); ?></th>
						<th></th>
					</tr>
				</thead>
				<tbody id="nlm-backups-body">
					<tr class="nlm-empty"><td colspan="4"><?php esc_html_e( 'Loading…', 'nextlevel-migrator' ); ?></td></tr>
				</tbody>
			</table>
		</div>
	</div>

</div>
