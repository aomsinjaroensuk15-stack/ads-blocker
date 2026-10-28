/* ============================================================
   ShieldMark core engine
   Runs inside one big IIFE, wrapped by build.py into a
   javascript:(function(){ ... })(); bookmarklet.

   STYLE RULE (required by build.py):
   - no inline // comments, only full-line comments
   - every statement ends with ';' and stays on one line
   ============================================================ */
(function () {
  if (window.__SHIELDMARK__) return;
  window.__SHIELDMARK__ = { blocked: 0, log: [] };
  var SM = window.__SHIELDMARK__;

  /* ---------------- counter badge UI ---------------- */
  var css = '#__sm_ui{position:fixed;top:12px;right:12px;z-index:2147483647;background:#0f172a;color:#e2e8f0;font:600 13px/1.4 system-ui,-apple-system,Segoe UI,sans-serif;padding:8px 12px;border-radius:999px;box-shadow:0 4px 14px rgba(0,0,0,.35);display:flex;align-items:center;gap:8px;cursor:pointer;user-select:none;border:1px solid #334155;transition:transform .15s ease}#__sm_ui:hover{transform:scale(1.05)}#__sm_ui.__sm_pulse{animation:__sm_p .4s ease}#__sm_ui.__sm_min{padding:6px 8px}#__sm_ui .__sm_n{color:#4ade80;font-variant-numeric:tabular-nums}@keyframes __sm_p{0%{transform:scale(1)}40%{transform:scale(1.18)}100%{transform:scale(1)}}';
  var style = document.createElement('style');
  style.textContent = css;
  document.documentElement.appendChild(style);

  var ui = document.createElement('div');
  ui.id = '__sm_ui';
  ui.title = 'ShieldMark - click to minimize';
  ui.innerHTML = '<span>🛡️</span><span class="__sm_n">0</span><span class="__sm_lbl">blocked</span>';
  document.documentElement.appendChild(ui);
  var nEl = ui.querySelector('.__sm_n');
  var lblEl = ui.querySelector('.__sm_lbl');

  ui.addEventListener('click', function () {
    ui.classList.toggle('__sm_min');
    lblEl.style.display = ui.classList.contains('__sm_min') ? 'none' : '';
  });

  function updateUI(why) {
    nEl.textContent = SM.blocked;
    ui.title = 'ShieldMark - ' + SM.blocked + ' blocked' + (why ? ' - last: ' + why : '');
    ui.classList.remove('__sm_pulse');
    void ui.offsetWidth;
    ui.classList.add('__sm_pulse');
  }

  /* ---------------- helpers ---------------- */
  function isSafeContent(el) {
    if (el.matches && el.matches('article,main,[role="main"],video,audio,nav,form,header,input,select,textarea,[id^="__sm_"]')) return true;
    var t = (el.textContent || '').trim();
    return t.length > 400;
  }

  function zap(el, why) {
    if (!el || !el.parentNode) return;
    el.parentNode.removeChild(el);
    SM.blocked++;
    if (SM.log.length < 200) SM.log.push({ why: why, tag: el.tagName, cls: typeof el.className === 'string' ? el.className.slice(0, 60) : '' });
    updateUI(why);
  }

  function isAdEl(el) {
    if (!el || el.nodeType !== 1) return false;
    var t = el.tagName;
    if (t === 'HTML' || t === 'BODY' || t === 'HEAD' || t === 'SCRIPT' || t === 'STYLE' || t === 'LINK' || t === 'META') return false;
    if (el.id && el.id.indexOf('__sm_') === 0) return false;
    var src = el.getAttribute && el.getAttribute('src');
    if (src && SM_AD_HOST.test(src)) return true;
    if (el.matches && el.matches(SM_SEL_STR)) return true;
    var cls = typeof el.className === 'string' ? el.className : '';
    if (cls && cls.length < 150 && SM_TOKEN_RE.test(cls)) return true;
    var id = el.id || '';
    if (id && id.length < 150 && SM_TOKEN_RE.test(id)) return true;
    return false;
  }

  /* ---------------- overlay / nag killer ---------------- */
  function killOverlays() {
    if (!document.body) return;
    var cands = document.querySelectorAll('[class],[id]');
    for (var i = 0; i < cands.length; i++) {
      var el = cands[i];
      if (el.id && el.id.indexOf('__sm_') === 0) continue;
      if (el.closest && el.closest('#__sm_guard')) continue;
      var hint = (typeof el.className === 'string' ? el.className : '') + ' ' + (el.id || '');
      if (!SM_OVERLAY_RE.test(hint)) {
        if (el.children.length !== 0) continue;
        if (!SM_NAG_RE.test((el.textContent || '').slice(0, 300))) continue;
      }
      var cs;
      try { cs = getComputedStyle(el); } catch (e) { continue; }
      if (cs.position !== 'fixed' && cs.position !== 'sticky' && cs.position !== 'absolute') continue;
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      var r = el.getBoundingClientRect();
      var view = window.innerWidth * window.innerHeight;
      if (r.width * r.height < view * 0.45) continue;
      var hay = hint + ' ' + (el.textContent || '').slice(0, 300);
      if (SM_OVERLAY_RE.test(hay) || SM_NAG_RE.test(hay)) {
        if (!isSafeContent(el)) {
          zap(el, 'overlay/nag');
          document.documentElement.style.setProperty('overflow', 'auto', 'important');
          document.body.style.setProperty('overflow', 'auto', 'important');
        }
      }
    }
  }

  /* ---------------- sweeps ---------------- */
  function sweepNode(node) {
    if (!node) return;
    if (node.nodeType === 1) {
      if (node.id && node.id.indexOf('__sm_') === 0) return;
      if (isAdEl(node) && !isSafeContent(node)) { zap(node, 'direct'); return; }
      var found = node.querySelectorAll ? node.querySelectorAll(SM_SEL_STR + ',iframe,img,[class],[id]') : [];
      for (var i = 0; i < found.length; i++) {
        var el = found[i];
        if (el.id && el.id.indexOf('__sm_') === 0) continue;
        if (isAdEl(el) && !isSafeContent(el)) zap(el, 'nested');
      }
    }
    killOverlays();
  }

  function fullSweep() {
    var all = document.querySelectorAll('body *');
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      if (el.id && el.id.indexOf('__sm_') === 0) continue;
      if (isAdEl(el) && !isSafeContent(el)) zap(el, 'sweep');
    }
    killOverlays();
  }

  /* ---------------- mutation observers ---------------- */
  var sweepQueued = false;
  function scheduleSweep() {
    if (sweepQueued) return;
    sweepQueued = true;
    setTimeout(function () { sweepQueued = false; fullSweep(); }, 250);
  }

  var mo = new MutationObserver(function (muts) {
    for (var i = 0; i < muts.length; i++) {
      var m = muts[i];
      if (m.target && m.target.id && m.target.id.indexOf('__sm_') === 0) continue;
      for (var j = 0; j < m.addedNodes.length; j++) {
        var n = m.addedNodes[j];
        if (n.nodeType === 1 && n.id && n.id.indexOf('__sm_') === 0) continue;
        sweepNode(n);
      }
    }
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });

  var mo2 = new MutationObserver(scheduleSweep);
  mo2.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'src', 'id'], subtree: true });
  setTimeout(function () { mo2.disconnect(); }, 30000);

  var iv = setInterval(fullSweep, 3000);
  setTimeout(function () { clearInterval(iv); }, 90000);

  /* ---------------- popup / popunder defense ---------------- */
  window.open = function () {
    SM.blocked++;
    if (SM.log.length < 200) SM.log.push({ why: 'window.open', url: arguments[0] ? String(arguments[0]).slice(0, 120) : '' });
    updateUI('window.open');
    return null;
  };

  /* ---------------- link guard (external links) ---------------- */
  var SM_BYPASS = false;

  function copyText(txt, btn) {
    function done() {
      btn.textContent = '✓ Copied!';
      setTimeout(function () { btn.textContent = '📋 Copy Link'; }, 1200);
    }
    function legacy() {
      var ta = document.createElement('textarea');
      ta.value = txt;
      ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      ta.remove();
      done();
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(done, legacy);
    } else {
      legacy();
    }
  }

  function guardShow(url) {
    var ov = document.createElement('div');
    ov.id = '__sm_guard';
    ov.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:rgba(2,6,23,.72);display:flex;align-items:center;justify-content:center;font-family:system-ui,-apple-system,Segoe UI,sans-serif;';
    var box = document.createElement('div');
    box.style.cssText = 'background:#0f172a;color:#e2e8f0;border:1px solid #334155;border-radius:16px;padding:24px;max-width:440px;width:calc(100% - 48px);box-shadow:0 20px 60px rgba(0,0,0,.5);text-align:center;';
    var h = document.createElement('div');
    h.textContent = '⚠️ Leave this site?';
    h.style.cssText = 'font-size:19px;font-weight:700;margin-bottom:8px;color:#f8fafc;';
    var p = document.createElement('div');
    p.textContent = "You're about to open:";
    p.style.cssText = 'font-size:13px;color:#94a3b8;margin-bottom:10px;';
    var u = document.createElement('div');
    u.textContent = url;
    u.title = url;
    u.style.cssText = 'font-size:12px;word-break:break-all;background:#1e293b;border:1px solid #334155;border-radius:8px;padding:10px;margin-bottom:18px;color:#7dd3fc;max-height:90px;overflow:auto;text-align:left;';
    var row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:10px;justify-content:center;flex-wrap:wrap;';
    function mkBtn(txt, bg, fg) {
      var b = document.createElement('button');
      b.textContent = txt;
      b.style.cssText = 'border:0;border-radius:10px;padding:10px 16px;font-size:14px;font-weight:600;cursor:pointer;background:' + bg + ';color:' + fg + ';';
      return b;
    }
    var bNo = mkBtn('❌ Decline', '#334155', '#e2e8f0');
    var bCp = mkBtn('📋 Copy Link', '#1d4ed8', '#ffffff');
    var bOk = mkBtn('✅ Allow', '#15803d', '#ffffff');
    bNo.addEventListener('click', function () { ov.remove(); });
    bCp.addEventListener('click', function () { copyText(url, bCp); });
    bOk.addEventListener('click', function () {
      ov.remove();
      SM_BYPASS = true;
      var a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { SM_BYPASS = false; }, 800);
    });
    row.appendChild(bNo);
    row.appendChild(bCp);
    row.appendChild(bOk);
    box.appendChild(h);
    box.appendChild(p);
    box.appendChild(u);
    box.appendChild(row);
    ov.appendChild(box);
    ov.addEventListener('click', function (e) { if (e.target === ov) ov.remove(); });
    document.documentElement.appendChild(ov);
  }

  document.addEventListener('click', function (e) {
    if (SM_BYPASS) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a || ui.contains(a)) return;
    var href = a.getAttribute('href') || '';
    if (!href || href.charAt(0) === '#') return;
    if (/^\s*javascript:/i.test(href)) return;
    var dest;
    try { dest = new URL(a.href, location.href); } catch (err) { return; }
    if (!/^https?:$/.test(dest.protocol)) return;
    if (dest.origin === location.origin) return;
    e.preventDefault();
    e.stopPropagation();
    guardShow(dest.href);
  }, true);

  /* ---------------- init ---------------- */
  fullSweep();
})();
