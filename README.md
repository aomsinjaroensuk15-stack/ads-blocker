# 🛡️ ShieldMark — Ad-Blocker Bookmarklet

A pure-JavaScript **bookmarklet** for Chrome that removes ads, kills anti-adblock
nags and popunders, counts everything it blocks, and warns you before navigating
to external sites.

&gt; A bookmarklet cannot intercept network requests like uBlock Origin — it fights
&gt; at the **DOM level** with aggressive element removal + MutationObservers.
&gt; Goal: visually clear `canyoublockit.com` (advanced mode) and clean up everyday
&gt; browsing. It will not win against every anti-adblock detection script.

---

## ✨ Features

| Feature | What it does |
|---|---|
| 🧹 Ad removal | Removes elements matching ~70 selectors, class/id token patterns, and 40+ ad-network domains |
| 👁️ Live observer | MutationObserver zaps ads injected late (lazy ads, SPAs, popunders) |
| 🔢 Blocked counter | Floating badge top-right, pulses on every zap — click to minimize |
| 🚫 Popup defense | Overrides `window.open`, kills fixed full-viewport overlay ads & "disable your adblock" nags, restores scroll |
| ⚠️ Link guard | Intercepts **external** links → center-screen prompt: `❌ Decline` / `📋 Copy Link` / `✅ Allow` |
| 🧠 Content-safe | Skips `&lt;article&gt;`, `&lt;main&gt;`, `&lt;nav&gt;`, media, and long-text elements to avoid breaking real content |

## 📦 Install (Chrome)

1. **Copy the bookmarklet** — open `dist/bookmarklet.txt`, copy the entire single line
   (it starts with `javascript:(function(){`).
2. **Show the bookmarks bar**: press `Ctrl + Shift + B`.
3. **Right-click the bar → "Add page…"** (or press `Ctrl + Shift + O` → ⋮ top-right → "Add new bookmark").
4. **Name**: `🛡️ ShieldMark`
5. **URL field — the trick**: Chrome strips `javascript:` when you *paste*, so:
   - Type `java` with your keyboard first, then paste the rest of the code after it.
   - The full URL must start with `javascript:(function(){…`.
6. **Save**. Visit any page and **click the 🛡️ ShieldMark bookmark** to activate it.

&gt; ⚠️ You must click the bookmarklet once per page load — bookmarklets don't run
&gt; automatically. Want auto-run everywhere? Import the same code into
&gt; [Tampermonkey](https://www.tampermonkey.net/) as a userscript.

## 🧪 Test

- **Local**: open `dist/test-page.html` (has fake banners, a fake doubleclick
  iframe, a popup button, an anti-adblock nag overlay, and an external link).
- **Benchmark**: run it on &lt;https://canyoublockit.com&gt; in **Advanced Mode**.
- Debug any page from DevTools console: `__SHIELDMARK__.log` shows the last 200
  zaps with reasons.
  
## 🔧 Build from source

```bash
python build.py
```

## Installing Code
**Copy This Text to Put in the URL**:

```bash
javascript:(function () { if (window.__SHIELDMARK__) return; var s = document.createElement('script'); s.src = 'https://raw.githack.com/aomsinjaroensuk15-stack/ads-blocker/main/bookmarklet.js?t=' + Date.now(); (document.body || document.documentElement).appendChild(s); })();
