/* 상담 데스크 · 현장 공유: 대기 고객 · 호실 진행권(팀장 보고) · 혜택(디어가 현장별로 넣음) · 알림
   모든 자료는 웹앱이 '이 상담사의 현장' 것만 보냅니다. 시연판은 서버에 쓰지 않고 예시만 보여 줍니다. */
(function () {
  'use strict';
  var LINES = {"101-1": "113B", "101-2": "84E", "101-3": "84F", "101-4": "84F", "101-5": "84C", "101-6": "84B", "102-1": "113A", "102-2": "84E", "102-3": "84F", "102-4": "84F", "102-5": "84C", "102-6": "84A", "103-1": "113A", "103-2": "84E", "103-3": "121", "103-4": "121", "103-5": "84D", "103-6": "84A", "104-1": "84A", "104-2": "84E", "104-3": "121", "104-4": "121", "104-5": "84D", "104-6": "113A", "105-1": "84A", "105-2": "84C", "105-3": "84F", "105-4": "84F", "105-5": "84C", "105-6": "113A", "106-1": "84A", "106-2": "84C", "106-3": "84F", "106-4": "84F", "106-5": "84C", "106-6": "113A", "107-1": "84B", "107-2": "84C", "107-3": "84F", "107-4": "84F", "107-5": "84C", "107-6": "113B"};   // '101-1' → '113B'  (호실 고르기 자료에서 자동)
  var BANDS = [['b4', '4층', 4, 4], ['b5', '5층', 5, 5], ['b69', '6~9층', 6, 9], ['b1019', '10~19층', 10, 19], ['b2025', '20~25층', 20, 25], ['b2739', '27~39층', 27, 39], ['b40', '40층 이상', 40, 49]];
  var OWNER = 'OWNER' === 'OWNER', CONTACT = { op: '디어 에듀테크', tel: '010-8315-9602' };
  var $ = function (q, r) { return (r || document).querySelector(q); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]; }); }
  function X() { return window.DESKX || {}; }
  function toast(t) { if (window.DESK && DESK.toast) DESK.toast(t); }
  function demo() { try { return localStorage.getItem('sig-demo') === '1'; } catch (e) { return false; } }
  function hasApi() { return X().hasApi && X().hasApi(); }
  function api(op, b) { return X().api(op, b); }
  function lget(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function lset(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
  function bandOf(f) { f = +f; for (var i = 0; i < BANDS.length; i++) if (f >= BANDS[i][2] && f <= BANDS[i][3]) return BANDS[i]; return null; }
  function qr(t) { try { var q = qrcode(0, 'L'); q.addData(t); q.make(); return q.createDataURL(6, 3); } catch (e) { return ''; } }
  var DEMO = { site: 'SDLC', siteName: '상동역 롯데캐슬 시그니처', isLead: true, leader: '',
    promos: [{ id: 'P-demo', name: '(예시) 계약 축하 혜택', body: '시연용 예시 문구입니다. 실제 혜택은 시행사 승인 후 디어가 넣습니다.', from: '', to: '', cond: '시연용', basis: '시연판 예시', dev: '' }],
    holds: [{ id: 'H-demo1', unitText: '107동 3호 라인 21층 84F', status: '임시 확보', mine: false, lead: true, who: '직원 (예시)', cust: '김○○', visit: '2026-11-26 14:00', req: '2026-11-24 15:02', over: false },
      { id: 'H-demo2', unitText: '106동 2호 라인 12층 84C', status: '진행 확정', mine: true, lead: true, who: '나', cust: '이○○', visit: '2026-11-24 11:00', req: '2026-11-24 09:40', over: true }],
    alerts: [{ id: 'A-demo1', at: '2026-11-24 15:00', kind: '호실 다시 나옴', unit: '107동 3호 라인 21층 84F', text: '107동 3호 라인 21층 84F이(가) 다시 상담 가능해졌습니다.' }, { id: 'A-demo2', at: '2026-11-24 13:10', kind: '계약됨', unit: '105동 6호 라인 22층 113A', text: '계약되었습니다. 기다리던 고객께 알리고 차선책을 여쭤 보세요.' }] };
  var WDEMO = [{ id: 'W-demo1', at: '2026-11-20 14:10', name: '김고객 (예시)', tel: '010-0000-0000', cond: { dong: '107', type: '84F', band: 'b2025', bandName: '20~25층' }, condText: '107동 · 84F · 20~25층', sms: true, kakao: true, status: '대기' }];

  /* ---------- 1분마다 현장 소식 받기 ---------- */
  var S = lget('sig-sync');
  function data() { if (demo()) return DEMO; if (!hasApi()) return { site: 'SDLC', siteName: '상동역 롯데캐슬 시그니처', promos: [], holds: [], alerts: [] }; return (S && S.d) || null; }
  function sync() {
    if (demo() || !hasApi() || !window.DESK || !DESK.raw) return Promise.resolve(data());
    return api('sync').then(function (j) { S = { t: Date.now(), d: j }; lset('sig-sync', S); paint(); return j; }).catch(function () { return data(); });
  }
  setInterval(function () { if (document.visibilityState === 'visible' && document.getElementById('root')) sync(); }, 60e3);
  function counts(d) { var a = (d && d.alerts) || [], h = (d && d.holds) || [];
    return { open: a.filter(function (x) { return x.kind === '호실 다시 나옴'; }).length, req: h.filter(function (x) { return x.lead && !x.mine && x.status === '임시 확보'; }).length,
      over: h.filter(function (x) { return x.over && (x.mine || x.lead); }).length, done: a.filter(function (x) { return x.kind === '계약됨'; }).length, promo: a.filter(function (x) { return x.kind === '새 혜택'; }).length }; }
  /* 상담 데스크 첫 화면: 현장 이름 · 알림 띠 */
  function paint() {
    var d = data(), host = $('#wBan'); if (!host || !d) return; var c = counts(d), a = [];
    if (c.req) a.push('<b>팀장 승인 요청 ' + c.req + '건</b>'); if (c.open) a.push('대기 고객과 맞는 호실 ' + c.open + '건'); if (c.over) a.push('방문 예정 시간 지남 ' + c.over + '건');
    if (c.done) a.push('계약됨 알림 ' + c.done + '건'); if (c.promo) a.push('새 혜택 ' + c.promo + '건');
    host.innerHTML = '<p class="sitep">지금 현장 · <b>' + esc(d.siteName || '') + '</b>' + (demo() ? ' · 시연 예시' : '') + '</p>' + (a.length ? '<a class="wban" href="?p=wait"><span>🔔 ' + a.join(' · ') + '</span><em>열기 →</em></a>' : '');
  }
  function hub() { css(); if (!$('#wBan')) { var h = $('.htop'); if (h) h.insertAdjacentHTML('afterend', '<div id="wBan"></div>'); } paint(); sync(); }

  /* ---------- 대기 고객 · 호실 진행 ---------- */
  var W = { list: null };
  function unitForm(pre, act, label) {
    pre = pre || {}; var ds = ['101', '102', '103', '104', '105', '106', '107'];
    return '<div class="uf" data-uf="' + act + '"><label>동<select name="dong">' + ds.map(function (x) { return '<option' + (x === pre.dong ? ' selected' : '') + '>' + x + '</option>'; }).join('') + '</select></label>' +
      '<label>호 라인<select name="ho">' + [1, 2, 3, 4, 5, 6].map(function (x) { return '<option value="' + x + '"' + (+pre.ho === x ? ' selected' : '') + '>' + x + '호</option>'; }).join('') + '</select></label>' +
      '<label>층<input name="floor" type="number" inputmode="numeric" min="4" max="49" value="' + esc(pre.floor || '') + '" placeholder="예: 21"></label>' +
      (act === 'hold' ? '<label>고객 성함 (가려서 기록)<input name="cust" value="' + esc(pre.cust || '') + '" placeholder="김고객"></label><label>방문 · 계약 예정<input name="visit" type="datetime-local" value="' + esc(pre.visit || '') + '"></label>' : '') +
      '<p class="ut" data-ut></p><button class="btn btn-p" data-w="' + act + '"' + (pre.wait ? ' data-wait="' + esc(pre.wait) + '"' : '') + '>' + label + '</button></div>';
  }
  function readUnit(box) {
    var g = function (n) { var e = box.querySelector('[name=' + n + ']'); return e ? e.value : ''; };
    var u = { dong: g('dong'), ho: +g('ho'), floor: +g('floor') }; u.type = LINES[u.dong + '-' + u.ho] || ''; var b = bandOf(u.floor); u.band = b ? b[0] : ''; u.bandName = b ? b[1] : '';
    return { u: u, cust: g('cust'), visit: g('visit') };
  }
  function unitText(u) { return u.dong + '동 ' + u.ho + '호 라인 ' + u.floor + '층' + (u.type ? ' ' + u.type : ''); }
  function msg(kind, w, unit) {
    var nm = (w && w.name ? w.name.replace(/\s*\(예시\)/, '') + ' 고객님, ' : '고객님, '), site = (data() || {}).siteName || '';
    if (kind === 'open') return '(광고) [' + site + '] ' + nm + '기다리시던 ' + (unit || (w ? w.condText : '')) + ' 호실이 다시 상담 가능해졌습니다. 선착순이라 확인 후 확정됩니다. 편하실 때 연락 주세요. 담당 상담사 김성태 010-8315-9602\n무료 수신거부 https://dangerouskill1174-blip.github.io/LOTTE-/optout/';
    return '(광고) [' + site + '] ' + nm + '아쉽지만 기다리시던 ' + (unit || (w ? w.condText : '')) + ' 호실은 다른 고객님과 계약되었습니다. 비슷한 조건의 다른 호실(차선책)도 함께 찾아봐 드릴까요? 담당 상담사 김성태 010-8315-9602\n무료 수신거부 https://dangerouskill1174-blip.github.io/LOTTE-/optout/';
  }
  function waitPage(root) {
    css(); var d = data();
    var h = '<div class="dx wx"><header class="vtop"><a class="back" href="./">← 상담 데스크</a><div><p class="eyebrow">고객 관리 · ' + esc((d && d.siteName) || '') + '</p><h1>대기 고객 · 호실 진행</h1><p class="sub">원하는 호실을 기다리는 고객, 다시 나온 호실, 상담사 사이의 진행 순서를 한곳에서 봅니다. 이 현장 자료만 나옵니다.' + (demo() ? ' <b>시연판 · 예시 자료이며 서버에 저장하지 않습니다.</b>' : '') + '</p></div></header>';
    if (!d) { root.innerHTML = h + '<p class="loading">불러오는 중…</p></div>'; sync().then(function () { waitPage(root); }); return; }
    var c = counts(d);
    // 1) 알림
    var al = d.alerts || [];
    h += '<section class="dxb"><div class="wh2"><h2>🔔 알림 ' + (al.length ? '<span class="cnt">' + al.length + '</span>' : '') + '</h2>' + (al.length ? '<button class="btn btn-s" data-w="seen">모두 읽음</button>' : '') + '</div>';
    h += al.length ? al.map(function (a) { return '<div class="al k-' + esc(a.kind.replace(/\s/g, '')) + '"><span class="kd">' + esc(a.kind) + '</span><div><b>' + esc(a.unit || '') + '</b><p>' + esc(a.text) + '</p><small>' + esc(a.at) + '</small></div>' +
      (a.kind === '계약됨' ? '<button class="btn btn-s" data-w="tpl" data-k="done" data-u="' + esc(a.unit) + '">고객에게 알리기 · 차선책 문구</button>' : (a.kind === '호실 다시 나옴' ? '<button class="btn btn-s" data-w="tpl" data-k="open" data-u="' + esc(a.unit) + '">고객에게 알리기 문구</button>' : '')) + '</div>'; }).join('') : '<p class="sub">새 알림이 없습니다.</p>';
    h += '</section>';
    // 2) 진행 중 호실
    var hs = d.holds || [];
    h += '<section class="dxb"><h2>📌 진행 중인 호실 <small>(이 현장 전체)</small></h2><p class="sub">노란색 = 임시 확보(팀장 승인 전) · 주황색 = 진행 확정. 진행 중인 호실은 다른 상담사가 잡을 수 없습니다. 고객이 마음을 바꾸면 바로 ‘진행 취소’를 눌러 주세요.</p>';
    h += hs.length ? hs.map(function (x) { var btn = '';
      if (x.lead && !x.mine && x.status === '임시 확보') btn += '<button class="btn btn-g" data-w="hok" data-id="' + x.id + '">승인</button>';
      if (x.mine || x.lead) btn += '<button class="btn btn-s" data-w="hcancel" data-id="' + x.id + '">' + (x.mine ? '진행 취소 (고객 변심)' : '해제') + '</button><button class="btn btn-p" data-w="hdone" data-id="' + x.id + '">계약 완료</button>';
      if (x.over && x.lead) btn += '<button class="btn btn-s" data-w="hext" data-id="' + x.id + '">방문 예정 연장</button>';
      return '<div class="hd ' + (x.status === '진행 확정' ? 'ok' : 'tmp') + (x.mine ? ' mine' : '') + '"><div><b>' + esc(x.unitText || x.unit) + '</b> <span class="st">' + esc(x.status) + '</span>' + (x.mine ? ' <span class="me">내 고객</span>' : '') +
        '<p>' + esc(x.who) + (x.cust ? ' · ' + esc(x.cust) + ' 고객' : '') + ' · 방문 예정 ' + esc(x.visit || '-') + '</p><small>요청 ' + esc(x.req) + (x.ok ? ' · 승인 ' + esc(x.ok) : '') + '</small>' +
        (x.over && (x.mine || x.lead) ? '<p class="ov">⏰ 방문 예정 시간이 2시간 넘게 지났습니다 · 아직 진행 중인가요?</p>' : '') + '</div><div class="hb">' + btn + '</div></div>'; }).join('') : '<p class="sub">지금 진행 중인 호실이 없습니다.</p>';
    h += '</section>';
    // 3) 내 대기 고객
    h += '<section class="dxb"><h2>⏳ 내 대기 고객</h2><p class="sub">상담 중 ‘원하는 호실이 나오면 알려 드릴까요?’로 등록한 고객입니다. 이름 · 연락처는 상담사 본인 시트에만 있습니다.</p><div id="wl">' + (W.list ? wl() : '<p class="loading">불러오는 중…</p>') + '</div></section>';
    // 4) 호실 다시 나옴 · 바로 진행 요청
    h += '<section class="dxb"><h2>🔓 호실이 다시 나왔을 때</h2><p class="sub">미계약 · 해약으로 호실이 풀리면 여기에 넣습니다. 이 현장에서 그 호실을 기다리는 고객의 <b>담당 상담사 모두</b>에게 알림이 갑니다 (다른 상담사의 고객 정보는 보이지 않습니다).</p>' + unitForm({}, 'open', '기다리는 고객에게 알리기') + '</section>';
    h += '<section class="dxb"><h2>✋ 호실 진행 요청 · 팀장 보고</h2><p class="sub">고객이 “다시 와서 계약하겠다”고 하면 누릅니다. 누르는 순간 <b>임시 확보</b>되어 다른 상담사가 잡을 수 없고, 팀장에게 승인 요청이 갑니다. 먼저 누른 순서는 서버 시각으로 정해집니다.</p>' + unitForm({}, 'hold', '진행 요청 · 팀장에게 보고') +
      '<p class="fine">이 기록은 상담사 사이의 진행 순서를 남기는 내부 기록입니다. 실제 호실 지정 · 계약 규칙은 시행사 · 대행사 현장 규정을 따릅니다.</p></section></div>';
    root.innerHTML = h; bindUnits(root);
    if (!W.list) loadWaits().then(function () { var e = $('#wl'); if (e) e.innerHTML = wl(); });
  }
  function loadWaits() { if (demo() || !hasApi()) { W.list = WDEMO; return Promise.resolve(); } return api('waitlist').then(function (j) { W.list = j.list; }).catch(function () { W.list = []; }); }
  function wl() {
    var L = (W.list || []).filter(function (w) { return w.status === '대기'; }), E = (W.list || []).filter(function (w) { return w.status !== '대기'; });
    if (!L.length && !E.length) return '<p class="sub">아직 대기 고객이 없습니다.</p>';
    return L.map(function (w) { return '<div class="wc"><div><b>' + esc(w.name) + '</b> <span class="tel">' + esc(w.tel) + '</span><p>원하는 호실 · ' + esc(w.condText) + '</p><small>등록 ' + esc(w.at) + ' · 동의: ' + (w.sms ? '문자 ' : '') + (w.kakao ? '카톡' : '') + '</small></div>' +
      '<div class="hb"><button class="btn btn-s" data-w="tpl" data-k="open" data-wid="' + w.id + '">‘다시 나옴’ 문자</button><button class="btn btn-s" data-w="tpl" data-k="done" data-wid="' + w.id + '">‘계약됨 · 차선책’ 문자</button><button class="btn btn-g" data-w="hreq" data-wid="' + w.id + '">진행 요청</button><button class="btn btn-s" data-w="wend" data-wid="' + w.id + '">대기 끝내기</button></div></div>'; }).join('') +
      (E.length ? '<details class="we"><summary>끝난 대기 ' + E.length + '명</summary>' + E.map(function (w) { return '<p>' + esc(w.name) + ' · ' + esc(w.condText) + ' · ' + esc(w.status) + '</p>'; }).join('') + '</details>' : '');
  }
  function bindUnits(root) {
    [].forEach.call(root.querySelectorAll('.uf'), function (box) { var up = function () { var r = readUnit(box), t = box.querySelector('[data-ut]'); t.textContent = r.u.floor ? unitText(r.u) + (r.u.bandName ? ' · ' + r.u.bandName + ' 가격 구간' : ' · 층을 확인해 주세요') : ''; };
      box.addEventListener('input', up); box.addEventListener('change', up); up(); });
  }
  function sheet(html) { var o = document.createElement('div'); o.className = 'wov'; o.innerHTML = '<div class="wbox">' + html + '</div>'; o.addEventListener('click', function (e) { if (e.target === o || e.target.closest('[data-wx]')) o.remove(); }); document.body.appendChild(o); return o; }
  function tpl(kind, w, unit) {
    var t = msg(kind, w, unit), tel = w ? String(w.tel).replace(/\D/g, '') : '';
    sheet('<h2>' + (kind === 'open' ? '호실이 다시 나왔다고 알리기' : '계약되었다고 알리고 차선책 여쭙기') + '</h2><p class="sub">' + (w ? esc(w.name) + ' · ' + esc(w.tel) : '받는 고객의 번호를 넣어 주세요') + '</p>' +
      (tel ? '' : '<label class="wl2">휴대폰 번호<input id="wtel" type="tel" placeholder="010-0000-0000"></label>') +
      '<textarea id="wtx" rows="6">' + esc(t) + '</textarea><div class="hb"><button class="btn btn-p" data-w="tplqr" data-tel="' + tel + '">문자용 QR 만들기 (상담사 폰으로 찍기)</button><button class="btn btn-s" data-w="tplcopy">문구 복사 (카톡에 붙여 넣기)</button><button class="btn btn-s" data-wx>닫기</button></div><div id="wq"></div>' +
      '<p class="fine">광고 수신에 동의한 고객에게만 보냅니다. (광고) 표시와 무료 수신거부는 지우지 않습니다. 밤 9시~아침 8시에는 야간 동의 고객만.' + (kind === 'done' ? ' 차선책은 ‘새 고객 상담’ → 결과지 QR로 이어하기에서 같은 조건으로 함께 찾아 드리세요.' : '') + '</p>');
  }
  function hreqSheet(w) {
    var c = (w && w.cond) || {}, t = new Date(Date.now() + 864e5); var v = t.toISOString().slice(0, 11) + '14:00';
    sheet('<h2>호실 진행 요청 · 팀장 보고</h2><p class="sub">' + (w ? esc(w.name) + ' 고객 · 원하던 ' + esc(w.condText) : '') + '</p>' + unitForm({ dong: c.dong, ho: c.ho, cust: w ? w.name.replace(/\s*\(예시\)/, '') : '', visit: v, wait: w ? w.id : '' }, 'hold', '진행 요청 · 팀장에게 보고') + '<button class="btn btn-s" data-wx style="margin-top:8px">닫기</button>');
    bindUnits(document.querySelector('.wov:last-child'));
  }
  function confirmBox(title, body, okLabel, fn) {
    var o = sheet('<h2>' + title + '</h2><p class="sub">' + body + '</p><div class="hb"><button class="btn btn-g" data-cf>' + okLabel + '</button><button class="btn btn-p" data-wx>아니요 · 그대로 두기</button></div>');
    o.querySelector('[data-cf]').onclick = function () { o.remove(); fn(); };
  }
  function done(msgText, re) { toast(msgText); sync().then(function () { var r = $('#root'); if (r && /p=wait/.test(location.search)) { if (re) W.list = null; waitPage(r); } }); }
  function call(op, body, ok) {
    if (demo() || !hasApi()) { toast('시연판 · 실제로 저장하지 않았습니다'); return Promise.resolve(null); }
    return api(op, body).then(function (j) { ok && ok(j); return j; }).catch(function (e) {
      var m = { taken: '이미 다른 상담사가 진행 중인 호실입니다 (먼저 요청한 순서)', held: '진행 중인 호실이라 다시 나옴으로 알릴 수 없습니다', consent: '광고 수신 동의(문자 또는 카톡)가 있어야 등록됩니다', need: '빠진 칸이 있습니다', unit: '동 · 호 · 층을 확인해 주세요', lead: '팀장만 할 수 있습니다', who: '요청한 상담사나 팀장만 할 수 있습니다', closed: '이미 끝난 진행입니다', noapi: '웹앱 연결 전입니다', op: '웹앱 업데이트 전입니다 (디어에서 다시 배포해야 합니다)' };
      toast(m[e.message] || ('처리하지 못했습니다 · ' + e.message + ' · 인터넷 연결을 확인해 주세요'));
    });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-w]'); if (!b) return; var a = b.dataset.w, box = b.closest('.uf');
    var wfind = function (id) { return (W.list || []).filter(function (x) { return x.id === id; })[0]; };
    if (a === 'seen') { var ids = ((data() || {}).alerts || []).map(function (x) { return x.id; }); call('alertseen', { ids: ids }, function () { done('읽음으로 표시했습니다'); }); return; }
    if (a === 'tpl') { tpl(b.dataset.k, b.dataset.wid ? wfind(b.dataset.wid) : null, b.dataset.u || ''); return; }
    if (a === 'tplqr') { var tel = b.dataset.tel || (($('#wtel') || {}).value || '').replace(/\D/g, ''); if (!/^01\d{8,9}$/.test(tel)) { toast('휴대폰 번호를 확인해 주세요'); return; } $('#wq').innerHTML = '<div class="wqr"><img src="' + qr('SMSTO:' + tel + ':' + $('#wtx').value) + '" alt="문자용 QR"><p><b>상담사 휴대폰 카메라로 찍으면</b> 번호와 문구가 채워진 문자 창이 열립니다. ‘보내기’만 누르세요.</p></div>'; return; }
    if (a === 'tplcopy') { var tx = $('#wtx').value; try { navigator.clipboard.writeText(tx).then(function () { toast('복사했습니다 · 카톡 대화창에 붙여 넣으세요'); }); } catch (x) { toast('문구를 길게 눌러 복사해 주세요'); } return; }
    if (a === 'hreq') { hreqSheet(wfind(b.dataset.wid)); return; }
    if (a === 'wend') { var w0 = wfind(b.dataset.wid); confirmBox('대기를 끝낼까요?', esc(w0 ? w0.name : '') + ' 고객의 대기를 끝냅니다. 다시 나와도 알림이 오지 않습니다.', '대기 끝내기', function () { call('waitend', { id: b.dataset.wid, why: '고객 요청' }, function () { done('대기를 끝냈습니다', true); }); }); return; }
    if (a === 'open' && box) { var r = readUnit(box); if (!r.u.floor || !r.u.band) { toast('층을 확인해 주세요'); return; }
      confirmBox('‘다시 나옴’으로 알릴까요?', '<b>' + esc(unitText(r.u)) + '</b> · 이 호실을 기다리는 고객의 담당 상담사들에게 알림이 갑니다.', '알리기', function () { call('unitopen', { unit: r.u }, function (j) { done('알렸습니다 · 조건이 맞는 대기 고객 ' + j.matched + '명'); }); }); return; }
    if (a === 'hold' && box) { var r2 = readUnit(box); if (!r2.u.floor || !r2.u.band) { toast('층을 확인해 주세요'); return; } if (!r2.cust) { toast('고객 성함을 넣어 주세요 (기록에는 김○○처럼 가려집니다)'); return; }
      confirmBox('진행 요청을 보낼까요?', '<b>' + esc(unitText(r2.u)) + '</b> · ' + esc(r2.cust.slice(0, 1)) + '○○ 고객 · 방문 ' + esc((r2.visit || '').replace('T', ' ')) + '<br>누르면 바로 임시 확보되고 팀장에게 승인 요청이 갑니다.', '진행 요청', function () {
        call('holdreq', { unit: r2.u, cust: r2.cust, visit: r2.visit, wait: b.dataset.wait || '' }, function (j) { var o = document.querySelector('.wov'); if (o) o.remove(); done(j.status === '진행 확정' ? '진행 확정했습니다 (팀장 본인)' : '임시 확보했습니다 · 팀장 승인을 기다립니다'); }); }); return; }
    if (a === 'hok') { call('holdact', { id: b.dataset.id, act: 'ok' }, function () { done('승인했습니다 · 진행 확정'); }); return; }
    if (a === 'hcancel') { confirmBox('진행을 취소할까요?', '호실이 바로 풀리고, 이 호실을 기다리는 다른 고객의 상담사들에게 ‘다시 나옴’ 알림이 갑니다.', '진행 취소', function () { call('holdact', { id: b.dataset.id, act: 'cancel', why: '고객 변심' }, function () { done('진행을 취소했습니다 · 호실이 풀렸습니다'); }); }); return; }
    if (a === 'hdone') { confirmBox('계약 완료로 바꿀까요?', '이 호실을 기다리던 고객의 상담사들에게 ‘계약됨’ 알림이 가고, 같은 호실만 기다리던 대기는 끝납니다. 현황판에서도 ✕로 바꿔 주세요.', '계약 완료', function () { call('holdact', { id: b.dataset.id, act: 'done' }, function () { done('계약 완료로 기록했습니다'); }); }); return; }
    if (a === 'hext') { var t2 = new Date(Date.now() + 864e5).toISOString().slice(0, 11) + '14:00'; var o2 = sheet('<h2>방문 예정 연장</h2><label class="wl2">새 방문 예정<input id="wext" type="datetime-local" value="' + t2 + '"></label><div class="hb"><button class="btn btn-g" data-w="hext2" data-id="' + b.dataset.id + '">연장</button><button class="btn btn-s" data-wx>닫기</button></div>'); return; }
    if (a === 'hext2') { call('holdact', { id: b.dataset.id, act: 'ext', visit: $('#wext').value }, function () { var o = document.querySelector('.wov'); if (o) o.remove(); done('연장했습니다'); }); return; }
  });

  /* ---------- 혜택 ---------- */
  var P = { list: null, sites: {}, counts: {}, site: '' };
  function promoPage(root) {
    css(); var d = data() || {};
    var h = '<div class="dx wx"><header class="vtop"><a class="back" href="./">← 상담 데스크</a><div><p class="eyebrow">준비 자료 · 결정 화면의 혜택 단계</p><h1>혜택</h1><p class="sub">혜택은 <b>시행사 승인</b>이 있어야 안내합니다. 승인된 혜택은 <b>디어가 현장별로 넣고</b>, 그 현장 태블릿에만 나갑니다.</p></div></header>';
    if (!OWNER || demo()) {
      h += '<section class="dxb"><h2>지금 현장 · ' + esc(d.siteName || '') + '</h2>' + ((d.promos || []).length ? d.promos.map(pcard).join('') : '<p class="sub">지금 안내할 혜택이 없습니다.</p>') +
        '<p class="note">혜택이 새로 나오거나 바뀌면 <b>' + esc(CONTACT.op) + '(디어)로 연락</b>해 주세요. 디어가 넣으면 이 현장 태블릿에 바로 나옵니다. 상담사 태블릿에서는 고칠 수 없습니다.</p></section></div>';
      root.innerHTML = h; return;
    }
    if (!P.list) { root.innerHTML = h + '<p class="loading">불러오는 중…</p></div>'; api('promolist').then(function (j) { P.list = j.list; P.sites = j.sites; P.counts = j.counts; if (!P.site) P.site = Object.keys(P.sites)[0] || ''; promoPage(root); }).catch(function (e) { root.innerHTML = h + '<p class="loading">불러오지 못했습니다 (' + esc(e.message) + ')</p></div>'; }); return; }
    var sites = Object.keys(P.sites);
    h += '<section class="dxb"><h2>1. 현장을 먼저 고르세요</h2><div class="sts">' + sites.map(function (k) { return '<button class="' + (P.site === k ? 'on' : '') + '" data-pw="site" data-s="' + k + '"><b>' + esc(P.sites[k].name) + '</b><small>' + k + ' · 태블릿 ' + (P.counts[k] || 0) + '대</small></button>'; }).join('') + '</div></section>';
    if (P.site) {
      var S0 = P.sites[P.site], mine = P.list.filter(function (x) { return x.site === P.site; });
      h += '<section class="dxb"><h2>2. ' + esc(S0.name) + ' · 등록한 혜택</h2>' + (mine.length ? mine.map(function (x) { return pcard(x) + '<div class="hb" style="margin:-4px 0 10px"><button class="btn btn-s" data-pw="edit" data-id="' + x.id + '">고치기</button><button class="btn btn-s" data-pw="del" data-id="' + x.id + '">내리기</button></div>'; }).join('') : '<p class="sub">아직 없습니다.</p>') + '</section>';
      h += '<section class="dxb"><h2>3. 혜택 넣기 · 고치기</h2><form class="pf" id="pf"><input type="hidden" name="id"><label>혜택 이름<input name="name" required></label><label>고객에게 보여 줄 내용 (사실대로 · 과장 없이)<textarea name="body" rows="2" required></textarea></label><div class="two"><label>시작일<input type="date" name="from"></label><label>끝나는 날<input type="date" name="to" required></label></div><label>조건<input name="cond" placeholder="예: 기간 안 계약 · 1인 1회"></label><label>시행사 승인 근거 (필수)<input name="basis" required placeholder="예: ○○ 공문 제2026-○○호 · 2026.11.20 승인"></label><label>승인한 시행사<input name="dev" value="' + esc((S0.dev || [])[0] || '') + '"></label><p class="note">저장하면 <b>' + esc(S0.name) + '</b> 현장 태블릿에만 나갑니다.</p><button class="btn btn-p">저장 전 확인</button></form></section>';
    }
    root.innerHTML = h + '</div>';
    var f = $('#pf'); if (f) f.addEventListener('submit', function (ev) { ev.preventDefault(); var o = {}; ['id', 'name', 'body', 'from', 'to', 'cond', 'basis', 'dev'].forEach(function (k) { o[k] = (f[k].value || '').trim(); });
      if (!o.basis) { toast('시행사 승인 근거를 넣어 주세요'); return; }
      var S1 = P.sites[P.site], devs = S1.dev || [], warn = devs.length && !devs.some(function (x) { return (o.dev + ' ' + o.basis).indexOf(x) >= 0; });
      confirmBox('<span style="color:#A4432F">' + esc(S1.name) + '</span> 현장에만 배포됩니다. 맞습니까?', '혜택 “' + esc(o.name) + '” · ' + esc(o.from || '오늘') + ' ~ ' + esc(o.to) + '<br>이 현장 태블릿 ' + (P.counts[P.site] || 0) + '대에 나갑니다. 다른 현장에는 나가지 않습니다.' + (warn ? '<br><b style="color:#A4432F">⚠ 적은 시행사가 이 현장의 시행사(' + esc(devs.join(' · ')) + ')와 다릅니다. 다른 현장 공문이 아닌지 확인해 주세요.</b>' : ''), '네, 이 현장에 배포', function () {
        api('promoset', { site: P.site, item: o }).then(function () { toast('저장했습니다 · ' + S1.name + ' 태블릿에 나갑니다'); P.list = null; promoPage(root); }).catch(function (e) { toast('저장하지 못했습니다 · ' + e.message); }); }); });
  }
  function pcard(x) { return '<div class="pcd"><b>' + esc(x.name) + '</b><p>' + esc(x.body || '') + '</p><dl><dt>기간</dt><dd>' + esc((x.from || '') + ' ~ ' + (x.to || '')) + '</dd><dt>조건</dt><dd>' + esc(x.cond || '-') + '</dd><dt>근거</dt><dd>' + esc(x.basis) + (x.dev ? ' · ' + esc(x.dev) : '') + '</dd></dl></div>'; }
  document.addEventListener('click', function (e) { var b = e.target.closest('[data-pw]'); if (!b) return; var r = $('#root'), a = b.dataset.pw;
    if (a === 'site') { P.site = b.dataset.s; promoPage(r); }
    if (a === 'edit') { var x = P.list.filter(function (y) { return y.id === b.dataset.id; })[0], f = $('#pf'); if (x && f) { ['id', 'name', 'body', 'from', 'to', 'cond', 'basis', 'dev'].forEach(function (k) { f[k].value = x[k] || ''; }); f.scrollIntoView({ behavior: 'smooth' }); } }
    if (a === 'del') confirmBox('이 혜택을 내릴까요?', '현장 태블릿에서 바로 사라집니다. 기록(이력)은 남습니다.', '내리기', function () { api('promoset', { site: P.site, del: b.dataset.id }).then(function () { toast('내렸습니다'); P.list = null; promoPage(r); }); });
  });

  function css() {
    if ($('#dwcss')) return; var s = document.createElement('style'); s.id = 'dwcss';
    s.textContent = '.dx.wx{max-width:1040px;margin:0 auto;padding:22px max(16px,env(safe-area-inset-left,0px)) 60px}.wx .dxb{background:var(--surface);border:1px solid var(--line);border-radius:18px;padding:20px 22px;margin-top:16px;box-shadow:var(--sh1)}.wx .dxb>.sub{margin-top:4px}.wx .vtop{margin-bottom:6px}' +
      '.sitep{margin-top:10px;font-size:15px;color:var(--muted)}.sitep b{color:var(--ink);background:var(--gold-soft);border-radius:8px;padding:2px 8px}' +
      '.wban{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:12px;min-height:60px;padding:0 18px;border-radius:16px;background:#FFF1CC;border:2px solid #E8B547;color:#4A2E00;text-decoration:none;font-size:17px}.wban em{font-style:normal;font-weight:800}' +
      '.wx h2{font-size:21px}.wx h2 small{font-size:14px;color:var(--muted);font-weight:500}.wh2{display:flex;justify-content:space-between;align-items:center;gap:10px}.cnt{display:inline-flex;min-width:28px;height:28px;border-radius:14px;background:#A4432F;color:#fff;font-size:15px;align-items:center;justify-content:center;padding:0 8px;font-family:sans-serif}' +
      '.al{display:flex;gap:12px;align-items:flex-start;flex-wrap:wrap;border:1px solid var(--line);border-radius:14px;padding:12px 14px;margin-top:10px;background:var(--surface2)}.al>div{flex:1;min-width:220px}.al p{margin-top:2px}.al small{color:var(--muted)}' +
      '.kd{flex:none;font-size:13px;font-weight:800;border-radius:999px;padding:4px 12px;background:#E6EEFB;color:#204A8F}.k-호실다시나옴 .kd{background:#E3F1EA;color:#0F6B4F}.k-계약됨 .kd{background:#FBEDEA;color:#A4432F}.k-승인요청 .kd{background:#FFF1CC;color:#7A4F00}' +
      '.hd{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;border-radius:14px;padding:14px;margin-top:10px;border:2px solid var(--line)}.hd.tmp{border-color:#E8B547;background:#FFF8E1}.hd.ok{border-color:#E07B39;background:#FFF0E6}.hd.mine{box-shadow:inset 5px 0 0 var(--navy)}.hd>div:first-child{flex:1;min-width:240px}.hd b{font-size:18px}' +
      '.hd .st{font-size:13px;font-weight:800;border-radius:999px;padding:2px 10px;background:#fff;border:1px solid currentColor}.me{font-size:12.5px;font-weight:800;background:var(--navy);color:var(--navy-ink);border-radius:999px;padding:2px 8px}.hd .ov{color:#A4432F;font-weight:800;margin-top:6px}' +
      '.hb{display:flex;gap:8px;flex-wrap:wrap;align-items:flex-start}.hb .btn{min-height:50px}' +
      '.wc{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;border:1px solid var(--line);border-radius:14px;padding:14px;margin-top:10px}.wc>div:first-child{flex:1;min-width:220px}.wc b{font-size:18px}.tel{font-weight:700;color:var(--muted)}.we{margin-top:12px}.we summary{min-height:44px;display:flex;align-items:center;font-weight:700;cursor:pointer}' +
      '.uf{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-top:12px;align-items:end}.uf label,.wl2{display:flex;flex-direction:column;gap:6px;font-weight:700;font-size:15px}.uf select,.uf input,.wl2 input{min-height:54px;font:inherit;font-size:18px;padding:0 12px;border-radius:12px;border:1.5px solid var(--line2);background:var(--surface);color:var(--ink)}.uf .ut{grid-column:1/-1;font-weight:800;color:var(--gold-ink);min-height:24px}.uf .btn{grid-column:1/-1}' +
      '.wov{position:fixed;inset:0;z-index:70;background:rgba(11,15,24,.72);display:flex;align-items:center;justify-content:center;padding:16px}.wbox{background:var(--surface);color:var(--ink);border-radius:22px;padding:22px;max-width:720px;width:100%;max-height:92vh;overflow:auto}.wbox h2{font-size:23px}.wbox textarea{width:100%;font:inherit;font-size:16px;border-radius:12px;border:1.5px solid var(--line2);padding:10px;margin:12px 0;background:var(--surface);color:var(--ink)}.wbox .hb{margin-top:12px}' +
      '.wqr{display:flex;gap:14px;align-items:center;margin-top:12px}.wqr img{width:200px;background:#fff;border-radius:10px;image-rendering:pixelated}' +
      '.sts{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px;margin-top:10px}.sts button{text-align:left;min-height:72px;border-radius:14px;border:2px solid var(--line2);background:var(--surface);color:var(--ink);padding:10px 14px;font:inherit}.sts button.on{border-color:#A4432F;box-shadow:0 0 0 3px #FBEDEA}.sts b{display:block;font-size:17px}.sts small{color:var(--muted)}' +
      '.pcd{border:1.5px solid var(--line);border-radius:14px;padding:14px;margin-top:10px;background:var(--surface2)}.pcd b{font-size:18px}.pcd dl{display:grid;grid-template-columns:auto 1fr;gap:4px 12px;margin:8px 0 0;font-size:15px}.pcd dt{color:var(--muted)}.pcd dd{margin:0;font-weight:700}';
    document.head.appendChild(s);
  }
  window.DESKW = { hub: hub, wait: function (r) { W.list = null; waitPage(r); }, promo: function (r) { P.list = null; promoPage(r); }, sync: sync, data: data, demo: demo };
})();
