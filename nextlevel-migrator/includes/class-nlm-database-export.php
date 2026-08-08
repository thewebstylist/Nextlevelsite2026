<?php
/**
 * Streaming, resumable database dump.
 *
 * Writes a plain-SQL dump (database.sql) into the export working directory.
 * Because a big database can't be dumped in a single web request, the dump
 * is produced across many calls: each call appends a bounded number of rows
 * and reports how far it got.
 *
 * @package NextLevelMigrator
 */

defined( 'ABSPATH' ) || exit;

/**
 * Exports the WordPress database to a SQL file, batch by batch.
 */
class NLM_Database_Export {

	/**
	 * Build the ordered list of tables that belong to this install.
	 *
	 * Only tables using the current $wpdb->prefix are exported, so we never
	 * drag along unrelated tables that happen to share the database.
	 *
	 * @return array List of table names.
	 */
	public static function get_tables() {
		global $wpdb;
		$like   = $wpdb->esc_like( $wpdb->prefix ) . '%';
		$tables = $wpdb->get_col( $wpdb->prepare( 'SHOW TABLES LIKE %s', $like ) ); // phpcs:ignore WordPress.DB
		sort( $tables );
		return $tables;
	}

	/**
	 * Total row count across all exported tables (for progress reporting).
	 *
	 * @param array $tables Table list.
	 * @return int
	 */
	public static function count_rows( array $tables ) {
		global $wpdb;
		$total = 0;
		foreach ( $tables as $table ) {
			$total += (int) $wpdb->get_var( 'SELECT COUNT(*) FROM `' . esc_sql( $table ) . '`' ); // phpcs:ignore WordPress.DB
		}
		return $total;
	}

	/**
	 * Write the SQL file header (charset + settings).
	 *
	 * @param string $sql_file Destination path.
	 * @return void
	 */
	public static function write_header( $sql_file ) {
		global $wpdb;
		$header  = "-- Next Level Migrator SQL dump\n";
		$header .= '-- Generated: ' . gmdate( 'Y-m-d H:i:s' ) . " UTC\n";
		$header .= '-- Host: ' . home_url() . "\n\n";
		$header .= "SET SQL_MODE = \"NO_AUTO_VALUE_ON_ZERO\";\n";
		$header .= "SET time_zone = \"+00:00\";\n";
		$header .= "SET FOREIGN_KEY_CHECKS = 0;\n";
		$charset = $wpdb->charset ? $wpdb->charset : 'utf8mb4';
		$header .= '/*!40101 SET NAMES ' . $charset . " */;\n\n";
		file_put_contents( $sql_file, $header ); // phpcs:ignore WordPress.WP.AlternativeFunctions
	}

	/**
	 * Append the DROP + CREATE TABLE statement for one table.
	 *
	 * @param string $sql_file Destination path.
	 * @param string $table    Table name.
	 * @return void
	 */
	public static function write_structure( $sql_file, $table ) {
		global $wpdb;
		$create = $wpdb->get_row( 'SHOW CREATE TABLE `' . esc_sql( $table ) . '`', ARRAY_N ); // phpcs:ignore WordPress.DB
		$ddl    = isset( $create[1] ) ? $create[1] : '';
		$out    = "\n-- --------------------------------------------------------\n";
		$out   .= "-- Table: {$table}\n\n";
		$out   .= 'DROP TABLE IF EXISTS `' . $table . "`;\n";
		$out   .= $ddl . ";\n\n";
		file_put_contents( $sql_file, $out, FILE_APPEND ); // phpcs:ignore WordPress.WP.AlternativeFunctions
	}

	/**
	 * Append up to $limit rows of INSERT statements for one table.
	 *
	 * @param string $sql_file Destination path.
	 * @param string $table    Table name.
	 * @param int    $offset   Row offset to start from.
	 * @param int    $limit    Maximum rows to write this call.
	 * @return int Number of rows actually written.
	 */
	public static function write_rows( $sql_file, $table, $offset, $limit ) {
		global $wpdb;

		$rows = $wpdb->get_results(
			$wpdb->prepare( 'SELECT * FROM `' . esc_sql( $table ) . '` LIMIT %d OFFSET %d', $limit, $offset ), // phpcs:ignore WordPress.DB
			ARRAY_A
		);

		if ( empty( $rows ) ) {
			return 0;
		}

		$buffer = '';
		foreach ( $rows as $row ) {
			$values = array();
			foreach ( $row as $value ) {
				if ( null === $value ) {
					$values[] = 'NULL';
				} else {
					// Escape and wrap. Numeric-looking values are still quoted;
					// MySQL accepts quoted numerics on import.
					$values[] = "'" . esc_sql( $value ) . "'";
				}
			}
			$buffer .= 'INSERT INTO `' . $table . '` VALUES (' . implode( ',', $values ) . ");\n";
		}

		file_put_contents( $sql_file, $buffer, FILE_APPEND ); // phpcs:ignore WordPress.WP.AlternativeFunctions
		return count( $rows );
	}
}
