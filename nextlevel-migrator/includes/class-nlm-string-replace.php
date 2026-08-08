<?php
/**
 * Serialized-data-safe search and replace.
 *
 * When you move a WordPress site to a new domain, the old URL is baked into
 * thousands of database rows -- including PHP-serialized blobs (widgets,
 * theme mods, plugin settings). A naive string replace corrupts those blobs
 * because serialize() stores the byte length of every string. This class
 * unserializes, replaces recursively, and re-serializes so lengths stay
 * correct.
 *
 * @package NextLevelMigrator
 */

defined( 'ABSPATH' ) || exit;

/**
 * Recursive, serialization-aware string replacer.
 */
class NLM_String_Replace {

	/**
	 * Ordered list of search => replace pairs.
	 *
	 * @var array
	 */
	protected $pairs = array();

	/**
	 * Constructor.
	 *
	 * @param array $pairs Associative array of search => replace strings.
	 */
	public function __construct( array $pairs = array() ) {
		// Longest search strings first so more specific matches win.
		uksort(
			$pairs,
			static function ( $a, $b ) {
				return strlen( (string) $b ) - strlen( (string) $a );
			}
		);
		$this->pairs = $pairs;
	}

	/**
	 * Whether there is anything to replace.
	 *
	 * @return bool
	 */
	public function has_pairs() {
		return ! empty( $this->pairs );
	}

	/**
	 * Replace across an arbitrary value, honoring serialized structures.
	 *
	 * @param mixed $data Value from a database cell (usually a string).
	 * @return mixed The replaced value, in the same serialized/plain form.
	 */
	public function replace( $data ) {
		// Serialized string: decode, recurse, re-encode (fixes lengths).
		if ( is_string( $data ) && is_serialized( $data ) ) {
			$unserialized = @unserialize( $data ); // phpcs:ignore WordPress.PHP.NoSilencedErrors
			if ( false !== $unserialized || 'b:0;' === $data ) {
				return serialize( $this->replace( $unserialized ) ); // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions
			}
		}

		if ( is_array( $data ) ) {
			$out = array();
			foreach ( $data as $key => $value ) {
				$out[ $this->replace( $key ) ] = $this->replace( $value );
			}
			return $out;
		}

		if ( is_object( $data ) ) {
			// Do not touch broken (incomplete) class instances.
			if ( $data instanceof __PHP_Incomplete_Class ) {
				return $data;
			}
			$clone = clone $data;
			foreach ( get_object_vars( $clone ) as $key => $value ) {
				$clone->$key = $this->replace( $value );
			}
			return $clone;
		}

		if ( is_string( $data ) ) {
			return $this->plain_replace( $data );
		}

		return $data;
	}

	/**
	 * Straight str_replace across all pairs.
	 *
	 * @param string $string Input string.
	 * @return string
	 */
	protected function plain_replace( $string ) {
		foreach ( $this->pairs as $search => $replace ) {
			if ( '' === (string) $search ) {
				continue;
			}
			$string = str_replace( $search, $replace, $string );
		}
		return $string;
	}
}
