/* =====================================================================
   BILOPHUS · ANUNCIOS Y TELEGRAM MINI APP
   Rewarded Interstitial de Monetag (formato para Telegram Mini Apps).
   La configuración está en ads-config.js. No hace falta tocar este archivo.

   Regla de oro: showRewarded() devuelve una promesa que se resuelve con
   true SOLO si el SDK de Monetag confirma que el anuncio se completó.
   En cualquier otro caso (se cerró, se salteó, falló, no hay anuncio,
   tiempo agotado) devuelve false y el juego NO da recompensa.
   ===================================================================== */
(function () {
  'use strict';
  var cfg = window.BILOPHUS_ADS_CONFIG || {};
  var tg = window.Telegram && window.Telegram.WebApp;
  var inTelegram = !!(tg && tg.initData);            // true solo si se abrió dentro de Telegram
  var zone = String(cfg.monetagZoneId || '').trim();
  var src = String(cfg.monetagSdkSrc || '').trim();
  var fnName = String(cfg.monetagFunctionName || (zone ? 'show_' + zone : '')).trim();
  var configured = !!(zone && fnName);
  var pending = null, pre = null, sdkTried = false;

  /* ---------- Telegram Mini App ---------- */
  if (inTelegram) {
    try { tg.ready(); } catch (e) {}                 // avisa a Telegram que el juego cargó
    try { tg.expand(); } catch (e) {}                // usa toda la altura disponible
    // Evita que deslizar hacia abajo (usado para jugar) minimice la Mini App
    try { if (tg.disableVerticalSwipes) tg.disableVerticalSwipes(); } catch (e) {}
  }

  /* ---------- SDK de Monetag ---------- */
  function sdkFn() { return typeof window[fnName] === 'function' ? window[fnName] : null; }

  function loadSdk() {                                // inyecta el script de Monetag con tus datos
    if (sdkTried || !inTelegram || !configured || !src || sdkFn()) return;
    sdkTried = true;
    var s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.setAttribute('data-zone', zone);
    s.setAttribute('data-sdk', fnName);
    s.onload = preload;
    document.head.appendChild(s);
  }

  function newId() { return 'e' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

  function preload() {                                // precarga el anuncio (recomendado por Monetag)
    var f = sdkFn();
    if (!cfg.preload || !f || pre) return;
    var id = newId();
    pre = { id: id, ok: false };
    try {
      f({ type: 'preload', ymid: id })
        .then(function () { if (pre && pre.id === id) pre.ok = true; })
        .catch(function () { if (pre && pre.id === id) pre = null; });
    } catch (e) { pre = null; }
  }

  function waitSdk(ms) {                              // espera un poco a que cargue el SDK
    return new Promise(function (resolve) {
      var t = 0;
      (function check() {
        if (sdkFn()) return resolve(true);
        t += 100;
        if (t >= ms) return resolve(false);
        setTimeout(check, 100);
      })();
    });
  }

  function showReal(placement) {
    return waitSdk(4000).then(function (ok) {
      if (!ok) return false;
      var f = sdkFn();
      var id = (pre && pre.ok) ? pre.id : newId();
      pre = null;
      return new Promise(function (resolve) {
        var done = false;
        function end(v) { if (done) return; done = true; setTimeout(preload, 1500); resolve(v); }
        try {
          // Rewarded Interstitial: la promesa solo se cumple si el anuncio se completó.
          f({ ymid: id, requestVar: placement }).then(function () { end(true); }).catch(function () { end(false); });
        } catch (e) { end(false); }
      });
    });
  }

  /* ---------- Anuncio de prueba (NO es publicidad real) ---------- */
  function simulate() {
    return new Promise(function (resolve) {
      var ov = document.getElementById('ad'), tt = document.getElementById('adt');
      if (!ov || !tt) { resolve(false); return; }
      var t = 5; ov.hidden = false; tt.textContent = t;
      var i = setInterval(function () {
        t--; tt.textContent = t;
        if (t <= 0) { clearInterval(i); ov.hidden = true; resolve(true); }
      }, 1000);
    });
  }

  /* ---------- API pública ----------
     placement: 'duplicar_semillas' (botón voluntario de la portada)
                'revivir'           (botón al perder una vida)          */
  function showRewarded(placement) {
    if (pending) return pending;                      // evita lanzar dos anuncios a la vez
    loadSdk();
    var p;
    if (inTelegram && configured) p = showReal(placement);      // Telegram + Monetag: solo anuncio real
    else if (cfg.allowSimulation) p = simulate();                // web / pruebas
    else p = Promise.resolve(false);
    pending = p.then(function (v) { pending = null; return v === true; },
                     function () { pending = null; return false; });
    return pending;
  }

  window.BilophusAds = { showRewarded: showRewarded, inTelegram: inTelegram, configured: configured };

  document.addEventListener('DOMContentLoaded', function () { loadSdk(); preload(); });
})();
