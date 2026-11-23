/* 상동역 롯데캐슬 시그니처 · 고객 안내 공통 스크립트
   - 고객 등록: 웹앱(구독자별 시트 · 동의 기록)이 있으면 웹앱으로, 없으면 구글 폼으로
   - 개인정보 안내 · 동의 칸(SIG.consentHTML / SIG.readConsent) · 질문(SIG.ask) · 수신거부(SIG.optout) · 답변(SIG.answer) */
(function () {
  function v(x) { return (x && String(x).indexOf('%%') < 0) ? x : ''; }
  var C = window.SIG = {
    site: '상동역 롯데캐슬 시그니처',
    who: '(주)디어',
    tel: '010-8315-9602',
    raw: '01083159602',
    code: '4321',
    sub: '',
    operator: v('디어 에듀테크') || '디어 에듀테크',
    collector: v('디어 에듀테크'),
    collectorTel: v('010-8315-9602'),
    processor: v(''),
    retention: v('수집일부터 6개월 (삭제를 요청하시면 바로 파기)') || '수집일부터 6개월 (삭제를 요청하시면 바로 파기)',
    api: v(''),
    sid: v('OWNER') || 'OWNER',
    cver: v('CV-20261123') || 'CV-20261123',
    optMode: v('link') || 'link',
    opt080: v(''),
    dataDate: v('2026-11-23') || '2026-11-23',
    form: 'https://docs.google.com/forms/d/e/1FAIpQLScoww7vWO-2Gkv2I73mLapcq1bywkjSalua_2MlVA6X8tvm-Q/',
    entry: {
      name: 'entry.554849393', tel: 'entry.1056892691', interest: 'entry.845129582', route: 'entry.129554350',
      consent: 'entry.1190781317', mkt: '%%E_MKT%%', memo: 'entry.894674831'
    }
  };
  if (!C.collector) C.collector = C.who;
  if (!C.collectorTel) C.collectorTel = C.tel;
  var mem = {};
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return mem[k] || null; } }
  function set(k, val) { try { localStorage.setItem(k, val); } catch (e) { mem[k] = val; } }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]; }); }
  C.esc = esc;
  C.base = (function () { var s = document.currentScript && document.currentScript.src; return s ? new URL('../', s).href : new URL('../', location.href).href; })();

  var ROUTES = { visit: '방문고객', ad: '광고', sim: '시뮬레이터', ref: '지인 소개', flyer: '전단', kakao: '카톡 안내', sheet: '사양서 QR', qa: '답변 링크' };
  (function () {
    var m = /[?&]from=([a-z]+)/.exec(location.search);
    if (m && ROUTES[m[1]] && !get('sig-route')) set('sig-route', ROUTES[m[1]]);
  })();
  C.route = function () { return get('sig-route') || '광고'; };
  C.unlocked = function () { return get('sig-unlocked') === '1'; };
  C.unlock = function () { set('sig-unlocked', '1'); };
  C.lead = function () { try { return JSON.parse(get('sig-lead') || 'null'); } catch (e) { return null; } };
  C.hasApi = function () { return /^https?:\/\//.test(C.api); };

  /* ---------- 개인정보 안내 · 동의 칸 ---------- */
  C.optoutLine = function () {
    return C.optMode === '080' && C.opt080 ? '무료 수신거부 ' + C.opt080 : '무료 수신거부 ' + C.base + 'optout/';
  };
  // o: {id:'g', purpose:'…', items:'…', mkt:true}
  C.consentHTML = function (o) {
    o = o || {}; var p = o.id || 'cs';
    return '<div class="cs-box"><b>개인정보 수집 · 이용 안내</b><ul>' +
      '<li>받는 곳: ' + esc(C.collector) + ' (' + esc(C.collectorTel) + ') · ' + esc(C.site) + ' 분양 상담</li>' +
      '<li>목적: ' + esc(o.purpose || '요청하신 상담 화면 열람, 고르신 호실의 계약 가능 여부 회신과 분양 상담 연락') + '</li>' +
      '<li>항목: ' + esc(o.items || '성함, 연락처 (고르신 호실 정보가 함께 전달됩니다)') + '</li>' +
      '<li>보유 기간: ' + esc(C.retention) + ' · 제3자 제공 없음</li>' +
      (C.processor ? '<li>처리 위탁: ' + esc(C.processor) + '</li>' : '') +
      '<li><b>동의하지 않으셔도 됩니다.</b> ' + esc(o.refuse || '이 경우 휴대폰 화면은 열리지 않지만 전화 상담이나 종이 사양서로 같은 내용을 안내받으실 수 있습니다.') + '</li></ul></div>' +
      '<label class="cs-ck"><input type="checkbox" id="' + p + '-ack"><span><b>[필수]</b> 위 개인정보 수집 · 이용에 동의합니다</span></label>' +
      (o.mkt === false ? '' :
        '<div class="cs-mkt"><p><b>[선택]</b> 분양 소식 · 혜택 등 광고성 정보를 받겠습니다 <span>받을 방법을 골라 주세요 · 안 골라도 상담은 그대로입니다</span></p>' +
        '<div class="cs-md"><label><input type="checkbox" id="' + p + '-sms"> 문자</label><label><input type="checkbox" id="' + p + '-kakao"> 카카오톡</label><label><input type="checkbox" id="' + p + '-call"> 전화</label></div>' +
        '<label class="cs-ck cs-night"><input type="checkbox" id="' + p + '-night" disabled><span>[선택] 밤 9시~아침 8시에도 받겠습니다</span></label>' +
        '<p class="cs-fine">광고는 동의하신 방법으로만 보내며, 언제든 ' + esc(C.optoutLine()) + ' 로 끊을 수 있습니다. 동의 일시와 문구(' + esc(C.cver) + ')가 기록됩니다.</p></div>');
  };
  C.bindConsent = function (root, p) {
    p = p || 'cs'; var q = function (s) { return root.querySelector('#' + p + '-' + s); };
    var n = q('night'); if (!n) return;
    var upd = function () { var any = q('sms').checked || q('kakao').checked || q('call').checked; n.disabled = !any; if (!any) n.checked = false; };
    ['sms', 'kakao', 'call'].forEach(function (k) { q(k).addEventListener('change', upd); });
  };
  C.readConsent = function (root, p) {
    p = p || 'cs'; var q = function (s) { var e = root.querySelector('#' + p + '-' + s); return !!(e && e.checked); };
    var o = { ver: C.cver, ack: q('ack'), sms: q('sms'), kakao: q('kakao'), tel: q('call'), night: false };
    o.night = q('night') && (o.sms || o.kakao || o.tel);
    return o;
  };
  function consentMemo(cs) {
    if (!cs) return '';
    var m = [cs.sms ? '문자' : '', cs.kakao ? '카톡' : '', cs.tel ? '전화' : ''].filter(Boolean).join('·');
    return '[동의 ' + cs.ver + ' · 광고 ' + (m || '없음') + (cs.night ? ' · 야간' : '') + ']';
  }

  /* ---------- 보내기 ---------- */
  function post(o) {
    o.sid = C.sid; o.page = o.page || (document.title + ' · ' + location.pathname.split('/').slice(-2).join('/'));
    return fetch(C.api, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(o) }).then(function (r) { return r.json(); });
  }
  C.post = post;
  // 구글 폼으로 보내기 (숨은 iframe) · 웹앱이 없거나 실패했을 때
  C.submitForm = function (f) {
    return new Promise(function (resolve) {
      var name = 'sigpost' + Date.now();
      var ifr = document.createElement('iframe'); ifr.name = name; ifr.style.display = 'none'; ifr.setAttribute('aria-hidden', 'true');
      document.body.appendChild(ifr);
      var form = document.createElement('form'); form.method = 'POST'; form.action = C.form + 'formResponse'; form.target = name; form.style.display = 'none';
      function add(k, val) { if (!k || k.indexOf('%%') >= 0 || val == null || val === '') return; var i = document.createElement('input'); i.type = 'hidden'; i.name = k; i.value = val; form.appendChild(i); }
      var mkt = f.consent ? (f.consent.sms || f.consent.kakao || f.consent.tel) : f.mkt;
      var mktKnown = C.entry.mkt && C.entry.mkt.indexOf('%%') < 0;
      add(C.entry.name, f.name); add(C.entry.tel, f.tel); add(C.entry.interest, (f.interest || '') + (mkt && !mktKnown ? ' · 광고 수신 동의' : ''));
      var rt = f.route || C.route(), ok = ['방문고객', '광고', '시뮬레이터', '지인 소개', '기타'].indexOf(rt) >= 0;
      add(C.entry.route, ok ? rt : '기타'); add(C.entry.consent, '동의합니다');
      var memo = (C.sub ? '[구독자 ' + C.sub + '] ' : '') + (ok ? '' : '[유입 ' + rt + '] ') + consentMemo(f.consent) + ' ' + (f.memo || ''); memo = memo.trim();
      if (memo) add(C.entry.memo, memo); if (mkt) add(C.entry.mkt, '동의합니다');
      document.body.appendChild(form);
      var done = false; function fin() { if (done) return; done = true; resolve(true); setTimeout(function () { form.remove(); ifr.remove(); }, 2000); }
      ifr.addEventListener('load', fin); setTimeout(fin, 4000);
      form.submit();
    });
  };
  // f: {name, tel, interest, memo, route, consent, mkt}
  C.submit = function (f) {
    if (!C.hasApi()) return C.submitForm(f);
    return post({ op: 'lead', name: f.name, tel: f.tel, interest: f.interest || '', route: f.route || C.route(), memo: f.memo || '', consent: f.consent || null })
      .then(function (j) { if (!j || !j.ok) throw new Error('lead'); return true; })
      .catch(function () { return C.submitForm(f); });
  };
  C.register = function (f) {
    return C.submit(f).then(function () {
      set('sig-lead', JSON.stringify({ name: f.name, tel: f.tel, at: Date.now(), cver: f.consent ? f.consent.ver : '' })); C.unlock(); return true;
    });
  };
  C.asks = function () { try { return JSON.parse(get('sig-asks') || '[]'); } catch (e) { return []; } };
  // 질문 보내기 → {ok, id} · 웹앱이 없으면 {fallback:true, sms}
  C.ask = function (f) {
    var body = '[' + C.site + ' 질문] ' + (f.name || '') + ' ' + (f.tel || '') + '\n' + f.q;
    var fb = { fallback: true, sms: 'sms:' + C.raw + '?&body=' + encodeURIComponent(body) };
    if (!C.hasApi()) return Promise.resolve(fb);
    return post({ op: 'ask', name: f.name, tel: f.tel, q: f.q, page: f.page }).then(function (j) {
      if (!j || !j.ok) { if (j && j.why === 'wait') return { ok: false, why: 'wait' }; throw new Error('ask'); }
      var a = C.asks(); a.unshift({ id: j.id, at: Date.now(), q: String(f.q).slice(0, 80) }); set('sig-asks', JSON.stringify(a.slice(0, 20)));
      return { ok: true, id: j.id };
    }).catch(function () { return fb; });
  };
  C.answer = function (id) {
    if (!C.hasApi()) return Promise.resolve({ ok: false, why: 'noapi' });
    return fetch(C.api + '?op=aget&sid=' + encodeURIComponent(C.sid) + '&a=' + encodeURIComponent(id), { cache: 'no-store' }).then(function (r) { return r.json(); });
  };
  C.optout = function (f) {
    if (!C.hasApi()) return C.submitForm({ name: '수신거부', tel: f.tel, interest: '수신거부 · ' + f.media, memo: '[수신거부 ' + f.media + ']', route: '기타' }).then(function () { return { ok: true, via: 'form' }; });
    return post({ op: 'optout', tel: f.tel, media: f.media }).then(function (j) { if (!j || !j.ok) throw new Error('optout'); return j; })
      .catch(function () { return C.submitForm({ name: '수신거부', tel: f.tel, interest: '수신거부 · ' + f.media, memo: '[수신거부 ' + f.media + ']', route: '기타' }).then(function () { return { ok: true, via: 'form' }; }); });
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

  /* ---------- 동의 칸 모양 (한 번만) ---------- */
  (function () {
    if (document.getElementById('cs-css')) return;
    var s = document.createElement('style'); s.id = 'cs-css';
    s.textContent = '.cs-box{background:#F7F4EE;border:1px solid #E3DCCF;border-radius:12px;padding:12px 14px;font-size:13.5px;line-height:1.55;color:#3D4454;margin-top:12px}.cs-box b{color:#141B2D}.cs-box ul{margin:6px 0 0;padding-left:18px}.cs-box li{margin:2px 0}' +
      '.cs-ck{display:flex;gap:9px;align-items:flex-start;margin-top:10px;font-size:14.5px;line-height:1.45;cursor:pointer}.cs-ck input,.cs-md input{width:20px;height:20px;flex:none;margin:1px 0 0;accent-color:#141B2D}' +
      '.cs-mkt{margin-top:10px;border-top:1px dashed #E3DCCF;padding-top:10px}.cs-mkt p{margin:0;font-size:14.5px}.cs-mkt p span{display:block;font-size:12.5px;color:#6A7180}' +
      '.cs-md{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}.cs-md label{display:flex;gap:6px;align-items:center;border:1.5px solid #DDD5C6;border-radius:999px;padding:6px 12px;font-size:14px;cursor:pointer;background:#fff}' +
      '.cs-night input:disabled+span{opacity:.45}.cs-fine{font-size:12px!important;color:#6A7180;margin-top:8px!important;word-break:break-all}';
    (document.head || document.documentElement).appendChild(s);
  })();
})();
