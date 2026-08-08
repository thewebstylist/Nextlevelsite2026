<?php
/**
 * Resumable database import + post-import search/replace.
 *
 * The importer runs in two phases:
 *   1. Execute the SQL dump statement by statement (batched), rewriting the
 *      source table prefix to the destination prefix on the fly.
 *   2. Sweep every table and run the serialized-safe replacer over each cell
 *      so old-domain URLs and old absolute paths become the new ones.
 *
 * @package NextLevelMigrator
 */

defined( 'ABSPATH' ) || exit;

/**
 * Imports a SQL dump and localizes it to this install.
 */
class NLM_Database_Import {

	/**
	 * Execute a slice of the SQL file.
	 *
	 * @param string $sql_file    Path to database.sql.
	 * @param int    $byte_offset Byte position to resume reading from.
	 * @param string $src_prefix  Table prefix used in the dump.
	 * @param int    $max_queries Maximum statements to run this call.
	 * @return array { new_offset, queries_run, done }
	 */
	public static function run_slice( $sql_file, $byte_offset, $src_prefix, $max_queries ) {
		global $wpdb;

		$dst_prefix = $wpdb->prefix;
		$handle     = fopen( $sql_file, 'rb' ); // phpcs:ignore WordPress.WP.AlternativeFunctions
		if ( ! $handle ) {
			return array(
				'new_offset'  => $byte_offset,
				'queries_run' => 0,
				'done'        => true,
				'error'       => 'Unable to open SQL file.',
			);
		}

		fseek( $handle, $byte_offset );

		$queries_run = 0;
		$statement   = '';

		while ( $queries_run < $max_queries && ! feof( $handle ) ) {
			$line = fgets( $handle );
			if ( false === $line ) {
				break;
			}

			$trimmed = ltrim( $line );
			// Skip comments and blank lines when we're between statements.
			if ( '' === $statement && ( '' === trim( $trimmed ) || 0 === strpos( $trimmed, '--' ) || 0 === strpos( $trimmed, '/*' ) ) ) {
				continue;
			}

			$statement .= $line;

			// A statement ends on a line terminating with ";".
			if ( preg_match( '/;\s*$/', rtrim( $line ) ) ) {
				$query = trim( $statement );
				$statement = '';

				if ( '' === $query ) {
					continue;
				}

				if ( $src_prefix !== $dst_prefix ) {
					$query = self::swap_prefix( $query, $src_prefix, $dst_prefix );
				}

				$wpdb->query( $query ); // phpcs:ignore WordPress.DB
				$queries_run++;
			}
		}

		$new_offset = ftell( $handle );
		$done       = feof( $handle ) && '' === trim( $statement );
		fclose( $handle ); // phpcs:ignore WordPress.WP.AlternativeFunctions

		return array(
			'new_offset'  => $new_offset,
			'queries_run' => $queries_run,
			'done'        => $done,
		);
	}

	/**
	 * Rewrite the table prefix inside a single SQL statement.
	 *
	 * Only backtick-wrapped table identifiers are touched, so data that
	 * merely contains the prefix string is left untouched.
	 *
	 * @param string $query      SQL statement.
	 * @param string $src_prefix Source prefix.
	 * @param string $dst_prefix Destination prefix.
	 * @return string
	 */
	protected static function swap_prefix( $query, $src_prefix, $dst_prefix ) {
		return preg_replace(
			'/`' . preg_quote( $src_prefix, '/' ) . '/',
			'`' . $dst_prefix,
			$query,
			1
		);
	}

	/**
	 * Run the serialized-safe replacer over one table, one batch of rows.
	 *
	 * Rows are matched back by their full original contents (non-null columns),
	 * so this works correctly even on tables without a single-column primary
	 * key (e.g. term_relationships).
	 *
	 * @param string             $table    Table name.
	 * @param int                $offset   Row offset.
	 * @param int                $limit    Rows this call.
	 * @param NLM_String_Replace $replacer Configured replacer.
	 * @return int Rows processed.
	 */
	public static function replace_in_table( $table, $offset, $limit, NLM_String_Replace $replacer ) {
		global $wpdb;

		$rows = $wpdb->get_results(
			$wpdb->prepare( 'SELECT * FROM `' . esc_sql( $table ) . '` LIMIT %d OFFSET %d', $limit, $offset ), // phpcs:ignore WordPress.DB
			ARRAY_A
		);

		if ( empty( $rows ) ) {
			return 0;
		}

		foreach ( $rows as $row ) {
			$changed = array();
			foreach ( $row as $column => $value ) {
				if ( ! is_string( $value ) || '' === $value ) {
					continue;
				}
				$new = $replacer->replace( $value );
				if ( $new !== $value ) {
					$changed[ $column ] = $new;
				}
			}

			if ( empty( $changed ) ) {
				continue;
			}

			// Match the exact source row via its non-null original columns.
			$where = array();
			foreach ( $row as $column => $value ) {
				if ( null !== $value ) {
					$where[ $column ] = $value;
				}
			}

			$wpdb->update( $table, $changed, $where ); // phpcs:ignore WordPress.DB
		}

		return count( $rows );
	}
}
