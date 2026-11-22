/* 상동역 롯데캐슬 시그니처 · 고객 안내 공통 스크립트 */
(function () {
  var C = window.SIG = {
    site: '상동역 롯데캐슬 시그니처',
    who: '상담팀장 김성태',
    tel: '010-8315-9602',
    raw: '01083159602',
    code: '4321',
    form: 'https://docs.google.com/forms/d/e/1FAIpQLScoww7vWO-2Gkv2I73mLapcq1bywkjSalua_2MlVA6X8tvm-Q/',
    entry: {
      name: 'entry.554849393', tel: 'entry.1056892691', interest: 'entry.845129582', route: 'entry.129554350',
      consent: 'entry.1190781317', mkt: '%%E_MKT%%', memo: 'entry.894674831'
    }
  };
  var mem = {};
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return mem[k] || null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) { mem[k] = v; } }

  var ROUTES = { visit: '방문고객', ad: '광고', sim: '시뮬레이터', ref: '지인 소개' };
  (function () {
    var m = /[?&]from=([a-z]+)/.exec(location.search);
    if (m && ROUTES[m[1]] && !get('sig-route')) set('sig-route', ROUTES[m[1]]);
  })();
  C.route = function () { return get('sig-route') || '광고'; };
  C.unlocked = function () { return get('sig-unlocked') === '1'; };
  C.unlock = function () { set('sig-unlocked', '1'); };
  C.lead = function () { try { return JSON.parse(get('sig-lead') || 'null'); } catch (e) { return null; } };

  // 구글 폼으로 보내기 (숨은 iframe)
  C.submit = function (f) {
    return new Promise(function (resolve) {
      var name = 'sigpost' + Date.now();
      var ifr = document.createElement('iframe'); ifr.name = name; ifr.style.display = 'none'; ifr.setAttribute('aria-hidden', 'true');
      document.body.appendChild(ifr);
      var form = document.createElement('form'); form.method = 'POST'; form.action = C.form + 'formResponse'; form.target = name; form.style.display = 'none';
      function add(k, v) { if (!k || k.indexOf('%%') >= 0 || v == null || v === '') return; var i = document.createElement('input'); i.type = 'hidden'; i.name = k; i.value = v; form.appendChild(i); }
      var mktKnown = C.entry.mkt && C.entry.mkt.indexOf('%%') < 0;
      add(C.entry.name, f.name); add(C.entry.tel, f.tel); add(C.entry.interest, (f.interest || '') + (f.mkt && !mktKnown ? ' · 문자수신 동의' : ''));
      add(C.entry.route, f.route || C.route()); add(C.entry.consent, '동의합니다'); if (f.memo) add(C.entry.memo, f.memo); if (f.mkt) add(C.entry.mkt, '동의합니다');
      document.body.appendChild(form);
      var done = false; function fin() { if (done) return; done = true; resolve(true); setTimeout(function () { form.remove(); ifr.remove(); }, 2000); }
      ifr.addEventListener('load', fin); setTimeout(fin, 4000);
      form.submit();
    });
  };
  C.register = function (f) {
    return C.submit(f).then(function () {
      set('sig-lead', JSON.stringify({ name: f.name, tel: f.tel })); C.unlock(); return true;
    });
  };
  C.formUrl = function (interest, route) {
    var u = C.form + 'viewform?usp=pp_url&' + C.entry.route + '=' + encodeURIComponent(route || C.route());
    if (interest) u += '&' + C.entry.interest + '=' + encodeURIComponent(interest);
    return u;
  };
  C.sms = function (msg) { return 'sms:' + C.raw + '?&body=' + encodeURIComponent('[' + C.site + '] ' + msg); };
  C.validTel = function (t) { return /^01[016789]-?[0-9]{3,4}-?[0-9]{4}$/.test(String(t).replace(/\s/g, '')); };
  C.fmtTel = function (t) { var d = String(t).replace(/[^0-9]/g, ''); return d.length === 11 ? d.slice(0, 3) + '-' + d.slice(3, 7) + '-' + d.slice(7) : (d.length === 10 ? d.slice(0, 3) + '-' + d.slice(3, 6) + '-' + d.slice(6) : t); };
  C.guard = function (back) { if (!C.unlocked()) { if (/[?&]c=/.test(location.search)) set('sig-return', location.href); location.replace(back + '?need=1#reg'); } };
  C.afterUnlock = function () { var r = get('sig-return'); if (r) { try { localStorage.removeItem('sig-return'); } catch (e) {} mem['sig-return'] = null; location.href = r; return true; } return false; };
})();
