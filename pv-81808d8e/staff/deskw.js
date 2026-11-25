/* 상담 데스크 · 현장 공유: 대기 고객 · 호실 진행권(팀장 보고) · 혜택(디어가 현장별로 넣음) · 알림
   모든 자료는 웹앱이 '이 상담사의 현장' 것만 보냅니다. 시연판은 서버에 쓰지 않고 예시만 보여 줍니다. */
(function () {
  'use strict';
  var LINES = {"101-1": "113B", "101-2": "84E", "101-3": "84F", "101-4": "84F", "101-5": "84C", "101-6": "84B", "102-1": "113A", "102-2": "84E", "102-3": "84F", "102-4": "84F", "102-5": "84C", "102-6": "84A", "103-1": "113A", "103-2": "84E", "103-3": "121", "103-4": "121", "103-5": "84D", "103-6": "84A", "104-1": "84A", "104-2": "84E", "104-3": "121", "104-4": "121", "104-5": "84D", "104-6": "113A", "105-1": "84A", "105-2": "84C", "105-3": "84F", "105-4": "84F", "105-5": "84C", "105-6": "113A", "106-1": "84A", "106-2": "84C", "106-3": "84F", "106-4": "84F", "106-5": "84C", "106-6": "113A", "107-1": "84B", "107-2": "84C", "107-3": "84F", "107-4": "84F", "107-5": "84C", "107-6": "113B"};   // '101-1' → '113B'  (호실 고르기 자료에서 자동)
  var BANDS = [['b4', '4층', 4, 4], ['b5', '5층', 5, 5], ['b69', '6~9층', 6, 9], ['b1019', '10~19층', 10, 19], ['b2025', '20~25층', 20, 25], ['b2739', '27~39층', 27, 39], ['b40', '40층 이상', 40, 49]];
  var OWNER = 'OWNER' === 'OWNER', CONTACT = { op: '디어 에듀테크', tel: '1668-2052' };
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
      over: h.filter(function (x) { return x.over && (x.mine || x.lead); }).length, done: a.filter(function (x) { return x.kind === '계약됨'; }).length, promo: a.filter(function (x) { return x.kind === '새 혜택'; }).length, help: a.filter(function (x) { return x.kind === '도움 요청'; }).length }; }
  /* 상담 데스크 첫 화면: 현장 이름 · 알림 띠 */
  function paint() {
    var d = data(), host = $('#wBan'); if (!host || !d) return; var c = counts(d), a = [];
    if (c.req) a.push('<b>팀장 승인 요청 ' + c.req + '건</b>'); if (c.open) a.push('대기 고객과 맞는 호실 ' + c.open + '건'); if (c.over) a.push('방문 예정 시간 지남 ' + c.over + '건');
    if (c.done) a.push('계약됨 알림 ' + c.done + '건'); if (c.promo) a.push('새 혜택 ' + c.promo + '건'); if (c.help) a.unshift('<b>팀원 도움 요청 ' + c.help + '건</b>');
    host.innerHTML = '<p class="sitep">지금 현장 · <b>' + esc(d.siteName || '') + '</b>' + (demo() ? ' · 시연 예시' : '') + ' · 내 역할 <b>' + esc(d.role || (d.isLead ? '팀장' : '직원')) + '</b></p>' + opsBan(d) + (a.length ? '<a class="wban" href="?p=wait"><span>🔔 ' + a.join(' · ') + '</span><em>열기 →</em></a>' : '');
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
      (a.kind === '계약됨' ? '<button class="btn btn-s" data-w="tpl" data-k="done" data-u="' + esc(a.unit) + '">고객에게 알리기 · 차선책 문구</button>' : (a.kind === '호실 다시 나옴' ? '<button class="btn btn-s" data-w="tpl" data-k="open" data-u="' + esc(a.unit) + '">고객에게 알리기 문구</button><button class="btn btn-g" data-o2="invopen" data-dong="' + esc((/^(\d+)동/.exec(a.unit || '') || [])[1] || '') + '" data-ho="' + esc((/(\d)호/.exec(a.unit || '') || [])[1] || '') + '">방문 확정 링크 보내기</button>' : '')) + '</div>'; }).join('') : '<p class="sub">새 알림이 없습니다.</p>';
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
      '<div class="hb"><button class="btn btn-s" data-w="tpl" data-k="open" data-wid="' + w.id + '">‘다시 나옴’ 문자</button><button class="btn btn-s" data-w="tpl" data-k="done" data-wid="' + w.id + '">‘계약됨 · 차선책’ 문자</button><button class="btn btn-g" data-o2="invopen" data-wid="' + w.id + '" data-dong="' + esc((w.cond || {}).dong || '') + '" data-ho="' + esc((w.cond || {}).ho || '') + '">방문 확정 링크</button><button class="btn btn-s" data-w="hreq" data-wid="' + w.id + '">진행 요청</button><button class="btn btn-s" data-w="wend" data-wid="' + w.id + '">대기 끝내기</button></div></div>'; }).join('') +
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
        '<p class="note">혜택이 새로 나오거나 바뀌면 <b>' + esc(CONTACT.op) + '(디어 · 대표번호 ' + esc(CONTACT.tel) + ')로 연락</b>해 주세요. 디어가 넣으면 이 현장 태블릿에 바로 나옵니다. 상담사 태블릿에서는 고칠 수 없습니다.</p></section></div>';
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
      '.tmk{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:16px}.tmk div{background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:14px 16px;display:flex;flex-direction:column;gap:4px}.tmk span{font-size:14px;color:var(--muted);font-weight:700}.tmk b{font-size:30px;font-family:var(--serif)}.tmk .hot{border:2px solid #E07B39;background:#FFF0E6}.tmk .hot b{color:#A4432F}' +
      '.tmm{display:grid;gap:8px;margin-top:10px}.tmm div{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;border-bottom:1px solid var(--line);padding:8px 0}.tmm span{color:var(--muted);font-weight:700}' +
      '.tmf{display:flex;gap:8px;flex-wrap:wrap;margin-top:18px}.tmf button{min-height:44px;padding:0 16px;border-radius:999px;border:1.5px solid var(--line2);background:var(--surface);color:var(--ink);font:inherit;font-weight:700}.tmf button.on{background:var(--navy);color:var(--navy-ink);border-color:var(--navy)}' +
      '.tmc{background:var(--surface);border:1px solid var(--line);border-radius:18px;padding:16px 18px;margin-top:12px;box-shadow:var(--sh1)}.tmc.hlp{border:2px solid #E07B39}.tmc header{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.tmc header b{font-size:18px}.tmw{color:var(--muted);font-size:14px;margin-left:auto}' +
      '.tmt{border-radius:999px;padding:3px 10px;font-weight:800;font-size:13px;background:var(--surface2);border:1px solid var(--line2)}.tmt.tA{background:#E8F3EA;color:#2F6B3B;border-color:#9CC7A4}.tmt.tB{background:var(--gold-soft);color:var(--gold-ink);border-color:var(--gold2)}.tmt.tC{background:#EEF1F5;color:#4A5568}' +
      '.tmh{margin-top:10px;background:#FFF0E6;border-radius:12px;padding:10px 12px;color:#7A3418;display:flex;align-items:center;gap:8px;flex-wrap:wrap}.tmh .btn{min-height:44px;margin-left:auto}' +
      '.tmc dl{display:grid;grid-template-columns:auto minmax(0,1fr);gap:6px 14px;margin:12px 0 0}.tmc dt{color:var(--muted);font-weight:700;font-size:14px}.tmc dd{margin:0;line-height:1.5}' +
      'html[data-skin="dark"] .tmk .hot,html[data-skin="dark"] .tmh{background:#3A2418;color:#FFD9C2}' +
      '.ntop{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:16px}.nrole{background:var(--surface);border:1px solid var(--line);border-radius:999px;padding:8px 14px}.nok{color:var(--green);font-weight:800}' +
      '.nc{background:var(--surface);border:1px solid var(--line);border-left:6px solid var(--line2);border-radius:16px;padding:14px 16px;margin-top:12px;box-shadow:var(--sh1)}.nc.un{border-left-color:#E07B39}.nc.old{opacity:.6}.nc.nkx7{border-left-color:var(--gold2);background:var(--gold-soft)}.nc header{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.nc header b{font-size:18px}.nc header em{font-style:normal;background:#E07B39;color:#fff;border-radius:999px;padding:2px 10px;font-size:12px;font-weight:800}' +
      '.nkd{border-radius:999px;padding:3px 10px;font-weight:800;font-size:13px;background:var(--navy);color:var(--navy-ink)}.nsc{margin-top:8px;font-weight:700;color:var(--gold-ink)}.nfee{margin-top:8px;font-size:18px;background:#E8F3EA;color:#2F6B3B;border-radius:12px;padding:8px 12px}.nb{margin-top:8px;line-height:1.6}.nrd{margin-top:8px;display:flex;gap:8px;flex-wrap:wrap;font-size:14px}.nrd .y{color:var(--green);font-weight:700}.nrd .n{color:var(--muted)}' +
      '.nf{display:grid;gap:10px;margin-top:12px}.nf label,.nf3 label,.nf4 label,.af label{display:flex;flex-direction:column;gap:4px;font-weight:700;font-size:14px}.nf input,.nf select,.nf textarea,.af input,.af select,.wl2 input{min-height:48px;font:inherit;font-size:16px;padding:8px 12px;border-radius:12px;border:1.5px solid var(--line2);background:var(--surface);color:var(--ink)}.nf3{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,150px),1fr));gap:10px}.nf4{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,130px),1fr));gap:8px;background:var(--surface2);border-radius:12px;padding:10px}.nf4 p{grid-column:1/-1;margin:0}.nf4 input{min-height:44px;font:inherit;padding:6px 10px;border-radius:10px;border:1.5px solid var(--line2)}' +
      '.cc{display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap;border-bottom:1px solid var(--line);padding:12px 0}.cc p{margin:4px 0 0}.cf b{font-size:18px}.cst{display:flex;flex-direction:column;align-items:flex-end;font-weight:800;color:var(--green)}.cst small{font-weight:500;color:var(--muted)}' +
      '.af{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,150px),1fr));gap:10px;margin-top:10px}.afw{grid-column:1/-1}.tbw{overflow-x:auto}.adt{width:100%;border-collapse:collapse;min-width:520px;margin-top:10px}.adt th,.adt td{text-align:left;padding:9px 10px;border-bottom:1px solid var(--line)}.adt th{background:var(--navy);color:var(--navy-ink);font-size:14px}.adr{margin:6px 0}' +
      '.wnext{border:2px solid var(--gold2)}.wnext h2{font-size:28px;margin-top:4px}.word{margin:10px 0 0;padding-left:22px}.word li{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;padding:8px 0;border-bottom:1px solid var(--line)}.word em{font-style:normal;font-size:13px;border-radius:999px;padding:2px 8px}.word em.y{background:#E8F3EA;color:#2F6B3B}.word em.n{background:#EEF1F5;color:#4A5568}.wst{font-weight:800}' +
      '.opsrow{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.opsrow .btn{min-height:48px}.atok{display:inline-flex;align-items:center;min-height:48px;padding:0 14px;border-radius:12px;background:#E8F3EA;color:#2F6B3B;font-weight:800}' +
      '.wkban{margin-top:10px;border:2px solid #E07B39;background:#FFF0E6;color:#7A3418;border-radius:16px;padding:12px 14px;display:flex;gap:10px;align-items:center;flex-wrap:wrap}.wkban b{font-size:18px}.wkban .hb{margin-left:auto}' +
      '.friban{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:10px;text-decoration:none;color:var(--ink);background:var(--surface);border:2px dashed var(--gold2);border-radius:16px;padding:12px 14px}.friban em{font-style:normal;margin-left:auto;font-weight:800}' +
      '.privban{margin-top:10px;display:flex;gap:12px;align-items:center;flex-wrap:wrap;border:2px solid #3B6FD8;background:#EEF4FF;color:#14233F;border-radius:16px;padding:12px 14px}.privban div{flex:1 1 260px;display:flex;flex-direction:column;gap:2px}.privban b{font-size:17px}.privban small{color:#3E4A63}html[data-skin=\"dark\"] .privban{background:#14233F;color:#CFE0FF}html[data-skin=\"dark\"] .privban small{color:#AFC4EA}' +
      '.ivb{margin-top:12px;display:grid;gap:8px}.ivb textarea{font:inherit;padding:10px;border-radius:12px;border:1.5px solid var(--line2);min-height:110px}' +
      'html[data-skin=\"dark\"] .wkban,html[data-skin=\"dark\"] .nfee{background:#2A2414;color:#F5E6C0}' +
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
  /* ---------- 팀 상담 요약 (팀장 지원) · 이름 · 연락처 · 메모 없음 ---------- */
  var T = { d: null, f: 'all' };
  var TDEMO = { ok: true, lead: true, siteName: '상동역 롯데캐슬 시그니처', members: [{ sid: 'OWNER', who: '나 (팀장)' }, { sid: 'D1', who: '팀원 A (예시)' }, { sid: 'D2', who: '팀원 B (예시)' }],
    rows: [
      { '번호': 'T-demo1', '구독자': 'D1', '상담사': '팀원 A (예시)', '고객 번호': '1125-03K7', '상담일': '%%TODAY%%', '고친 일시': '%%TODAY%% 15:20', '가족': '4인 · 초등 자녀', '보기 모드': '보통', '주택 수': '무주택', '중요한 3가지': '아이 학교 · 교육 · 출퇴근 · 역 · 자금 부담 줄이기', '후보': '1순위 107동 3호 라인 84F 6~9층 · 14.4억 / 2순위 106동 2호 라인 84C 10~19층 · 14.44억', '어디까지': '하나 고르기 완료 · 계약 일정', '망설임': '', '가망': 'A', '다음 약속': '계약 11/28 14:00', '대기': '', '혜택 안내': '', '도움 요청': '요청', '도움 내용': '자금 · 대출 상담', '팀장 확인': '' },
      { '번호': 'T-demo2', '구독자': 'D2', '상담사': '팀원 B (예시)', '고객 번호': '1125-01P2', '상담일': '%%TODAY%%', '고친 일시': '%%TODAY%% 11:05', '가족': '2인 · 부부', '보기 모드': '아주 크게', '주택 수': '1주택', '중요한 3가지': '조용한 곳 · 공원 · 정원 · 자금 부담 줄이기', '후보': '1순위 103동 5호 라인 84D 6~9층 · 14.33억', '어디까지': '모형 앞 확인', '망설임': '가족과 상의해 볼게요', '가망': 'B', '다음 약속': '2차 방문 11/27 11:00', '대기': '', '혜택 안내': '', '도움 요청': '', '도움 내용': '', '팀장 확인': '' },
      { '번호': 'T-demo3', '구독자': 'D1', '상담사': '팀원 A (예시)', '고객 번호': '1124-05Q1', '상담일': '어제', '고친 일시': '어제 17:40', '가족': '3인', '보기 모드': '크게', '주택 수': '1주택', '중요한 3가지': '넓은 집 · 수납 · 커뮤니티 · 운동', '후보': '1순위 105동 6호 라인 113A 20~25층 · 21.6억', '어디까지': '한 줄 요약', '망설임': '값이 더 내려가지 않을까요?', '가망': 'C', '다음 약속': '다음 연락 11/30', '대기': '예', '혜택 안내': '', '도움 요청': '', '도움 내용': '', '팀장 확인': '' }] };
  function tdemo() { var t = new Date(), td = t.getFullYear() + '-' + ('0' + (t.getMonth() + 1)).slice(-2) + '-' + ('0' + t.getDate()).slice(-2), y = new Date(t - 864e5), yd = y.getFullYear() + '-' + ('0' + (y.getMonth() + 1)).slice(-2) + '-' + ('0' + y.getDate()).slice(-2);
    return JSON.parse(JSON.stringify(TDEMO).replace(/%%TODAY%%/g, td).replace(/어제/g, yd)); }
  function tload(seen) { if (demo() || !hasApi()) { T.d = T.d || (demo() ? tdemo() : { ok: true, lead: false, rows: [], members: [] }); if (seen) T.d.rows.forEach(function (r) { if (r['번호'] === seen) r['팀장 확인'] = '확인함'; }); return Promise.resolve(T.d); }
    return api('teamlist', seen ? { seen: seen } : {}).then(function (j) { T.d = j; return j; }); }
  function today() { var t = new Date(); return t.getFullYear() + '-' + ('0' + (t.getMonth() + 1)).slice(-2) + '-' + ('0' + t.getDate()).slice(-2); }
  function teamPage(root) {
    css(); var d = T.d, sd = data() || {};
    var h = '<div class="dx wx"><header class="vtop"><a class="back" href="./">← 상담 데스크</a><div><p class="eyebrow">고객 관리 · ' + esc((d && d.siteName) || sd.siteName || '') + '</p><h1>' + (d && !d.lead ? '내 상담 요약' : '팀 상담 요약') + '</h1><p class="sub">팀원이 결과지를 보내면 상담 요약이 자동으로 올라옵니다. <b>고객 이름 · 연락처 · 메모는 올라오지 않습니다.</b> 고객은 번호(예: 1125-03K7)로만 구분합니다.' + (demo() ? ' <b>시연판 · 예시 자료입니다.</b>' : '') + '</p></div></header>';
    if (!d) { root.innerHTML = h + '<p class="loading">불러오는 중…</p></div>'; tload().then(function () { teamPage(root); }).catch(function () { root.innerHTML = h + '<p class="sub">웹앱 연결 전이거나 인터넷이 끊겼습니다. 웹앱을 다시 배포한 뒤 쓸 수 있습니다.</p></div>'; }); return; }
    var R = d.rows || [], td = today(), help = R.filter(function (r) { return r['도움 요청'] && !r['팀장 확인']; });
    if (d.lead) {
      var tc = R.filter(function (r) { return r['상담일'] === td; });
      h += '<div class="tmk"><div><span>오늘 상담</span><b>' + tc.length + '</b></div><div><span>A 가망 (14일)</span><b>' + R.filter(function (r) { return r['가망'] === 'A'; }).length + '</b></div><div class="' + (help.length ? 'hot' : '') + '"><span>도움 요청</span><b>' + help.length + '</b></div></div>';
      h += '<section class="dxb"><h2>팀원별</h2><div class="tmm">' + (d.members || []).map(function (m) { var r = R.filter(function (x) { return x['구독자'] === m.sid; });
        return '<div><b>' + esc(m.who) + '</b><span>오늘 ' + r.filter(function (x) { return x['상담일'] === td; }).length + ' · 14일 ' + r.length + ' · A ' + r.filter(function (x) { return x['가망'] === 'A'; }).length + '</span></div>'; }).join('') + '</div><p class="fine">숫자는 감시가 아니라 <b>도울 곳을 찾는 용도</b>입니다. 도움 요청과 A 가망 고객부터 같이 봐 주세요.</p></section>';
    }
    var F = { all: ['전체', R], help: ['도움 요청', R.filter(function (r) { return r['도움 요청']; })], a: ['A 가망', R.filter(function (r) { return r['가망'] === 'A'; })], today: ['오늘', R.filter(function (r) { return r['상담일'] === td; })] };
    h += '<div class="tmf">' + Object.keys(F).map(function (k) { return '<button data-tm="f" data-k="' + k + '"' + (T.f === k ? ' class="on"' : '') + '>' + F[k][0] + ' ' + F[k][1].length + '</button>'; }).join('') + '</div>';
    var L = F[T.f] ? F[T.f][1] : R;
    h += L.length ? L.map(function (r) { var tp = r['가망'];
      return '<article class="tmc' + (r['도움 요청'] && !r['팀장 확인'] ? ' hlp' : '') + '"><header><span class="tmt t' + esc(tp || 'x') + '">' + (tp ? tp + ' 가망' : '가망 미정') + '</span><b>고객 ' + esc(r['고객 번호']) + '</b><span class="tmw">' + esc(r['상담사']) + ' · ' + esc(r['고친 일시'] || r['상담일']) + '</span></header>' +
        (r['도움 요청'] ? '<p class="tmh">🙋 도움 요청 · <b>' + esc(r['도움 내용']) + '</b>' + (r['팀장 확인'] ? ' <span>· 팀장 확인함</span>' : (d.lead ? ' <button class="btn btn-s" data-tm="seen" data-id="' + esc(r['번호']) + '">확인했어요</button>' : '')) + '</p>' : '') +
        '<dl><dt>가족</dt><dd>' + esc([r['가족'], r['주택 수']].filter(Boolean).join(' · ') || '-') + '</dd><dt>중요한 3가지</dt><dd>' + esc(r['중요한 3가지'] || '-') + '</dd><dt>후보</dt><dd>' + (r['후보'] ? String(r['후보']).split(' / ').map(esc).join('<br>') : '-') + '</dd><dt>어디까지</dt><dd>' + esc(r['어디까지'] || '-') + '</dd>' +
        (r['망설임'] ? '<dt>망설임</dt><dd>' + esc(r['망설임']) + '</dd>' : '') + '<dt>다음 약속</dt><dd>' + esc(r['다음 약속'] || '-') + '</dd>' + (r['대기'] ? '<dt>대기</dt><dd>원하는 호실 대기 등록</dd>' : '') + (r['혜택 안내'] ? '<dt>혜택 안내</dt><dd>' + esc(r['혜택 안내']) + '</dd>' : '') + (r['보기 모드'] && r['보기 모드'] !== '보통' ? '<dt>보기 모드</dt><dd>' + esc(r['보기 모드']) + '</dd>' : '') + '</dl></article>'; }).join('') : '<p class="sub" style="margin-top:16px">아직 올라온 상담 요약이 없습니다. 상담 끝에 ‘결과지 보내기’를 열면 자동으로 올라옵니다.</p>';
    root.innerHTML = h + '<p class="fine" style="margin-top:18px">최근 14일 · 이 현장만 · ' + (d.lead ? '팀원과 내 상담' : '내 상담') + '이 보입니다. 고객 이름 · 연락처는 담당 상담사의 고객 장부에만 있습니다.</p></div>';
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-tm]'); if (!b) return; var r = $('#root');
    if (b.dataset.tm === 'f') { T.f = b.dataset.k; teamPage(r); return; }
    if (b.dataset.tm === 'seen') { b.disabled = true; tload(b.dataset.id).then(function () { toast('확인 표시했습니다'); teamPage(r); }).catch(function () { b.disabled = false; toast('인터넷 연결을 확인해 주세요'); }); }
  });
  /* ================= 팀장 · 직원 운영: 공지 · 수수료 · 출근 · 광고 · 워킹 · 방문 초대 ================= */
  var OPS = { n: null, nk: '', c: null, ad: null, wk: null, inv: null };
  function ymd(t) { t = t || new Date(); return t.getFullYear() + '-' + ('0' + (t.getMonth() + 1)).slice(-2) + '-' + ('0' + t.getDate()).slice(-2); }
  function head(eb, t, sub) { return '<div class="dx wx"><header class="vtop"><a class="back" href="./">← 상담 데스크</a><div><p class="eyebrow">' + eb + '</p><h1>' + t + '</h1><p class="sub">' + sub + (demo() ? ' <b>시연판 · 예시 자료이며 서버에 저장하지 않습니다.</b>' : '') + '</p></div></header>'; }
  function load(key, op, demoVal, body) { if (demo() || !hasApi()) { OPS[key] = OPS[key] || JSON.parse(JSON.stringify(demoVal)); return Promise.resolve(OPS[key]); } return api(op, body || {}).then(function (j) { OPS[key] = j; return j; }); }
  function role() { var d = data() || {}; return d.role || (d.isLead ? '팀장' : '직원'); }
  // ---- 공지 ----
  var NK = ['전체', '미계약 호실', '혜택', '조건 변경', '수수료 변경', '정책 · 세금', '개인정보', '전략', '팀 공지'];
  var NDEMO = { ok: true, role: '팀장', lead: true, list: [
    { id: 'N-d1', kind: '전략', title: '(예시) 중기 전략 · 105 · 106동 10~19층 집중', body: '남향 고층은 계약 완료가 많습니다. 105동 중층부터 브리핑하세요.\n이미 계약된 층은 상담 화면 메모에 따로 표시됩니다.', dong: '105,106', type: '', band: '10~19층', fee: '', from: '', to: '', by: '디어', at: '%%T%% 09:00', live: true, read: false, readers: [{ who: '팀원 A (예시)', ok: true }, { who: '팀원 B (예시)', ok: false }] },
    { id: 'N-d2', kind: '수수료 변경', title: '(예시) 107동 84F 수수료 변경', body: '11/25 계약분부터 적용합니다.', dong: '107', type: '84F', band: '', fee: '500만 원', role: '팀장', from: '%%T%%', to: '', by: '디어', at: '%%T%% 08:40', live: true, read: false, readers: [{ who: '팀원 A (예시)', ok: true }, { who: '팀원 B (예시)', ok: true }] },
    { id: 'N-d3', kind: '미계약 호실', title: '(예시) 106동 2호 라인 15층 다시 나옴', body: '해약으로 다시 상담 가능합니다. 기다리던 고객에게 방문 확정 링크를 보내 주세요.', dong: '106', type: '84C', band: '10~19층', fee: '', from: '', to: '', by: '디어', at: '%%T%% 08:30', live: true, read: true },
    { id: 'N-d4', kind: '정책 · 세금', title: '(예시) 이번 주 확인할 정책 · 세금', body: '대출 · 세금은 은행 · 세무사 최종 확인을 안내합니다. 공식 발표만 근거로 씁니다.', dong: '', type: '', band: '', fee: '', from: '', to: '', by: '디어', at: '%%T%% 08:00', live: true, read: true },
    { id: 'N-d5', kind: '팀 공지', title: '(예시) 오늘 오후 2시 팀 회의', body: '상담석 3번 앞 · 10분', dong: '', type: '', band: '', fee: '', from: '', to: '', by: '나 (팀장)', at: '%%T%% 07:50', live: true, read: true, team: true }] };
  function td(o) { return JSON.parse(JSON.stringify(o).replace(/%%T%%/g, ymd())); }
  function noticePage(root) {
    css(); var d = OPS.n, own = 'OWNER' === 'OWNER';
    var h = head('고객 관리 · 이 현장만', '공지사항', '미계약 호실 · 혜택 · 조건 · 수수료 · 정책 · 세금 · 전략을 여기로만 받습니다. 동 · 타입 · 층이 함께 적혀 있어 헷갈리지 않습니다. <b>수수료는 내 역할의 금액만</b> 보입니다.');
    if (!d) { root.innerHTML = h + '<p class="loading">불러오는 중…</p></div>'; load('n', 'noticelist', td(NDEMO)).then(function () { noticePage(root); }).catch(function () { root.innerHTML = h + '<p class="sub">웹앱 연결 전이거나 인터넷이 끊겼습니다.</p></div>'; }); return; }
    var L = d.list || [], un = L.filter(function (x) { return !x.read; });
    h += '<div class="ntop"><span class="nrole">내 역할 · <b>' + esc(d.role || role()) + '</b></span>' + (un.length ? '<button class="btn btn-p" data-o2="nreadall">안 읽은 ' + un.length + '건 모두 확인했어요</button>' : '<span class="nok">✓ 모두 확인했습니다</span>') + (d.lead ? '<button class="btn btn-s" data-o2="nnew">' + (own ? '공지 올리기' : '팀 공지 올리기') + '</button>' : '') + '</div>';
    h += '<div class="tmf">' + NK.map(function (k) { var n = k === '전체' ? L.length : L.filter(function (x) { return x.kind === k; }).length; return n || k === '전체' ? '<button data-o2="nk" data-k="' + k + '"' + ((OPS.nk || '전체') === k ? ' class="on"' : '') + '>' + k + ' ' + n + '</button>' : ''; }).join('') + '</div>';
    var V = L.filter(function (x) { return !OPS.nk || OPS.nk === '전체' || x.kind === OPS.nk; }); V.sort(function (a, b) { return (a.kind === '전략' ? 0 : 1) - (b.kind === '전략' ? 0 : 1); });
    h += V.length ? V.map(function (x) {
      var sc = [x.dong && x.dong + '동', x.type, x.band].filter(Boolean).join(' · ');
      return '<article class="nc nkx' + NK.indexOf(x.kind) + (x.read ? '' : ' un') + (x.live === false ? ' old' : '') + '"><header><span class="nkd">' + esc(x.kind) + '</span><b>' + esc(x.title) + '</b>' + (x.read ? '' : '<em>새 공지</em>') + '</header>' +
        (sc ? '<p class="nsc">적용 · ' + esc(sc) + '</p>' : '') + (x.fee ? '<p class="nfee">내 수수료 (' + esc(x.role || d.role || role()) + ') · <b>' + esc(x.fee) + '</b></p>' : '') +
        '<p class="nb">' + esc(x.body || '').replace(/\n/g, '<br>') + '</p><p class="fine">' + esc(x.by || '') + ' · ' + esc(x.at || '') + (x.from || x.to ? ' · 기간 ' + esc(x.from || '') + ' ~ ' + esc(x.to || '') : '') + (x.live === false ? ' · 기간 밖' : '') + '</p>' +
        (x.readers ? '<p class="nrd">확인 · ' + x.readers.map(function (r) { return '<span class="' + (r.ok ? 'y' : 'n') + '">' + (r.ok ? '✓ ' : '○ ') + esc(r.who) + '</span>'; }).join(' ') + '</p>' : '') +
        '<div class="hb">' + (x.read ? '' : '<button class="btn btn-g" data-o2="nread" data-id="' + esc(x.id) + '">확인했어요</button>') + ((own || x.team) && d.lead ? '<button class="btn btn-s" data-o2="ndel" data-id="' + esc(x.id) + '">내리기</button>' : '') + '</div></article>'; }).join('') : '<p class="sub" style="margin-top:14px">이 종류의 공지가 없습니다.</p>';
    root.innerHTML = h + '<p class="fine" style="margin-top:16px">수수료 · 혜택 · 조건 변경은 대행사(현재는 디어)만 올립니다. 팀장은 팀 공지만 올릴 수 있습니다. 확인 기록은 팀장에게 보입니다.</p></div>';
  }
  function noticeNew() {
    var own = 'OWNER' === 'OWNER', kinds = own ? NK.slice(1) : ['팀 공지'];
    var o = sheet('<h2>' + (own ? '공지 올리기' : '팀 공지 올리기') + '</h2><div class="nf"><label>종류<select id="nfk">' + kinds.map(function (k) { return '<option>' + k + '</option>'; }).join('') + '</select></label><label>제목<input id="nft" maxlength="60" placeholder="예: 107동 84F 수수료 변경"></label>' +
      '<label>내용<textarea id="nfb" rows="4" maxlength="1200"></textarea></label>' + (own ? '<div class="nf3"><label>대상 동 (쉼표)<input id="nfd" placeholder="105,106"></label><label>대상 타입<input id="nfy" placeholder="84F"></label><label>대상 층<input id="nfl" placeholder="b1019 (비우면 전체)"></label></div>' +
      '<div class="nf4" id="nffee"><p><b>역할별 수수료</b> · 각자 자기 역할 금액만 봅니다</p>' + ['직원', '팀장', '본부장', '총괄'].map(function (r) { return '<label>' + r + '<input data-fee="' + r + '" placeholder="예: 300만 원"></label>'; }).join('') + '</div>' +
      '<label id="nfbs">시행사 승인 근거 (혜택은 필수)<input id="nfbasis" placeholder="예: 한국자산신탁 공문 제12호"></label><div class="nf3"><label>시작일<input id="nff" type="date"></label><label>끝나는 날<input id="nfe" type="date"></label></div>' : '') +
      '</div><div class="hb"><button class="btn btn-p" data-o2="nsend">올리기</button><button class="btn btn-s" data-wx>닫기</button></div><p class="fine">고객 이름 · 연락처는 넣지 않습니다. 올리면 ' + (own ? '이 현장 태블릿 전체' : '우리 팀 태블릿') + '에 알림이 갑니다.</p>');
    return o;
  }
  // ---- 수수료 · 청구 ----
  var CDEMO = { ok: true, role: '팀장', lead: true, list: [{ hold: 'H-d1', unit: '107동 3호 라인 21층 84F', done: '%%T%% 16:10', fee: '500만 원', feeTitle: '(예시) 107동 84F 수수료 변경', claim: null }, { hold: 'H-d2', unit: '106동 2호 라인 12층 84C', done: '2026-11-20 11:00', fee: '400만 원', feeTitle: '(예시) 84 타입 기본', claim: { id: 'C-d1', status: '팀장 확인', at: '2026-11-21 10:00' } }],
    team: [{ id: 'C-d2', who: '팀원 A (예시)', unit: '105동 2호 라인 18층 84C', role: '직원', fee: '250만 원', status: '청구', at: '%%T%% 10:20' }] };
  function wonNum(t) { var s = String(t || '').replace(/,/g, ''), m = /([\d.]+)\s*억/.exec(s), n = 0; if (m) n += +m[1] * 1e8; var k = /([\d.]+)\s*만/.exec(s); if (k) n += +k[1] * 1e4; if (!m && !k) { var p = /([\d.]+)/.exec(s); if (p) n = +p[1]; } return Math.round(n); }
  function wonTxt(n) { return n >= 1e4 ? Math.floor(n / 1e4).toLocaleString('ko-KR') + '만' + (n % 1e4 ? ' ' + (n % 1e4).toLocaleString('ko-KR') : '') + ' 원' : n.toLocaleString('ko-KR') + ' 원'; }
  function claimPage(root) {
    css(); var d = OPS.c;
    var h = head('내 정보 · 수수료', '수수료 · 청구', '계약 완료된 내 호실과 <b>내 역할(직원 · 팀장)의 수수료</b>가 공지대로 자동으로 맞춰집니다. 확인하고 PIN으로 본인 확인하면 청구가 끝납니다.');
    if (!d) { root.innerHTML = h + '<p class="loading">불러오는 중…</p></div>'; load('c', 'claimlist', td(CDEMO)).then(function () { claimPage(root); }).catch(function () { root.innerHTML = h + '<p class="sub">웹앱 연결 전이거나 인터넷이 끊겼습니다.</p></div>'; }); return; }
    h += '<section class="dxb"><h2>내 계약 · ' + esc(d.role || role()) + '</h2>' + ((d.list || []).length ? d.list.map(function (x) { var n = wonNum(x.fee);
      return '<div class="cc"><div><b>' + esc(x.unit) + '</b><p>계약 완료 ' + esc(x.done || '') + '</p>' + (x.fee ? '<p class="cf">예상 수수료 <b>' + esc(x.fee) + '</b>' + (n ? ' · 원천징수 3.3% 뒤 약 <b>' + wonTxt(Math.round(n * 0.967)) + '</b>' : '') + '</p><small>근거 공지 · ' + esc(x.feeTitle || '') + '</small>' : '<p class="cf">이 호실에 맞는 수수료 공지가 아직 없습니다 · 대행사(디어)에 문의</p>') + '</div>' +
        (x.claim ? '<span class="cst">' + esc(x.claim.status) + '<small>' + esc(x.claim.at || '') + '</small></span>' : (x.fee ? '<button class="btn btn-g" data-o2="creq" data-h="' + esc(x.hold) + '" data-u="' + esc(x.unit) + '" data-f="' + esc(x.fee) + '">청구하기</button>' : '')) + '</div>'; }).join('') : '<p class="sub">아직 계약 완료된 호실이 없습니다. 대기 고객 · 호실 진행에서 ‘계약 완료’를 누르면 여기에 나옵니다.</p>') + '</section>';
    if (d.lead) h += '<section class="dxb"><h2>팀원 청구 · 팀장 확인</h2>' + ((d.team || []).length ? d.team.map(function (x) { return '<div class="cc"><div><b>' + esc(x.who) + ' · ' + esc(x.unit) + '</b><p>' + esc(x.role) + ' · ' + esc(x.fee) + ' · ' + esc(x.at) + '</p></div>' + (x.status === '청구' ? '<div class="hb"><button class="btn btn-g" data-o2="cok" data-id="' + esc(x.id) + '">확인</button><button class="btn btn-s" data-o2="cback" data-id="' + esc(x.id) + '">돌려보내기</button></div>' : '<span class="cst">' + esc(x.status) + '</span>') + '</div>'; }).join('') : '<p class="sub">확인할 청구가 없습니다.</p>') + '</section>';
    root.innerHTML = h + '<p class="fine" style="margin-top:14px">상담사 수수료는 보통 사업소득으로 지급 때 3.3%(소득세 3% · 지방소득세 0.3%)를 원천징수합니다 (소득세법 제129조). 화면의 세후 금액은 참고용이며, 실제 금액은 대행사 지급명세서를 따릅니다. 세금은 세무사에게 확인하세요.</p></div>';
  }
  // ---- 광고 기록 ----
  var MEDIA = ['네이버', '당근', '문자', '카카오', '유튜브 · SNS', '전단 · 현수막', '지인 소개', '대행사 지원', '기타'];
  var ADEMO = { ok: true, lead: true, since: '', media: [{ media: '네이버', cost: 600000, calls: 31, consult: 6, a: 2 }, { media: '당근', cost: 150000, calls: 12, consult: 3, a: 1 }, { media: '문자', cost: 80000, calls: 9, consult: 2, a: 0 }, { media: '대행사 지원', cost: 0, calls: 22, consult: 5, a: 1 }, { media: '지인 소개', cost: 0, calls: 0, consult: 2, a: 1 }],
    recent: [{ who: '팀원 A (예시)', day: '%%T%%', media: '네이버', src: '본인', cost: 100000, calls: 6, memo: '파워링크' }, { who: '나 (팀장)', day: '%%T%%', media: '대행사 지원', src: '대행사 지원', cost: 0, calls: 4, memo: '현장 문자' }] };
  function adPage(root) {
    css(); var d = OPS.ad;
    var h = head('고객 관리 · 광고 성과', '광고 기록', '내가 쓴 광고비와 콜 수를 남기면, 상담 때 고른 ‘어떻게 알고 오셨어요?’와 합쳐 <b>매체별 성과</b>가 쌓입니다. 고객 이름 · 연락처는 적지 않습니다.');
    if (!d) { root.innerHTML = h + '<p class="loading">불러오는 중…</p></div>'; load('ad', 'adlist', td(ADEMO)).then(function () { adPage(root); }).catch(function () { root.innerHTML = h + '<p class="sub">웹앱 연결 전이거나 인터넷이 끊겼습니다.</p></div>'; }); return; }
    h += '<section class="dxb"><h2>오늘 광고 남기기</h2><div class="af"><label>날짜<input id="afd" type="date" value="' + ymd() + '"></label><label>매체<select id="afm">' + MEDIA.map(function (m) { return '<option>' + m + '</option>'; }).join('') + '</select></label><label>쓴 돈 (원)<input id="afc" type="number" inputmode="numeric" min="0" placeholder="100000"></label><label>콜 수<input id="afn" type="number" inputmode="numeric" min="0" placeholder="5"></label><label class="afw">메모 (고객 정보 X)<input id="afo" maxlength="60" placeholder="예: 파워링크 · 오전"></label></div><div class="hb"><button class="btn btn-p" data-o2="adsave">남기기</button></div></section>';
    var M = (d.media || []).filter(function (m) { return m.cost || m.calls || m.consult; });
    h += '<section class="dxb"><h2>최근 30일 · ' + (d.lead ? '우리 팀' : '나') + '</h2><div class="tbw"><table class="adt"><tr><th>매체</th><th>쓴 돈</th><th>콜</th><th>상담</th><th>A 가망</th><th>콜당 비용</th></tr>' + (M.length ? M.map(function (m) { return '<tr><td>' + esc(m.media) + '</td><td>' + (m.cost ? wonTxt(m.cost) : '-') + '</td><td>' + m.calls + '</td><td>' + m.consult + '</td><td>' + m.a + '</td><td>' + (m.cost && m.calls ? wonTxt(Math.round(m.cost / m.calls)) : '-') + '</td></tr>'; }).join('') : '<tr><td colspan="6">아직 기록이 없습니다</td></tr>') + '</table></div><p class="fine">상담 · A 가망은 상담 화면의 ‘어떻게 알고 오셨어요?’로 셉니다. 같은 매체라도 대행사 지원과 내 광고는 따로 적어 주세요.</p></section>';
    h += '<section class="dxb"><h2>최근 기록</h2>' + ((d.recent || []).length ? d.recent.map(function (r) { return '<p class="adr">' + esc(r.day) + ' · <b>' + esc(r.media) + '</b> · ' + (r.cost ? wonTxt(r.cost) : '0원') + ' · 콜 ' + r.calls + (r.memo ? ' · ' + esc(r.memo) : '') + (d.lead ? ' · ' + esc(r.who) : '') + '</p>'; }).join('') : '<p class="sub">아직 없습니다.</p>') + '</section>';
    root.innerHTML = h + '</div>';
  }
  // ---- 워킹 배정 (팀장) ----
  var KDEMO = { ok: true, lead: true, order: [{ sid: 'D1', who: '팀원 A (예시)', here: true }, { sid: 'D2', who: '팀원 B (예시)', here: true }, { sid: 'OWNER', who: '나 (팀장)', here: true }], next: 'D2', today: [{ id: 'K-d1', at: '%%T%% 10:12', to: '팀원 A (예시)', kind: '워킹', cust: '', status: '받음' }] };
  function walkPage(root) {
    css(); var d = OPS.wk;
    var h = head('고객 관리 · 팀장', '워킹 배정', '워킹 고객 · 담당 고객 방문 · 계약자 방문을 팀원 태블릿으로 바로 보냅니다. 순번대로 ‘다음 차례’를 누르면 됩니다.');
    if (!d) { root.innerHTML = h + '<p class="loading">불러오는 중…</p></div>'; load('wk', 'walklist', td(KDEMO)).then(function () { walkPage(root); }).catch(function () { root.innerHTML = h + '<p class="sub">웹앱 연결 전이거나 인터넷이 끊겼습니다.</p></div>'; }); return; }
    if (!d.lead) { root.innerHTML = h + '<section class="dxb"><p>워킹 배정은 팀장 화면입니다. 배정을 받으면 상담 데스크 첫 화면과 알림에 바로 뜹니다.</p></section></div>'; return; }
    var nx = (d.order || []).filter(function (x) { return x.sid === d.next; })[0];
    h += '<section class="dxb wnext"><p class="eyebrow">다음 차례</p><h2>' + esc(nx ? nx.who : '-') + '</h2><div class="hb"><button class="btn btn-g" data-o2="wgo" data-to="' + esc(d.next) + '" data-k="워킹">워킹 고객 보내기 →</button></div></section>';
    h += '<section class="dxb"><h2>순번 · 오늘 출근</h2><ol class="word">' + (d.order || []).map(function (x, i) { return '<li><span><b>' + esc(x.who) + '</b> ' + (x.here ? '<em class="y">출근</em>' : '<em class="n">기록 없음</em>') + '</span><span class="hb"><button class="btn btn-s" data-o2="wup" data-i="' + i + '" aria-label="위로">▲</button><button class="btn btn-s" data-o2="wsend" data-to="' + esc(x.sid) + '">보내기</button></span></li>'; }).join('') + '</ol><p class="fine">출근 표시는 태블릿을 켜고 ‘출근 기록’을 누른 팀원입니다. 지각 · 벌점을 계산하지 않습니다.</p></section>';
    h += '<section class="dxb"><h2>오늘 보낸 배정</h2>' + ((d.today || []).length ? d.today.map(function (x) { return '<p class="adr">' + esc(x.at) + ' · <b>' + esc(x.to) + '</b> · ' + esc(x.kind) + (x.cust ? ' · ' + esc(x.cust) : '') + ' · <span class="wst">' + esc(x.status) + '</span></p>'; }).join('') : '<p class="sub">아직 없습니다.</p>') + '</section>';
    root.innerHTML = h + '</div>';
  }
  function walkSheet(to, kind) {
    var nm = ((OPS.wk || {}).order || []).filter(function (x) { return x.sid === to; })[0];
    sheet('<h2>' + esc(nm ? nm.who : '') + ' 상담사에게 보내기</h2><div class="nf"><label>종류<select id="wkk">' + ['워킹', '담당 고객 방문', '계약자 방문'].map(function (k) { return '<option' + (k === kind ? ' selected' : '') + '>' + k + '</option>'; }).join('') + '</select></label><label>고객 성함 (지정 고객만 · 가려서 기록)<input id="wkc" placeholder="워킹이면 비워 두세요"></label><label>메모<input id="wkm" maxlength="40" placeholder="예: 3번 상담석 · 2명"></label></div><div class="hb"><button class="btn btn-p" data-o2="wsend2" data-to="' + esc(to) + '">보내기</button><button class="btn btn-s" data-wx>닫기</button></div>');
  }
  // ---- 방문 확정 링크 (특별 · 다시 나온 호실) ----
  function invSheet(pre) {
    var o = sheet('<h2>고객에게 방문 확정 링크 보내기</h2><p class="sub">고객이 링크에서 <b>직접 관심 등록 · 방문 날짜를 확정</b>해야 호실이 잡힙니다 (팀장 승인 뒤 확정). 허수로 호실을 잡을 수 없습니다. 다른 고객이 먼저 확정했으면 순번 대기로 들어갑니다.</p>' + unitForm(pre || {}, 'inv', '링크 만들기') + '<div id="ivq"></div><button class="btn btn-s" data-wx style="margin-top:8px">닫기</button>');
    bindUnits(o); return o;
  }
  function invText(unit, url) { return '[상동역 롯데캐슬 시그니처] (주)디어입니다. 기다리시던 ' + unit + '이(가) 다시 상담 가능합니다. 관심 있으시면 아래 링크에서 방문 날짜를 직접 확정해 주세요. 확정하시면 이 호실을 고객님 이름으로 진행 요청해 둡니다. ' + url; }
  function invShow(u, url) { var t = invText(unitText(u), url), e = $('#ivq'); if (!e) return; e.innerHTML = '<div class="ivb"><p class="fine">링크 · ' + esc(url) + '</p><textarea id="ivt" rows="4">' + esc(t) + '</textarea><label class="wl2">고객 휴대폰<input id="ivp" type="tel" placeholder="010-0000-0000"></label><div class="hb"><button class="btn btn-p" data-o2="ivqr">문자용 QR (상담사 폰으로 찍기)</button><button class="btn btn-s" data-o2="ivcopy">문구 복사</button></div><div id="ivqq"></div></div>'; }
  // ---- 개인정보 · 금요일 알림 · 출근 (첫 화면) ----
  var PTIPS = ['고객 이름 · 전화번호는 사진으로 찍거나 개인 메신저로 옮기지 않습니다.', '자리를 비울 때는 ‘잠그기’를 누릅니다. 30분이 지나면 저절로 잠깁니다.', '결과지 링크에는 이름 · 연락처가 없습니다. 고객 정보는 상담사 본인 장부에만 둡니다.', '광고 문자는 동의한 고객에게만, (광고) 표시와 무료 수신거부를 지우지 않고 보냅니다.', '태블릿을 잃어버리면 바로 디어(1668-2052)에 알려 주세요. 접속 코드를 바로 막습니다.', '팀 상담 요약 · 공지에는 고객 이름 · 연락처를 쓰지 않습니다.', '퇴사 · 반납 때는 태블릿의 고객 기록을 지우고 반납 확인을 받습니다.'];
  function privTip() { var n = Math.floor(Date.now() / 864e5) % PTIPS.length; return PTIPS[n]; }
  function privSeen() { try { return localStorage.getItem('sig-privday') === ymd(); } catch (e) { return true; } }
  function privBan() { return privSeen() ? '' : '<div class="privban" data-priv="1"><div><p class="eyebrow">오늘의 개인정보 수칙</p><b>🔒 ' + esc(privTip()) + '</b><small>매일 처음 켤 때 보여 드립니다. 유출은 대부분 사진 · 메신저 · 잠그지 않은 화면에서 생깁니다.</small></div><button class="btn btn-p" data-o2="privok">확인했어요</button></div>'; }
  function opsBan(d) {
    var a = [], fri = new Date().getDay() === 5, wk = ((d && d.alerts) || []).filter(function (x) { return x.kind === '워킹 배정' || x.kind === '담당 고객 방문' || x.kind === '계약자 방문'; });
    wk.forEach(function (x) { a.push('<div class="wkban"><b>🚶 ' + esc(x.kind) + '</b><span>' + esc(x.text) + '</span><span class="hb"><button class="btn btn-g" data-o2="wack" data-id="' + esc(x.ref || '') + '" data-aid="' + esc(x.id) + '" data-ok="1">받았어요</button><button class="btn btn-s" data-o2="wack" data-id="' + esc(x.ref || '') + '" data-aid="' + esc(x.id) + '" data-ok="0">지금 못 받아요</button></span></div>'); });
    a.unshift(privBan()); var att = d && d.attend, un = d && d.unread;
    a.push('<div class="opsrow">' + (att || lget('sig-att') === ymd() ? '<span class="atok">✓ 오늘 출근 기록</span>' : '<button class="btn btn-g" data-o2="att">🕘 출근 기록 · 오늘 처음 한 번</button>') + (un ? '<a class="btn btn-s" href="?p=notice">📢 새 공지 ' + un + '건</a>' : '') + (d && d.strategy ? '<a class="btn btn-s" href="?p=notice">🎯 이번 전략 · ' + esc(d.strategy.title).slice(0, 24) + '</a>' : '') + '</div>');
    if (fri) a.push('<a class="friban" href="?p=notice"><b>📅 금요일 알림</b><span>이번 주 정책 · 세금 공지와 개인정보 수칙을 확인해 주세요 · ' + esc(privTip()) + '</span><em>열기 →</em></a>');
    return a.join('');
  }
  function opsRedraw(root) { var p = (location.search.match(/p=([a-z]+)/) || [])[1]; if (p === 'notice') noticePage(root); else if (p === 'claim') claimPage(root); else if (p === 'ads') adPage(root); else if (p === 'walk') walkPage(root); }
  function opsCall(op, body, okMsg, key) {
    if (demo() || !hasApi()) { toast('시연판 · 실제로 저장하지 않았습니다'); return Promise.resolve(null); }
    return api(op, body).then(function (j) { if (j && j.ok) { if (okMsg) toast(okMsg); if (key) OPS[key] = null; opsRedraw($('#root')); } else toast(({ pin: 'PIN 본인 확인이 필요합니다', dup: '이미 청구했습니다', nofee: '맞는 수수료 공지가 없습니다', sold: '계약 완료된 호실입니다 · 다른 호실을 골라 주세요', lead: '팀장만 할 수 있습니다', owner: '대행사(디어)만 할 수 있습니다', basis: '시행사 승인 근거를 적어 주세요', op: '웹앱 업데이트 전입니다' })[j && j.why] || ('처리하지 못했습니다 (' + (j && j.why) + ')')); return j; })
      .catch(function () { toast('인터넷 연결을 확인해 주세요'); return null; });
  }
  document.addEventListener('click', async function (e) {
    var b = e.target.closest('[data-o2],[data-w="inv"]'); if (!b) return; var a = b.dataset.o2 || 'inv', r = $('#root');
    if (a === 'inv') { var box = b.closest('.uf'); if (!box) return; var ru = readUnit(box); if (!ru.u.floor || !ru.u.band) { toast('층을 확인해 주세요'); return; }
      if (demo() || !hasApi()) { invShow(ru.u, 'https://dangerouskill1174-blip.github.io/LOTTE-/v/?t=V000000.demo'); toast('시연판 · 예시 링크입니다'); return; }
      var ivj = await opsCall('invite', { unit: ru.u, wait: b.dataset.wait || '' }); if (ivj && ivj.ok) invShow(ru.u, ivj.url); return; }
    if (a === 'invopen') { invSheet({ dong: b.dataset.dong, ho: b.dataset.ho, wait: b.dataset.wid || '' }); return; }
    if (a === 'ivqr') { var tel = (($('#ivp') || {}).value || '').replace(/\D/g, ''); if (!/^01\d{8,9}$/.test(tel)) { toast('휴대폰 번호를 확인해 주세요'); return; } $('#ivqq').innerHTML = '<div class="wqr"><img src="' + qr('SMSTO:' + tel + ':' + $('#ivt').value) + '" alt="문자용 QR"><p class="fine">상담사 휴대폰 카메라로 찍으면 문자 창이 열립니다 · 보내기만 누르세요. 번호는 저장하지 않습니다.</p></div>'; return; }
    if (a === 'ivcopy') { try { await navigator.clipboard.writeText($('#ivt').value); toast('복사했습니다'); } catch (x) { toast('문구를 길게 눌러 복사해 주세요'); } return; }
    if (a === 'privok') { try { localStorage.setItem('sig-privday', ymd()); } catch (x) { } var pb = b.closest('.privban'); if (pb) pb.remove(); toast('확인했습니다 · 오늘도 안전하게'); return; }
    if (a === 'att') { if (demo() || !hasApi()) { lset('sig-att', ymd()); toast('시연판 · 출근 기록 예시'); paint(); return; }
      var dev = lget('sig-dev'); if (!dev) { dev = Math.random().toString(36).slice(2, 10); lset('sig-dev', dev); }
      var aj = await opsCall('attend', { dev: dev }); if (aj && aj.ok) { lset('sig-att', ymd()); toast(aj.again ? '오늘 이미 기록했습니다 · ' + aj.at : '출근 기록 · ' + aj.at); sync(); } return; }
    if (a === 'wack') { if (demo() || !hasApi()) { toast(b.dataset.ok === '1' ? '시연판 · 받았어요' : '시연판 · 팀장에게 못 받는다고 알림'); var wb = b.closest('.wkban'); if (wb) wb.remove(); return; }
      await opsCall('walkack', { id: b.dataset.id, ok: b.dataset.ok === '1' }, b.dataset.ok === '1' ? '받았습니다 · 상담석으로 가 주세요' : '팀장에게 알렸습니다'); api('alertseen', { ids: [b.dataset.aid] }).then(sync).catch(function () { }); var wb2 = b.closest('.wkban'); if (wb2) wb2.remove(); return; }
    // 공지
    if (a === 'nk') { OPS.nk = b.dataset.k; noticePage(r); return; }
    if (a === 'nread' || a === 'nreadall') { var ids = a === 'nread' ? [b.dataset.id] : (OPS.n.list || []).filter(function (x) { return !x.read; }).map(function (x) { return x.id; });
      if (demo() || !hasApi()) { OPS.n.list.forEach(function (x) { if (ids.indexOf(x.id) >= 0) x.read = true; }); noticePage(r); return; }
      var nj = await opsCall('noticeread', { ids: ids }); if (nj && nj.ok) { OPS.n.list.forEach(function (x) { if (ids.indexOf(x.id) >= 0) x.read = true; }); noticePage(r); sync(); } return; }
    if (a === 'nnew') { noticeNew(); return; }
    if (a === 'nsend') { var it = { kind: $('#nfk').value, title: $('#nft').value.trim(), body: $('#nfb').value.trim() }; if (!it.title) { toast('제목을 넣어 주세요'); return; }
      if ($('#nfd')) { it.dong = $('#nfd').value.trim(); it.type = $('#nfy').value.trim(); it.band = $('#nfl').value.trim(); it.basis = $('#nfbasis').value.trim(); it.from = $('#nff').value; it.to = $('#nfe').value; it.fee = {}; [].forEach.call(document.querySelectorAll('[data-fee]'), function (i) { if (i.value.trim()) it.fee[i.dataset.fee] = i.value.trim(); }); }
      if (it.kind === '혜택' && !it.basis) { toast('혜택은 시행사 승인 근거가 꼭 필요합니다'); return; }
      var sj = await opsCall('noticeadd', { item: it }, '올렸습니다 · 알림을 보냈습니다', 'n'); if (sj && sj.ok) { var ov = b.closest('.wov'); if (ov) ov.remove(); } return; }
    if (a === 'ndel') { confirmBox('공지를 내릴까요?', '태블릿에서 더 보이지 않습니다. 기록은 남습니다.', '내리기', function () { opsCall('noticedel', { id: b.dataset.id }, '내렸습니다', 'n'); }); return; }
    // 수수료 청구 · PIN 본인 확인
    if (a === 'creq') { var o2 = sheet('<h2>수수료 청구</h2><p class="sub"><b>' + esc(b.dataset.u) + '</b> · 예상 ' + esc(b.dataset.f) + '</p><label class="wl2">본인 확인 · 이 태블릿 PIN 6자리<input id="cpin" type="password" inputmode="numeric" maxlength="6" autocomplete="off"></label><p class="fine" id="cpm"></p><div class="hb"><button class="btn btn-p" data-o2="creq2" data-h="' + esc(b.dataset.h) + '">본인 확인하고 청구</button><button class="btn btn-s" data-wx>닫기</button></div><p class="fine">청구하면 팀장 확인 → 대행사 지급 순서로 갑니다. 금액은 공지된 수수료 기준이며 실제 지급은 대행사 지급명세서를 따릅니다.</p>'); setTimeout(function () { var i = $('#cpin'); if (i) i.focus(); }, 50); return; }
    if (a === 'creq2') { var pin = ($('#cpin') || {}).value || '', m = $('#cpm'), okp = demo() ? /^\d{6}$/.test(pin) : (window.SIGPIN && SIGPIN.has() ? await SIGPIN.check(pin) : false);
      if (!okp) { m.textContent = window.SIGPIN && !SIGPIN.has() && !demo() ? '이 태블릿에 PIN이 없습니다 · 설정 · PIN에서 먼저 만들어 주세요' : 'PIN이 맞지 않습니다'; return; }
      if (demo() || !hasApi()) { var ov2 = b.closest('.wov'); if (ov2) ov2.remove(); OPS.c.list.forEach(function (x) { if (x.hold === b.dataset.h) x.claim = { id: 'C-demo', status: '청구', at: ymd() }; }); claimPage(r); toast('시연판 · 청구 예시'); return; }
      var cj = await opsCall('claimreq', { hold: b.dataset.h, pinok: true }, '청구했습니다 · 팀장 확인을 기다립니다', 'c'); if (cj && cj.ok) { var ov3 = b.closest('.wov'); if (ov3) ov3.remove(); } return; }
    if (a === 'cok') { opsCall('claimact', { id: b.dataset.id, act: 'ok' }, '확인했습니다', 'c'); return; }
    if (a === 'cback') { confirmBox('청구를 돌려보낼까요?', '팀원에게 다시 확인해 달라는 알림이 갑니다.', '돌려보내기', function () { opsCall('claimact', { id: b.dataset.id, act: 'back', why: '확인 필요' }, '돌려보냈습니다', 'c'); }); return; }
    // 광고
    if (a === 'adsave') { var item = { day: $('#afd').value, media: $('#afm').value, cost: +($('#afc').value || 0), calls: +($('#afn').value || 0), memo: $('#afo').value.trim(), agency: $('#afm').value === '대행사 지원' };
      if (!item.cost && !item.calls) { toast('쓴 돈이나 콜 수를 넣어 주세요'); return; }
      if (/01\d[-\s]?\d{3,4}[-\s]?\d{4}/.test(item.memo)) { toast('메모에 전화번호를 적지 않습니다'); return; }
      if (demo() || !hasApi()) { OPS.ad.recent.unshift({ who: '나', day: item.day, media: item.media, cost: item.cost, calls: item.calls, memo: item.memo }); adPage(r); toast('시연판 · 예시로만 더했습니다'); return; }
      opsCall('adlog', { item: item }, '남겼습니다', 'ad'); return; }
    // 워킹
    if (a === 'wgo' || a === 'wsend') { walkSheet(b.dataset.to, b.dataset.k || '워킹'); return; }
    if (a === 'wsend2') { var bd = { to: b.dataset.to, kind: $('#wkk').value, cust: $('#wkc').value.trim(), memo: $('#wkm').value.trim() };
      if (demo() || !hasApi()) { var ov4 = b.closest('.wov'); if (ov4) ov4.remove(); OPS.wk.today.unshift({ at: ymd() + ' 지금', to: (OPS.wk.order.filter(function (x) { return x.sid === bd.to; })[0] || {}).who, kind: bd.kind, cust: bd.cust ? bd.cust.slice(0, 1) + '○○' : '', status: '보냄' }); walkPage(r); toast('시연판 · 실제로 보내지 않았습니다'); return; }
      var wj = await opsCall('walk', bd, '보냈습니다 · 팀원 태블릿에 알림', 'wk'); if (wj && wj.ok) { var ov5 = b.closest('.wov'); if (ov5) ov5.remove(); } return; }
    if (a === 'wup') { var i = +b.dataset.i, o3 = OPS.wk.order; if (i > 0) { var t = o3[i - 1]; o3[i - 1] = o3[i]; o3[i] = t; } walkPage(r); if (!demo() && hasApi()) api('walkorder', { order: o3.map(function (x) { return x.sid; }) }).catch(function () { }); return; }
  });
  window.DESKW = { hub: hub, wait: function (r) { W.list = null; waitPage(r); }, promo: function (r) { P.list = null; promoPage(r); }, team: function (r) { T.d = null; teamPage(r); }, notice: function (r) { OPS.n = null; noticePage(r); }, claim: function (r) { OPS.c = null; claimPage(r); }, ads: function (r) { OPS.ad = null; adPage(r); }, walk: function (r) { OPS.wk = null; walkPage(r); }, sync: sync, data: data, demo: demo };
})();
