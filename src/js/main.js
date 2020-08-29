import { throttle } from 'throttle-debounce';

import '../img/icon-128.png';
import '../img/icon-34.png';

import '../css/style.scss';

function setAttributes( el, attrs ) {
    for( var key in attrs ) {
        el.setAttribute( key, attrs[ key ] );
    }
}

// once DOM is ready clear the inputs
document.addEventListener( 'DOMContentLoaded', () => {
    const $metaLinks = document.getElementById( 'screen-meta-links' );
    let noticesCount = 0;

    // Create toggle button.
    const $noticeToggle = document.createElement( 'button' );
    let $noticeToggleWrap = document.createElement( 'div' );

    setAttributes( $noticeToggle, {
        type: 'button',
        id: 'hwn-link',
        class: 'button show-settings',
        'aria-controls': 'hwn-wrap',
        'aria-expanded': 'false',
    } );
    $noticeToggle.innerHTML = 'Notices';

    setAttributes( $noticeToggleWrap, {
        id: 'hwn-link-wrap',
        class: 'hide-if-no-js screen-meta-toggle',
    } );
    $noticeToggleWrap.appendChild( $noticeToggle );
    $metaLinks.appendChild( $noticeToggleWrap );


    // Display notices and remove toggle button on click.
    $noticeToggle.addEventListener( 'click', () => {
        document.body.classList.add( 'hwn-visible' );

        $noticeToggleWrap.parentElement.removeChild($noticeToggleWrap);
        $noticeToggleWrap = false;
    } );

    
    // Init toggle button.
    const initToggleButton = throttle( 300, () => {
        if ( $noticeToggleWrap ) {
            const newNoticesCount = document.querySelectorAll( `
                #wpbody-content > .notice,
                #wpbody-content > .error:not(.hide-if-js),
                #wpbody-content > .updated,
                #wpbody-content > .update-nag,
                #wpbody-content > .wrap > .notice,
                #wpbody-content > .wrap > .error:not(.hide-if-js),
                #wpbody-content > .wrap > .updated,
                #wpbody-content > .wrap > .update-nag
            ` ).length;

            if ( newNoticesCount && noticesCount !== newNoticesCount ) {
                $noticeToggle.innerHTML = `<span>${ newNoticesCount }</span> Notices`;
                document.body.classList.add( 'hwn-has-notices' );
            }
            if ( ! newNoticesCount ) {
                document.body.classList.remove( 'hwn-has-notices' );
            }

            noticesCount = newNoticesCount;
        }
    } );
    initToggleButton();

    if ( window.MutationObserver ) {
        new window.MutationObserver( initToggleButton )
            .observe( document.documentElement, {
                childList: true, subtree: true,
            } );
    } else {
        document.addEventListener( 'DOMContentLoaded', initToggleButton );
        document.addEventListener( 'DOMNodeInserted', initToggleButton );
        document.addEventListener( 'load', initToggleButton );
    }
} );
