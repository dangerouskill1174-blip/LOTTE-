/* 구독 확인 · 구독이 끝나면 이 태블릿의 상담 자료를 잠그고 지웁니다 */
(function () {
  var KEY = 'sig-sub', DAY = 864e5;
  function get() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} }
  function endOf(d) { return Date.parse(d + 'T23:59:59+09:00'); }
  function fmt(d) { return d.replace(/-/g, '.'); }
  var base = (document.currentScript && document.currentScript.src) ? new URL('./', document.currentScript.src).href : new URL('./', location.href).href;

  function wipe() {
    try { ['sig-staff-k', 'hosil', 'sig-lead', 'sig-board', 'sig-help-seen'].forEach(function (k) { localStorage.removeItem(k); sessionStorage.removeItem(k); }); } catch (e) {}
    try { if (window.caches) caches.keys().then(function (ks) { ks.forEach(function (k) { if (k.indexOf('desk-') === 0) caches.delete(k); }); }); } catch (e) {}
  }
  function judge(st, now) {
    if (!st || !st.sub) return { ok: false, why: 'first' };
    var s = st.sub;
    if (s.status !== 'active') return { ok: false, why: 'stopped', sub: s };
    if (now > endOf(s.until)) return { ok: false, why: 'expired', sub: s };
    var grace = (s.grace_days || 7) * DAY;
    if (now - st.checkedAt > grace) return { ok: false, why: 'offline', sub: s };
    if (now < (st.seenMax || 0) - 36 * 36e5) return { ok: false, why: 'clock', sub: s };
    return { ok: true, sub: s, left: Math.ceil((endOf(s.until) - now) / DAY) };
  }
  var SUB = window.SIGSUB = {
    check: function () {
      var st = get();
      return fetch(base + 'sub.json?t=' + Date.now(), { cache: 'no-store' }).then(function (r) {
        if (!r.ok) throw new Error('http');
        var srv = Date.parse(r.headers.get('date') || '') || Date.now();
        return r.json().then(function (sub) {
          var now = Math.max(srv, Date.now() - 5 * 60e3);
          st = { sub: sub, checkedAt: srv, seenMax: Math.max((st && st.seenMax) || 0, srv) };
          set(st); return judge(st, now);
        });
      }).catch(function () {
        var now = Date.now();
        if (st) { st.seenMax = Math.max(st.seenMax || 0, now); set(st); }
        return judge(st, now);
      }).then(function (res) {
        if (!res.ok && (res.why === 'stopped' || res.why === 'expired')) wipe();
        if (res.ok) { try { if (window.caches && navigator.serviceWorker && navigator.serviceWorker.controller) caches.keys().then(function (ks) { if (!ks.some(function (k) { return k.indexOf('desk-') === 0; })) navigator.serviceWorker.controller.postMessage('precache'); }); } catch (e) {} }
        SUB.last = res; return res; });
    },
    screen: function (res) {
      var t = { stopped: ['구독이 해지되어 자료가 잠겼습니다', '이 태블릿에 저장된 상담 자료와 고객 기록을 지웠습니다. 구독을 다시 시작하면 바로 열립니다.'],
        expired: ['구독 기간이 끝나 자료가 잠겼습니다', (res.sub ? fmt(res.sub.until) + '까지 구독이었습니다. ' : '') + '이 태블릿에 저장된 상담 자료와 고객 기록을 지웠습니다. 구독을 연장하면 바로 다시 열립니다.'],
        offline: ['인터넷에 연결해 구독을 확인해 주세요', '인터넷 없이 쓸 수 있는 기간(' + ((res.sub && res.sub.grace_days) || 7) + '일)이 지났습니다. 와이파이나 데이터에 연결한 뒤 다시 열어 주세요.'],
        clock: ['태블릿 날짜를 확인해 주세요', '태블릿 날짜가 실제와 다릅니다. 날짜를 자동으로 맞추고 인터넷에 연결한 뒤 다시 열어 주세요.'],
        first: ['인터넷에 연결해 주세요', '처음 한 번은 인터넷에 연결해 구독을 확인해야 열립니다.'] }[res.why];
      return '<div style="min-height:calc(100vh - 60px);display:flex;align-items:center;justify-content:center;padding:24px;font-family:\'Noto Sans KR\',\'Apple SD Gothic Neo\',sans-serif"><div style="max-width:480px;width:100%;background:#fff;border:1px solid #E6E0D5;border-radius:24px;padding:32px;box-shadow:0 18px 40px rgba(15,23,41,.12);color:#0F1729">' +
        '<p style="margin:0;font-size:12px;letter-spacing:.2em;font-weight:700;color:#A4432F">구독 확인</p><h1 style="margin:10px 0 0;font-family:\'Noto Serif KR\',serif;font-size:26px;line-height:1.3">' + t[0] + '</h1><p style="margin:12px 0 0;color:#5E6677;line-height:1.6">' + t[1] + '</p>' +
        '<button onclick="location.reload()" style="margin-top:20px;width:100%;min-height:52px;border:none;border-radius:12px;background:#0F1729;color:#F5F1E8;font-size:16px;font-weight:700;font-family:inherit">다시 확인</button></div></div>';
    },
    banner: function (res) {
      if (!res.ok || res.left > 7) return '';
      return '<div style="background:#A4432F;color:#fff;font-weight:700;font-size:14px;padding:8px 16px;text-align:center">구독이 ' + res.left + '일 뒤(' + fmt(res.sub.until) + ') 끝납니다. 끝나면 이 태블릿의 자료가 잠깁니다.</div>';
    }
  };
})();
