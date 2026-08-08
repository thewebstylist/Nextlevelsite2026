/* global jQuery, NLM */
( function ( $ ) {
	'use strict';

	var i18n = NLM.i18n;

	/* ---------------------------------------------------------------- Tabs */
	$( '.nlm-tabs .nav-tab' ).on( 'click', function ( e ) {
		e.preventDefault();
		var tab = $( this ).data( 'tab' );
		$( '.nlm-tabs .nav-tab' ).removeClass( 'nav-tab-active' );
		$( this ).addClass( 'nav-tab-active' );
		$( '.nlm-panel' ).prop( 'hidden', true );
		$( '#nlm-tab-' + tab ).prop( 'hidden', false );
		if ( 'backups' === tab ) {
			loadBackups();
		}
	} );

	function setProgress( $wrap, percent, message ) {
		$wrap.prop( 'hidden', false );
		$wrap.find( '.nlm-progress-bar span' ).css( 'width', percent + '%' );
		$wrap.find( '.nlm-progress-msg' ).text( message + ' (' + percent + '%)' );
	}

	function showError( $box, message ) {
		$box.prop( 'hidden', false ).find( 'p' ).text( message );
	}

	/* -------------------------------------------------------------- Export */
	var $exportBtn = $( '#nlm-export-start' );
	var $exportProgress = $( '#nlm-export-progress' );
	var $exportResult = $( '#nlm-export-result' );
	var $exportError = $( '#nlm-export-error' );

	$exportBtn.on( 'click', function () {
		$exportBtn.prop( 'disabled', true );
		$exportResult.prop( 'hidden', true );
		$exportError.prop( 'hidden', true );
		setProgress( $exportProgress, 2, 'Starting…' );
		exportStep();
	} );

	function exportStep() {
		$.post( NLM.ajaxUrl, {
			action: 'nlm_export',
			nonce: NLM.nonce
		} ).done( function ( res ) {
			if ( ! res.success ) {
				$exportBtn.prop( 'disabled', false );
				showError( $exportError, ( res.data && res.data.message ) || i18n.exportError );
				return;
			}
			var d = res.data;
			if ( d.done ) {
				setProgress( $exportProgress, 100, i18n.done );
				$exportProgress.prop( 'hidden', true );
				$( '#nlm-export-download' ).attr( 'href', d.download );
				$exportResult.find( '.nlm-result-meta' ).text( d.file + ' — ' + d.size_h );
				$exportResult.prop( 'hidden', false );
				$exportBtn.prop( 'disabled', false );
				return;
			}
			setProgress( $exportProgress, d.percent, d.message );
			exportStep();
		} ).fail( function () {
			$exportBtn.prop( 'disabled', false );
			showError( $exportError, i18n.exportError );
		} );
	}

	/* -------------------------------------------------------------- Import */
	var importFile = null;
	var importToken = '';
	var $importBtn = $( '#nlm-import-start' );
	var $importProgress = $( '#nlm-import-progress' );
	var $importResult = $( '#nlm-import-result' );
	var $importError = $( '#nlm-import-error' );
	var $dropzone = $( '#nlm-dropzone' );

	function chooseFile( file ) {
		if ( ! file ) {
			return;
		}
		importFile = file;
		$( '#nlm-chosen' ).text( file.name + ' (' + humanSize( file.size ) + ')' );
		$importBtn.prop( 'disabled', false );
	}

	$( '#nlm-import-file' ).on( 'change', function () {
		chooseFile( this.files[ 0 ] );
	} );

	$dropzone.on( 'dragover', function ( e ) {
		e.preventDefault();
		$dropzone.addClass( 'nlm-dragover' );
	} ).on( 'dragleave drop', function () {
		$dropzone.removeClass( 'nlm-dragover' );
	} ).on( 'drop', function ( e ) {
		e.preventDefault();
		var files = e.originalEvent.dataTransfer.files;
		if ( files && files.length ) {
			chooseFile( files[ 0 ] );
		}
	} );

	$importBtn.on( 'click', function () {
		if ( ! importFile ) {
			showError( $importError, i18n.noFile );
			return;
		}
		if ( ! window.confirm( i18n.confirmImport ) ) {
			return;
		}
		$importBtn.prop( 'disabled', true );
		$importResult.prop( 'hidden', true );
		$importError.prop( 'hidden', true );
		importToken = '';
		setProgress( $importProgress, 1, i18n.uploading );
		uploadChunks( 0 );
	} );

	function uploadChunks( offset ) {
		var chunk = importFile.slice( offset, offset + NLM.chunkSize );
		var form = new FormData();
		form.append( 'action', 'nlm_upload' );
		form.append( 'nonce', NLM.nonce );
		form.append( 'append', offset > 0 ? '1' : '0' );
		form.append( 'chunk', chunk );

		$.ajax( {
			url: NLM.ajaxUrl,
			method: 'POST',
			data: form,
			processData: false,
			contentType: false
		} ).done( function ( res ) {
			if ( ! res.success ) {
				$importBtn.prop( 'disabled', false );
				showError( $importError, ( res.data && res.data.message ) || i18n.importError );
				return;
			}
			var next = offset + NLM.chunkSize;
			var pct = Math.min( 100, Math.round( ( next / importFile.size ) * 100 ) );
			setProgress( $importProgress, Math.min( 20, Math.round( pct * 0.2 ) ), i18n.uploading );
			if ( next < importFile.size ) {
				uploadChunks( next );
			} else {
				importStep();
			}
		} ).fail( function () {
			$importBtn.prop( 'disabled', false );
			showError( $importError, i18n.importError );
		} );
	}

	function importStep() {
		$.post( NLM.ajaxUrl, {
			action: 'nlm_import',
			nonce: NLM.nonce,
			token: importToken
		} ).done( function ( res ) {
			if ( ! res.success ) {
				$importBtn.prop( 'disabled', false );
				showError( $importError, ( res.data && res.data.message ) || i18n.importError );
				return;
			}
			var d = res.data;
			if ( d.token ) {
				importToken = d.token;
			}
			if ( d.done ) {
				setProgress( $importProgress, 100, i18n.done );
				$importProgress.prop( 'hidden', true );
				$importResult.find( '.nlm-import-msg' ).text( d.message );
				if ( d.login_url ) {
					$( '#nlm-import-login' ).attr( 'href', d.login_url );
				}
				$importResult.prop( 'hidden', false );
				return;
			}
			setProgress( $importProgress, d.percent, d.message );
			importStep();
		} ).fail( function () {
			$importBtn.prop( 'disabled', false );
			showError( $importError, i18n.importError );
		} );
	}

	/* ------------------------------------------------------------- Backups */
	function loadBackups() {
		$.post( NLM.ajaxUrl, { action: 'nlm_list_backups', nonce: NLM.nonce } )
			.done( function ( res ) {
				if ( res.success ) {
					renderBackups( res.data.backups );
				}
			} );
	}

	function renderBackups( backups ) {
		var $body = $( '#nlm-backups-body' ).empty();
		if ( ! backups || ! backups.length ) {
			$body.append( '<tr class="nlm-empty"><td colspan="4">No backups stored yet.</td></tr>' );
			return;
		}
		backups.forEach( function ( b ) {
			var $tr = $( '<tr/>' );
			$tr.append( $( '<td/>' ).text( b.file ) );
			$tr.append( $( '<td/>' ).text( b.size_h ) );
			$tr.append( $( '<td/>' ).text( b.date ) );
			var $actions = $( '<td class="nlm-actions"/>' );
			$( '<a class="button button-small"/>' ).attr( 'href', b.download ).text( 'Download' ).appendTo( $actions );
			$( '<button class="button button-small nlm-delete"/>' ).text( 'Delete' ).data( 'file', b.file ).appendTo( $actions );
			$tr.append( $actions );
			$body.append( $tr );
		} );
	}

	$( '#nlm-backups-body' ).on( 'click', '.nlm-delete', function () {
		if ( ! window.confirm( i18n.confirmDelete ) ) {
			return;
		}
		$.post( NLM.ajaxUrl, {
			action: 'nlm_delete_backup',
			nonce: NLM.nonce,
			file: $( this ).data( 'file' )
		} ).done( function ( res ) {
			if ( res.success ) {
				renderBackups( res.data.backups );
			}
		} );
	} );

	function humanSize( bytes ) {
		var units = [ 'B', 'KB', 'MB', 'GB', 'TB' ];
		var i = 0;
		while ( bytes >= 1024 && i < units.length - 1 ) {
			bytes /= 1024;
			i++;
		}
		return ( Math.round( bytes * 100 ) / 100 ) + ' ' + units[ i ];
	}

} )( jQuery );
