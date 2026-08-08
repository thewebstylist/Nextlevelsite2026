<?php
/**
 * Persistent job state for the chunked export/import engines.
 *
 * State is stored as JSON in the private storage directory so it survives
 * across the many AJAX requests that make up a single migration.
 *
 * @package NextLevelMigrator
 */

defined( 'ABSPATH' ) || exit;

/**
 * Simple JSON-file-backed job status store.
 */
class NLM_Status {

	/**
	 * File name for the current job.
	 *
	 * @var string
	 */
	protected $file;

	/**
	 * State array.
	 *
	 * @var array
	 */
	protected $data = array();

	/**
	 * Constructor.
	 *
	 * @param string $type Either 'export' or 'import'.
	 */
	public function __construct( $type ) {
		$type       = ( 'import' === $type ) ? 'import' : 'export';
		$this->file = NLM_Utils::storage_dir() . 'status-' . $type . '.json';
		$this->load();
	}

	/**
	 * Load state from disk.
	 *
	 * @return void
	 */
	protected function load() {
		if ( file_exists( $this->file ) ) {
			$raw        = file_get_contents( $this->file ); // phpcs:ignore WordPress.WP.AlternativeFunctions
			$decoded    = json_decode( (string) $raw, true );
			$this->data = is_array( $decoded ) ? $decoded : array();
		}
	}

	/**
	 * Persist state to disk.
	 *
	 * @return void
	 */
	public function save() {
		file_put_contents( $this->file, wp_json_encode( $this->data ) ); // phpcs:ignore WordPress.WP.AlternativeFunctions
	}

	/**
	 * Get a value.
	 *
	 * @param string $key     Key.
	 * @param mixed  $default Default when unset.
	 * @return mixed
	 */
	public function get( $key, $default = null ) {
		return array_key_exists( $key, $this->data ) ? $this->data[ $key ] : $default;
	}

	/**
	 * Set a value (does not save automatically).
	 *
	 * @param string $key   Key.
	 * @param mixed  $value Value.
	 * @return void
	 */
	public function set( $key, $value ) {
		$this->data[ $key ] = $value;
	}

	/**
	 * Return the whole state array.
	 *
	 * @return array
	 */
	public function all() {
		return $this->data;
	}

	/**
	 * Replace the whole state array.
	 *
	 * @param array $data State.
	 * @return void
	 */
	public function replace( array $data ) {
		$this->data = $data;
	}

	/**
	 * Delete the state file.
	 *
	 * @return void
	 */
	public function clear() {
		$this->data = array();
		if ( file_exists( $this->file ) ) {
			@unlink( $this->file ); // phpcs:ignore WordPress.PHP.NoSilencedErrors
		}
	}
}
