javascript:(function() {
    'use strict';

    // Configuration & Logging Header
    const VERSION = '3.5.0';
    console.log(`%c[AdShield v${VERSION}]%c Initializing total deep-clean sweep...`, 'background: #222; color: #bada55; padding: 2px 5px; border-radius: 3px;', 'color: inherit;');

    // 1. Massive Exhaustive Ad Selectors Dictionary (IDs, Classes, Attributes, Common Wrappers)
    const AD_SELECTORS = [
        // Generic & Common Ad Markers
        '[id*="google_ads"]', '[id*="banner_ad"]', '[id*="sponsor"]', '[id*="taboola"]', '[id*="outbrain"]',
        '[id*="ad-container"]', '[id*="ad-wrapper"]', '[id*="ad-slot"]', '[id*="ad-unit"]', '[id*="div-gpt-ad"]',
        '[class*="google_ads"]', '[class*="banner_ad"]', '[class*="sponsored"]', '[class*="taboola"]', '[class*="outbrain"]',
        '[class*="ad-box"]', '[class*="ad-container"]', '[class*="ad-wrapper"]', '[class*="ad-slot"]', '[class*="ad-unit"]',
        '[class*="advert"]', '[class*="advertisement"]', '[class*="adv-wrapper"]', '[class*="adv-container"]',
        
        // Standard Class Names
        '.ad', '.ads', '.adsbygoogle', '.ad-banner', '.ad-sidebar', '.ad-placement', '.ad-holder', '.ad-placement-wrapper',
        '.advertisement', '.sponsored-post', '.sponsored-content', '.paid-content', '.native-ad', '.ad-label',
        
        // Specific Ad Tech & Networks
        'div[id^="dfp-"]', 'div[id^="div-gpt-ad"]', 'div[class^="dfp-"]', 'div[id^="google_ads_iframe"]',
        '.trc_related_container', '.mgbox', '.rc-scroller', '.zergnet-widget', '.revcontent-1', '.yandex-rtb',
        '.adnxs-ad', '.criteo-ad', '.zergnet', '.disqus-ads', '.carbon-ads', '#carbonads', '.ads-list',
        
        // Overlays, Interstitials, and Sticky Floats
        '.vjs-ad-loading', '.vjs-ad-playing', '.video-ad-overlay', '.player-ad-overlay',
        '.popup-ad', '.modal-ad', '.overlay-ad', '#popunder', '#interstitial', '.interstitial-ad',
        '.lightbox-ad', '.cookie-banner', '#cookie-notice', '.fc-consent-root', '.fc-ab-root'
    ];

    // 2. Known Ad and Tracking Domains for Iframe/Script Stripping
    const AD_DOMAINS = [
        'doubleclick.net', 'googlesyndication.com', 'googleadservices.com',
        'adnxs.com', 'amazon-adsystem.com', 'criteo.com', 'outbrain.com',
        'taboola.com', 'rubiconproject.com', 'pubmatic.com', 'openx.net',
        'mediavine.com', 'adthrive.com', 'buysellads.com', 'scorecardresearch.com',
        'quantserve.com', 'zeptail.com', 'moatads.com', 'adsrvr.org', 'bluekai.com',
        'exoclick.com', 'propellerads.com', 'popads.net', 'adsterra.com', 'infolinks.com'
    ];

    // 3. Inject Comprehensive CSS Hard-Hide Rules
    const hideStyle = document.createElement('style');
    hideStyle.id = '__adshield_extended_css__';
    hideStyle.textContent = `
        ${AD_SELECTORS.join(', ')} {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            height: 0 !important;
            width: 0 !important;
            max-height: 0 !important;
            max-width: 0 !important;
            overflow: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
        }
        html, body {
            overflow: auto !important;
            position: static !important;
        }
    `;
    (document.head || document.documentElement).appendChild(hideStyle);

    // 4. Create an Elegant Notification Toast Element
    function showToast(count) {
        const existing = document.getElementById('__adshield_toast__');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = '__adshield_toast__';
        toast.innerHTML = `🛡️ <b>AdShield:</b> Purged <b>${count}</b> elements.`;
        toast.style.cssText = `
            position: fixed; bottom: 20px; right: 20px; z-index: 2147483647;
            background: rgba(20, 20, 20, 0.9); color: #fff; padding: 12px 18px;
            border-radius: 8px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 13px; box-shadow: 0 8px 24px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1);
            backdrop-filter: blur(6px); transition: opacity 0.4s ease;
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    }

    // 5. Core Deep Sweeper Logic
    let totalPurged = 0;

    function deepPurge(root = document) {
        let count = 0;

        // A. Match and Destroy via Selectors (supports Shadow DOM traversal if open)
        try {
            root.querySelectorAll(AD_SELECTORS.join(',')).forEach(el => {
                el.remove();
                count++;
            });
        } catch (e) {
            // Fallback for malformed selector queries
        }

        // B. Purge Tracking and Ad Iframes
        root.querySelectorAll('iframe').forEach(iframe => {
            const src = iframe.src || iframe.getAttribute('data-src') || iframe.getAttribute('data-original') || '';
            if (AD_DOMAINS.some(domain => src.includes(domain))) {
                iframe.remove();
                count++;
            }
        });

        // C. Clean Sponsored Links & Parent Cards
        root.querySelectorAll('a[href*="doubleclick"], a[rel*="sponsored"], a[data-vars-action*="sponsored"]').forEach(link => {
            const parent = link.closest('div, section, article, li');
            if (parent && parent.children.length <= 3 && parent.innerText.length < 200) {
                parent.remove();
            } else {
                link.remove();
            }
            count++;
        });

        // D. Heuristic Structural Check for Fixed Overlays & Sticky Ad Blocks
        root.querySelectorAll('div, section, aside').forEach(el => {
            const style = window.getComputedStyle(el);
            const isFixedOrSticky = style.position === 'fixed' || style.position === 'sticky';
            const isFullWindow = el.offsetWidth >= (window.innerWidth * 0.9) && el.offsetHeight >= (window.innerHeight * 0.8);
            const highZIndex = parseInt(style.zIndex, 10) > 999;

            if (isFixedOrSticky && isFullWindow && highZIndex && !el.querySelector('article, main, p, form')) {
                el.remove();
                count++;
            }
        });

        // E. Deep Shadow DOM Inspection (Recursive component cleaner)
        root.querySelectorAll('*').forEach(el => {
            if (el.shadowRoot) {
                deepPurge(el.shadowRoot);
            }
        });

        totalPurged += count;
        return count;
    }

    // 6. Aggressive Global Protections
    // Neutralize window.open popups
    window.open = function(url) {
        console.warn('[AdShield] Prevented unwanted popup window redirect to:', url);
        return null;
    };

    // Intercept dynamic script injections from ad networks
    const originalAppendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function(child) {
        if (child && child.tagName === 'SCRIPT') {
            const src = child.src || '';
            if (AD_DOMAINS.some(domain => src.includes(domain))) {
                console.warn('[AdShield] Blocked injected ad script:', src);
                const dummy = document.createElement('span');
                dummy.style.display = 'none';
                return originalAppendChild.call(this, dummy);
            }
        }
        return originalAppendChild.call(this, child);
    };

    // 7. Execute Initial Sweep
    const initialCount = deepPurge();
    showToast(initialCount);

    // 8. Continuous DOM Mutation Observer (Dynamic Infinite Scroll Defenses)
    let throttleTimer = null;
    const observer = new MutationObserver((mutations) => {
        let hasNewNodes = false;
        for (const mut of mutations) {
            if (mut.addedNodes.length > 0) {
                hasNewNodes = true;
                break;
            }
        }
        if (hasNewNodes) {
            if (throttleTimer) clearTimeout(throttleTimer);
            throttleTimer = setTimeout(() => {
                deepPurge();
            }, 300);
        }
    });

    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    console.log(`[AdShield] Active protection layer engaged. Cleaned ${initialCount} elements on load.`);
})();
