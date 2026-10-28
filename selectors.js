/* ============================================================
   ShieldMark - selector & pattern lists
   Loaded before core.js. Edit freely: add your own selectors
   or ad domains here, then re-run build.py
   ============================================================ */

// Big selector list joined into one string for querySelectorAll / matches()
var SM_SEL_STR = [
  'ins.adsbygoogle', '.adsbygoogle', '[data-ad-slot]', '[data-ad-unit]',
  '[data-adunit]', '[data-ad-unit-path]',
  '[id^="google_ads"]', '[id^="div-gpt-ad"]', '[id^="ad_"]', '[id^="ads_"]',
  '[class^="ad-"]', '[class*="-ad-"]', '[class$="-ad"]', '[class$="_ad"]',
  '[id$="-ad"]', '[id$="_ad"]',
  '.ad', '#ad', '.ads', '#ads', '.advert', '.advertisement', '.advertising',
  '.sponsored', '.sponsor', '.promo', '.promotion',
  '.adsense', '#adsense', '.ad-container', '.ad-wrapper', '.ad-banner',
  '[class*="banner-ad"]', '[class*="ad-banner"]', '[id*="banner-ad"]',
  '[class*="taboola"]', '[id*="taboola"]', '[class*="outbrain"]',
  '[id*="outbrain"]', '[class*="revcontent"]', '[class*="mgid"]',
  '.popup-ad', '.popunder', '[class*="interstitial"]', '[class*="prebid"]'
].join(',');

// Token regex: matches whole class/id TOKENS like "ad", "top-ad", "ad_banner"
// (\\s, - and _ are token boundaries, so "header" or "shadow" never match)
var SM_AD_TOKENS = '(^|[\\s\\-_])(ad|ads|advert|advertisement|advertising|banner|sponsor|sponsored|promo|promotion|popup|popunder|prebid|adunit|adbox|adsbox|adcontainer|adwrap|adwrapper|adspace|adslot|adholder|adframe|dfp|gpt|yield|monetization)([\\s\\-_]|$)';
var SM_TOKEN_RE = new RegExp(SM_AD_TOKENS, 'i');

// Ad-network domains: checked against the src of iframes / imgs / embeds
var SM_AD_HOST = /(doubleclick\.net|2mdn\.net|googlesyndication\.com|adservice\.google\.|googleadservices\.com|amazon-adsystem\.com|adsrvr\.org|adnxs\.com|taboola\.com|outbrain\.(com|net)|scorecardresearch\.com|moatads\.com|quantserve\.com|criteo\.(com|net)|pubmatic\.com|rubiconproject\.com|openx\.net|adform\.net|smartadserver\.com|exosrv\.com|popads\.net|propellerads\.com|revcontent\.com|mgid\.com|bidswitch\.net|contextweb\.com|adsafeprotected\.com|adroll\.com|advertising\.com|adtechus\.com|mathtag\.com|flashtalking\.com|plista\.com|ligatus\.com|onclickads\.net|popcash\.net)/i;

// "Anti-adblock nag" text pattern (matched against overlay text)
var SM_NAG_RE = /(ad.?block|whitelist (us|our site|this site)|please (disable|turn off|allow)[^.,]{0,40}ad|support (us|our)[^.,]{0,50}(disabl|whiteli)|detected[^.,]{0,25}ad.?block)/i;

// Full-viewport overlay patterns (class/id hints)
var SM_OVERLAY_RE = /(^|[\s\-_])(popup|popupad|overlay|underlay|modal|dialog|interstitial|backdrop|nag|notice)([\s\-_]|$)|adblock/i;
