=== Next Level Migrator ===
Contributors: thewebstylist
Tags: migration, backup, export, import, clone, move, duplicate, transfer
Requires at least: 5.6
Tested up to: 6.6
Requires PHP: 7.2
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Export any WordPress site into a single portable .zip file and import it onto any other WordPress install — database, media, themes and plugins included.

== Description ==

Next Level Migrator makes moving, cloning, or backing up a WordPress site as
simple as one download and one upload. It works like the popular all-in-one
migration tools: one archive holds everything, and the importer rewrites the
old URL and file paths to the new site automatically.

**What gets exported**

* The full database (only tables that use this site's table prefix).
* All of `wp-content`: uploads/media, themes, plugins, mu-plugins, and any
  custom folders.
* A manifest (`package.json`) describing the source site so the importer can
  localize everything to the destination.

**Key features**

* **Single .zip archive.** Everything travels in one standard, portable file.
* **Serialized-data-safe replace.** URLs and absolute paths are updated even
  inside PHP-serialized blobs (widgets, theme mods, plugin options) without
  corrupting them.
* **Handles big sites.** The database is dumped in row batches, files are
  packed in batches, and the archive is uploaded in chunks — so large sites
  don't trip PHP timeouts or `upload_max_filesize`.
* **Automatic table-prefix rewrite.** Move between installs even when the
  destination uses a different `$table_prefix`.
* **No server tools required.** Pure PHP + `ZipArchive`; no `mysqldump`,
  `exec()`, or shell access needed.

== Installation ==

1. Copy the `nextlevel-migrator` folder to `wp-content/plugins/` (or upload a
   zip of it via Plugins → Add New → Upload Plugin).
2. Activate **Next Level Migrator** from the Plugins screen.
3. Open **Migrator** in the admin sidebar.

== How to migrate a site ==

**On the source site**

1. Go to **Migrator → Export** and click **Export site**.
2. When it finishes, click **Download .zip** and save the archive.

**On the destination site**

1. Install and activate the plugin there too.
2. Go to **Migrator → Import**, drop in the `.zip`, and click **Import**.
3. When it completes, log in with the **source site's** username and password
   (the destination user accounts are replaced by the imported ones).

== Frequently Asked Questions ==

= Does it change my URLs automatically? =
Yes. During import it replaces the source site's URL and absolute path with the
destination's, including inside serialized data, protocol-relative URLs, and
JSON-escaped slashes.

= Where are backups stored? =
In `wp-content/uploads/nextlevel-migrator/backups/`. The directory is protected
with an `.htaccess` rule and can be managed from the **Backups** tab.

= Is shell access or mysqldump required? =
No. Everything is done in PHP using WordPress's own database layer and the
`ZipArchive` extension.

== Changelog ==

= 1.0.0 =
* Initial release: single-zip export/import, chunked engine, serialized-safe
  URL/path replacement, table-prefix rewrite, backups manager.
