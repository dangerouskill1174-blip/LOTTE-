/* 상담 데스크 추가 화면: 개인정보 보안교육(입구) · 고객 질문함 · 설정(비밀번호) · 운영자 통계
   상담 데스크(index.html)가 window.DESK 를 만든 뒤 불러 씁니다. */
(function () {
  var EDU_VER = '2026-4Q', PASS = 8, VALID_DAYS = 90;
  var $ = function (q, r) { return (r || document).querySelector(q); }, $$ = function (q, r) { return [].slice.call((r || document).querySelectorAll(q)); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]; }); }
  function lget(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function lset(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function D() { return window.DESK || {}; }
  function cfg() { return D().cfg || {}; }
  function hasApi() { var a = cfg().api; return !!(a && a.indexOf('%%') < 0 && /^https?:\/\//.test(a)); }
  function toast(t) { if (D().toast) D().toast(t); }
  function day(t) { var d = new Date(t); return d.getFullYear() + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + String(d.getDate()).padStart(2, '0'); }
  function api(op, body) {
    if (!hasApi()) return Promise.reject(new Error('noapi'));
    return D().auth().then(function (tag) {
      var o = Object.assign({ op: op, sid: cfg().sid, auth: tag }, body || {});
      return fetch(cfg().api, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(o) });
    }).then(function (r) { return r.json(); }).then(function (j) { if (!j || !j.ok) throw new Error((j && j.why) || 'fail'); return j; });
  }
  function load(src) { return new Promise(function (res, rej) { if ($('script[src="' + src + '"]')) return res(); var s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); }); }
  function css() {
    if ($('#dxcss')) return;
    var s = document.createElement('style'); s.id = 'dxcss';
    s.textContent = '.dx{max-width:980px;margin:0 auto;padding:22px max(16px,env(safe-area-inset-left,0px)) 60px}' +
      '.dx .vtop{display:flex;gap:14px;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;margin-bottom:18px}.dx h1{font-size:28px}.dx h2{font-size:21px;margin:0 0 8px}.dx .sub{color:var(--muted)}' +
      '.dx .dxb{background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:20px 22px;margin-top:14px;box-shadow:var(--sh1)}' +
      '.dx .steps{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0 4px}.dx .steps span{font-size:13px;font-weight:700;padding:5px 11px;border-radius:999px;background:var(--surface2);border:1px solid var(--line);color:var(--muted)}.dx .steps span.on{background:var(--navy);color:var(--navy-ink);border-color:var(--navy)}.dx .steps span.ok{background:#E3F2EA;color:#0F6B4F;border-color:#BFE3D0}' +
      '.dx ul.pt{margin:10px 0 0;padding-left:20px}.dx ul.pt li{margin:6px 0}.dx .case{margin-top:14px;background:#FFF6F0;border:1px solid #F1D2C2;border-radius:12px;padding:12px 14px;font-size:15px}.dx .case b{color:var(--rust)}' +
      '.dx .nav{display:flex;justify-content:space-between;gap:10px;margin-top:18px;flex-wrap:wrap}.dx .btn{min-height:48px;padding:0 20px;border-radius:12px;font-weight:700;font-size:16px;border:1.5px solid var(--line2);background:var(--surface)}.dx .btn-p{background:var(--navy);color:var(--navy-ink);border-color:var(--navy)}.dx .btn-g{background:var(--gold2);border-color:var(--gold2);color:var(--gold-ink)}.dx .btn[disabled]{opacity:.45}' +
      '.dx .q{margin-top:16px}.dx .q p{font-weight:700}.dx .q label{display:flex;gap:10px;align-items:flex-start;margin-top:8px;padding:10px 12px;border:1.5px solid var(--line);border-radius:12px;background:var(--surface);cursor:pointer}.dx .q label.ok{border-color:#0F6B4F;background:#E3F2EA}.dx .q label.no{border-color:var(--rust);background:#FFF0EC}.dx .q input{margin-top:5px}' +
      '.dx .field{display:block;margin-top:12px;font-weight:700;font-size:14px}.dx .field input,.dx textarea{display:block;width:100%;margin-top:6px;min-height:48px;font-size:17px;padding:10px 12px;border:1.5px solid var(--line2);border-radius:10px;font-family:inherit;background:var(--surface);color:var(--ink)}.dx textarea{min-height:110px}' +
      '.dx .pledge{max-height:46vh;overflow:auto;border:1px solid var(--line);border-radius:12px;padding:12px 16px;background:var(--surface2);font-size:15px}.dx .pledge ol{padding-left:22px;margin:6px 0}.dx .pledge li{margin:5px 0}' +
      '.dx canvas.sig{display:block;width:100%;height:170px;border:1.5px dashed var(--line2);border-radius:12px;background:#fff;touch-action:none;margin-top:6px}' +
      '.dx .err{color:var(--rust);font-weight:700;min-height:1.4em;margin-top:8px}.dx .ck{display:flex;gap:10px;align-items:flex-start;margin-top:12px;font-weight:600}.dx .ck input{width:22px;height:22px;margin-top:2px}' +
      '.dx table{width:100%;border-collapse:collapse;font-size:14.5px}.dx th,.dx td{border-bottom:1px solid var(--line);padding:9px 8px;text-align:left;vertical-align:top}.dx th{background:var(--surface2);font-size:13px;color:var(--muted)}.dx td.n{text-align:right;font-variant-numeric:tabular-nums}' +
      '.dx .qi{border:1px solid var(--line);border-radius:14px;padding:14px 16px;margin-top:12px;background:var(--surface)}.dx .qi.new{border-color:var(--gold2);box-shadow:0 0 0 3px var(--gold-soft)}.dx .qh{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;font-size:14px;color:var(--muted)}.dx .qq{font-size:17px;margin:8px 0;white-space:pre-wrap}.dx .qa{background:var(--surface2);border-radius:10px;padding:10px 12px;white-space:pre-wrap;font-size:15px}.dx .row{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.dx .pill{font-size:12px;font-weight:800;padding:2px 9px;border-radius:999px;background:var(--gold-soft);color:var(--gold-ink)}.dx .pill.done{background:#E3F2EA;color:#0F6B4F}' +
      '.dx .demo{margin-top:12px;background:#FFF6DB;border:1.5px solid #E8B547;border-radius:14px;padding:12px 14px;display:flex;gap:10px;align-items:center;flex-wrap:wrap}.dx .demo b{background:#141B2D;color:#F6E7C1;border-radius:8px;padding:2px 8px;font-size:13px}.dx .alt{margin-top:12px;border:1px dashed var(--line2);border-radius:12px;padding:10px 12px}.dx .alt .btn[disabled]{opacity:.5}' +
      '.dx .cert{margin-top:14px;overflow:auto}.dx .note{font-size:14px;color:var(--muted);margin-top:10px}';
    document.head.appendChild(s);
  }

  /* ================= 개인정보 보안교육 ================= */
  var L = [
    { t: '왜 지금 중요한가', p: ['분양 현장은 방문카드 · 관심고객 명단 · 광고 문자로 개인정보를 가장 많이 다루는 곳입니다.', '개정 정보통신망법으로 불법스팸 전송자에게 관련 매출액의 <b>6% 이하</b> 과징금과 부당이익 몰수 · 추징이 생겼습니다 (방송미디어통신위원회 2026.3.24 발표 · 공포 6개월 뒤 시행). 개인정보 보호법 위반은 전체 매출액의 <b>3% 이하</b> 과징금입니다 (개인정보 보호법 제64조의2).', '프리랜서 상담사가 직접 고객에게 동의를 받고 직접 연락하면, <b>상담사 본인이 개인정보처리자이자 광고 전송자</b>입니다. 책임도 본인에게 있습니다.', '이 교육은 상담 데스크를 쓰기 전에 한 번, 이후 <b>분기(90일)마다</b> 다시 듣습니다.'], c: ['방문카드 명단 전체에 홍보 문자', '견본주택 방문카드에 연락처만 적은 고객 모두에게 분양 홍보 문자를 보냄 → 고객이 “광고에 동의한 적 없다”며 118에 신고 → 동의 증빙을 내지 못해 제재.'] },
    { t: '받을 때 · 필요한 것만, 알리고 받기', p: ['상담에 필요한 것(성함 · 연락처 · 관심 호실)만 받습니다. 주민등록번호 · 소득 · 재산 서류는 상담 단계에서 받지 않습니다.', '요청받은 상담에 답하는 범위는 <b>수집 안내</b>로 알리고, 광고 수신은 <b>따로 선택 동의</b>를 받습니다. 매체(문자 · 카톡 · 전화)마다, 밤 9시~아침 8시 수신은 또 따로.', '언제 · 어디서 · 어떤 문구로 동의했는지 <b>기록이 남아야</b> 합니다. 상담 데스크의 고객 등록 화면이 자동으로 남깁니다.', '광고 동의를 하지 않아도 상담은 똑같이 해 드립니다. 동의를 조건으로 걸지 않습니다.'], c: ['동의서 한 장에 전부 필수', '“상담 · 광고 · 제3자 제공에 모두 동의” 한 줄에 체크해야만 상담을 받게 함 → 선택 동의를 강요한 것으로 봄.'] },
    { t: '보관할 때 · 내 기기 · 내 계정 안에서만', p: ['태블릿 · 휴대폰에 화면 잠금을 켜고, 상담 데스크 암호는 다른 사람과 같이 쓰지 않습니다.', '고객카드 · 명단을 <b>사진으로 찍거나</b>, 카톡 단체방 · 개인 클라우드 · 개인 메일로 보내지 않습니다.', '상담이 끝나면 <b>‘다음 고객 맞이하기’</b>로 태블릿에서 앞 고객의 이름 · 연락처 · 후보 호실을 지웁니다.', '종이 고객카드는 잠금장치가 있는 곳에 보관하고, 파일은 비밀번호를 겁니다.'], c: ['단톡방에 고객카드 사진', '팀 단톡방에 “오늘 방문 고객”이라며 고객카드 사진을 올림 → 방에 있던 다른 현장 상담사에게까지 정보가 넘어가 유출로 신고.'] },
    { t: '광고 문자 · 카톡 · 다섯 가지 표기와 시간', p: ['광고는 <b>광고 수신에 동의한 고객</b>에게, <b>동의한 매체</b>로만 보냅니다.', '문구 맨 앞 <b>(광고)</b>, 보내는 사람 이름 · 연락처, <b>무료</b> 수신거부 방법(080 번호나 링크). “회신으로 거부”는 문자 요금이 들어 무료가 아닙니다.', '밤 9시~아침 8시 사이에 <b>도착</b>하는 광고는 야간 수신에 따로 동의한 고객에게만. 20시 50분에 보냈는데 21시 넘어 도착해도 위반입니다.', '중도금 · 계약 안내 문자에 홍보 한 줄을 붙이면 <b>문자 전체가 광고</b>가 됩니다.', '수신거부는 바로 반영하고 <b>처리 결과를 14일 안에</b> 알리며, 광고 수신 동의는 <b>2년마다</b> 고객에게 확인합니다. 대량 발송은 전송자격인증을 받은 문자 서비스만 씁니다.'], c: ['안내 문자에 홍보 한 줄', '계약자에게 보낸 중도금 납부 안내 끝에 「잔여세대 선착순 분양 중」을 덧붙임 → 문자 전체가 광고성 정보 → (광고) 표기 · 동의 없이 보낸 광고로 신고.'] },
    { t: '넘기지 않기 · 다른 현장 · 다른 사람', p: ['다른 현장의 DB, 출처를 모르는 명단, 남에게 받은 명단으로 광고하지 않습니다.', '내가 받은 고객 정보를 팀장 · 다른 상담사 · 대행사에 넘기려면 <b>고객의 제3자 제공 동의가 먼저</b>입니다. 상담 데스크의 팀장 · 본부장 화면에는 고객 이름 · 연락처 없이 숫자만 올라갑니다.', '본인 명의로 받은 동의에는 전송자를 본인으로 적고, 회사 · 시행사 · 시공사로 바꿔 표시하지 않습니다.'], c: ['지난 현장 명단 재활용', '이전 현장에서 모은 관심고객 명단으로 새 현장 홍보 문자를 보냄 → 목적 외 이용 · 동의 없는 광고 두 가지로 제재.'] },
    { t: '고객의 요청과 파기', p: ['고객이 열람 · 정정 · 삭제 · 처리정지를 요청하거나 민원을 내면 <b>지체 없이</b> 처리합니다. 고객 명부에서 지우고 처리했다고 알려 드립니다.', '보유 기간이 지나거나 현장이 끝나면 파기합니다. 종이는 파쇄, 파일은 복구할 수 없게 삭제. 법으로 보관해야 하는 계약 서류는 예외입니다.', '업무가 끝나도 비밀 유지 의무는 계속됩니다.'], c: ['현장 종료 후 미파기', '현장이 끝난 뒤에도 고객 명단 엑셀을 개인 노트북에 보관하다 노트북 분실 → 유출 신고와 함께 파기 의무 위반까지.'] },
    { t: '사고가 나면 · 72시간', p: ['분실 · 도난뿐 아니라 <b>오발송 · 공개 게시 · 공유 설정 실수</b>도 유출입니다.', '알게 된 즉시 운영사(디어 에듀테크)와 관계자에게 알리고, <b>혼자 지우거나 숨기지 않습니다</b>.', '유출이 확인되면 <b>72시간 안에</b> 해당 고객에게 알리고, 1천 명 이상이거나 해킹 등 외부 공격이면 개인정보보호위원회(국번 없이 118)에 신고합니다.', '태블릿을 잃어버리면: ① 운영사에 알림 ② 상담 데스크 비밀번호 변경 ③ 구글 계정 비밀번호 변경 ④ ‘내 기기 찾기’로 원격 잠금 · 초기화.'], c: ['명단 오발송', '고객 한 명에게 보낼 사양서 대신 관심고객 명단 파일을 잘못 보냄 → 바로 알리지 않고 지웠다가 나중에 드러나 더 큰 제재.'] }
  ];
  var QZ = [
    ['견본주택 방문카드에 연락처만 적은 고객 전체에게 분양 홍보 문자를 보내도 되나요?', ['방문했으니 보내도 된다', '광고 수신에 동의한 고객에게만 보낸다', '밤에만 피하면 된다'], 1],
    ['광고 문자 맨 앞에 꼭 넣어야 하는 표시는?', ['[안내]', '(광고)', '[분양]'], 1],
    ['밤 9시~아침 8시 사이에 도착하는 광고는?', ['보내는 시각이 20시 59분이면 괜찮다', '야간 수신에 따로 동의한 고객에게만', '카톡이면 괜찮다'], 1],
    ['수신거부 안내로 “회신으로 거부”만 적으면?', ['무료가 아니어서 부족하다 · 080 번호나 무료 링크를 쓴다', '충분하다', '전화번호만 적으면 된다'], 0],
    ['중도금 안내 문자 끝에 「잔여세대 선착순」 한 줄을 붙이면?', ['안내 문자라 괜찮다', '문자 전체가 광고가 된다', '홍보 문구만 광고다'], 1],
    ['지난 현장에서 모은 고객 명단으로 새 현장을 홍보해도 되나요?', ['같은 회사면 된다', '고객이 기억하면 된다', '안 된다 (목적 외 이용 · 동의 없는 광고)'], 2],
    ['수신거부를 받으면 처리 결과는 언제까지 알려야 하나요?', ['14일 안에', '1년 안에', '알릴 필요 없다'], 0],
    ['광고 수신 동의는 얼마마다 고객에게 확인하나요?', ['5년마다', '2년마다', '한 번 받으면 끝'], 1],
    ['고객카드를 사진 찍어 팀 단톡방에 올려도 되나요?', ['팀원끼리는 된다', '안 된다', '흐리게 찍으면 된다'], 1],
    ['고객 정보를 실수로 잘못 보냈다면 가장 먼저?', ['조용히 지운다', '바로 운영사에 알리고, 유출이면 72시간 안에 고객에게 알린다', '다음 날 생각한다'], 1]
  ];
  var PLEDGE = [
    '업무로 알게 된 고객정보는 그 상담 목적으로만 쓰고, 다른 현장 · 개인 영업에 쓰거나 다른 사람에게 주지 않겠습니다.',
    '고객정보를 사진 촬영하거나, 정해진 방식 밖의 메신저 · 클라우드 · 개인 메일로 보내지 않겠습니다.',
    '출처가 불분명하거나 동의 없이 모은 DB, 다른 현장의 DB를 사거나 쓰지 않겠습니다.',
    '광고는 수신 동의한 고객에게만, (광고) 표기 · 전송자 이름과 연락처 · 무료 수신거부 방법을 넣고, 밤 9시~아침 8시 도착 제한과 수신거부 즉시 처리를 지키겠습니다.',
    '수신거부 방해, 번호 자동 생성 · 수집, 발신번호 바꾸기, 전화벨을 짧게 울려 회신을 유도하는 행위를 하지 않겠습니다.',
    '대량 문자는 전송자격인증을 받은 서비스로만 보내겠습니다.',
    '서류는 잠금장치가 있는 곳에, 파일은 비밀번호를 걸어 보관하고, 상담 데스크 암호를 다른 사람과 같이 쓰지 않겠습니다.',
    '고객의 열람 · 정정 · 삭제 · 처리정지 요청과 민원은 지체 없이 처리하겠습니다.',
    '분실 · 유출(오발송 · 공개 게시 포함)이나 그 우려를 알게 되면 즉시 운영사에 알리고, 혼자 기록을 지우지 않겠습니다.',
    '처음 사용 전과 분기마다 교육을 받겠습니다.',
    '목적을 이루거나 현장이 끝나면 고객정보를 파기하고(서류는 파쇄, 파일은 복구 불가능하게 삭제), 이 의무는 업무가 끝난 뒤에도 지키겠습니다.',
    '[각자 전송자] 광고는 본인 명의로 받은 동의에 따라 보내고 전송자를 본인으로 표기하며, 동의 근거 · 발송 기록 · 14일 통지 · 2년 확인 기록을 보관하겠습니다.',
    '[각자 전송자] 본인이 받은 연락처를 다른 사람에게 넘기려면 고객의 제3자 제공 동의를 먼저 받겠습니다.'
  ];
  var E = { i: 0, read: {}, ans: {}, quizOk: false, score: 0 };
  function isDemo() { try { return localStorage.getItem('sig-S01-demo') === '1'; } catch (e) { return false; } }
  function demoBar() { return isDemo() ? '<div class="demo"><b>시연판</b> 확인 문제는 정답 처리하고 바로 볼 수 있습니다. 서명 · 이수 기록은 저장하지 않습니다. <button class="btn btn-g" data-dx="demo">시연: 정답 처리하고 바로 보기</button></div>' : ''; }
  function demoPass(root) {
    var at = Date.now(); lset('sig-S01-edu', { person: '시연', tel: '', at: at, untilT: at + VALID_DAYS * 864e5, ver: EDU_VER, score: QZ.length, of: QZ.length, sig: '', cert: '시연판', sent: true, demo: true });
    location.href = './';
  }
  function rec() { return lget('sig-S01-edu'); }
  function trained() { var r = rec(); return !!(r && r.ver === EDU_VER && Date.now() < r.untilT); }
  function steps(cur) {
    var n = ['교육 ' + L.length + '강', '확인 문제', '서약서', '이수증'];
    return '<div class="steps">' + n.map(function (x, i) { return '<span class="' + (i === cur ? 'on' : (i < cur ? 'ok' : '')) + '">' + (i < cur ? '✓ ' : (i + 1) + '. ') + x + '</span>'; }).join('') + '</div>';
  }
  function eduHead(cur, why) {
    var r = rec();
    var msg = why === 'first' ? (r && r.ver === EDU_VER ? '이수 기한(' + day(r.untilT) + ')이 지났습니다. 분기 교육을 다시 들어 주세요.' : '상담 자료는 개인정보 보안교육을 마쳐야 열립니다. 약 10분 걸립니다.') : '';
    return '<header class="vtop"><div><p class="eyebrow">디어 에듀테크 · 상담 데스크 입구</p><h1>개인정보 보안교육</h1><p class="sub">' + (msg || '분양 상담사를 위한 개인정보 보호 · 불법스팸 방지 교육 (교육 ' + EDU_VER + ' · 분기마다 갱신)') + '</p>' + steps(cur) + '</div>' + (trained() ? '<a class="btn" href="./">상담 데스크로</a>' : '<button class="btn" data-act="lock">잠그기</button>') + '</header>';
  }
  function edu(root, why) {
    css(); E.why = why || E.why;
    var s = '<div class="dx">' + eduHead(0, E.why) + demoBar();
    var x = L[E.i]; E.read[E.i] = 1;
    s += '<section class="dxb"><p class="eyebrow">' + (E.i + 1) + ' / ' + L.length + '강</p><h2>' + x.t + '</h2><ul class="pt">' + x.p.map(function (y) { return '<li>' + y + '</li>'; }).join('') + '</ul><div class="case"><b>실제로 이런 일이 · ' + x.c[0] + '</b><br>' + x.c[1] + '</div>' +
      '<div class="nav"><button class="btn" data-dx="prev"' + (E.i ? '' : ' disabled') + '>← 이전</button>' + (E.i < L.length - 1 ? '<button class="btn btn-p" data-dx="next">다음 강 →</button>' : '<button class="btn btn-g" data-dx="quiz">확인 문제 풀기 →</button>') + '</div></section>';
    if (rec()) s += '<p class="note">지난 이수: ' + esc(rec().person) + ' · ' + day(rec().at) + ' · ' + (trained() ? day(rec().untilT) + '까지 유효 <a href="#" data-dx="cert">이수증 다시 보기</a>' : '기한 지남') + '</p>';
    root.innerHTML = s + '</div>'; window.scrollTo(0, 0);
    bind(root);
  }
  function quiz(root) {
    var s = '<div class="dx">' + eduHead(1) + demoBar() + (isDemo() ? '<div class="nav" style="margin-top:10px"><span></span><button class="btn" data-dx="autofill">시연: 정답 자동 입력</button></div>' : '') + '<section class="dxb"><h2>확인 문제 ' + QZ.length + '개</h2><p class="sub">' + PASS + '개 이상 맞히면 서약서로 넘어갑니다. 틀린 문제는 해설을 보고 다시 고를 수 있습니다.</p>';
    QZ.forEach(function (q, i) {
      s += '<div class="q"><p>' + (i + 1) + '. ' + q[0] + '</p>' + q[1].map(function (o, j) { var a = E.ans[i]; var cls = a == null ? '' : (a === j ? (j === q[2] ? 'ok' : 'no') : ''); return '<label class="' + cls + '"><input type="radio" name="q' + i + '" value="' + j + '"' + (a === j ? ' checked' : '') + '><span>' + o + '</span></label>'; }).join('') + '</div>';
    });
    s += '<p class="err" id="qerr"></p><div class="nav"><button class="btn" data-dx="back">← 교육 다시 보기</button><button class="btn btn-g" data-dx="grade">채점하기</button></div></section></div>';
    root.innerHTML = s; window.scrollTo(0, 0);
    $$('input[type=radio]', root).forEach(function (r) { r.onchange = function () { E.ans[Number(r.name.slice(1))] = Number(r.value); $$('label', r.closest('.q')).forEach(function (l) { l.className = ''; }); }; });
    bind(root);
  }
  function grade(root) {
    var n = 0, miss = 0; QZ.forEach(function (q, i) { if (E.ans[i] == null) miss++; else if (E.ans[i] === q[2]) n++; });
    if (miss) { $('#qerr', root).textContent = '아직 고르지 않은 문제가 ' + miss + '개 있습니다'; return; }
    E.score = n;
    $$('.q', root).forEach(function (el, i) { var a = E.ans[i]; $$('label', el).forEach(function (l, j) { l.className = a === j ? (j === QZ[i][2] ? 'ok' : 'no') : (j === QZ[i][2] && a !== QZ[i][2] ? 'ok' : ''); }); });
    if (n >= PASS) { E.quizOk = true; $('#qerr', root).innerHTML = '<span style="color:#0F6B4F">' + QZ.length + '문제 중 ' + n + '개 맞혔습니다. 서약서로 넘어갑니다…</span>'; setTimeout(function () { pledge(root); }, 900); }
    else $('#qerr', root).textContent = QZ.length + '문제 중 ' + n + '개 맞혔습니다. 초록색이 정답입니다. 틀린 문제를 다시 골라 채점해 주세요 (' + PASS + '개 이상).';
  }
  function pledge(root) {
    if (!E.quizOk) return quiz(root);
    var r = rec() || {};
    var s = '<div class="dx">' + eduHead(2) + '<section class="dxb"><h2>개인정보 보호 및 불법스팸 방지 서약서</h2><p class="sub">한국부동산마케팅협회 표준 서약서(STF-06)의 공통 서약과 ‘각자 전송자형’ 서약을 상담 데스크에 맞게 줄인 것입니다.</p>' +
      '<div class="pledge"><p>본인은 「개인정보 보호법」과 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」을 지키며 다음 사항을 서약합니다.</p><ol>' + PLEDGE.map(function (p) { return '<li>' + p + '</li>'; }).join('') + '</ol></div>' +
      '<label class="field">성명<input id="pnm" autocomplete="name" value="' + esc(r.person || '') + '"></label><label class="field">휴대폰<input id="ptl" type="tel" inputmode="tel" placeholder="010-0000-0000" value="' + esc(r.tel || '') + '"></label>' +
      '<label class="ck"><input type="checkbox" id="pck"><span>위 서약 내용을 모두 읽었고, 지키겠습니다.</span></label>' +
      '<p class="field" style="margin-bottom:0">확인 서명 <span class="sub" style="font-weight:500">(손가락이나 펜으로 · 서약 내용을 읽고 확인했다는 표시이며, 공인 · 간편인증 전자서명이 아닙니다)</span> <button class="btn" style="min-height:34px;padding:0 12px;font-size:14px;float:right" data-dx="clr">지우기</button></p><canvas class="sig" id="psig"></canvas>' +
      '<div class="alt"><p><b>간편인증 서명</b> <span class="pill">준비 중 · 지금은 쓸 수 없음</span></p><div class="row"><button class="btn" disabled>카카오 인증서로 서명</button><button class="btn" disabled>PASS 인증으로 서명</button><button class="btn" disabled>네이버 인증서로 서명</button></div><p class="note" style="margin-top:6px">실명 확인이 함께 되는 간편인증 서명은 정식 배포 때 전자서명 대행 서비스와 연결해 제공합니다. 지금은 위 확인 서명으로 서약합니다.</p></div>' +
      '<p class="err" id="perr"></p><div class="nav"><button class="btn" data-dx="quiz">← 확인 문제</button><button class="btn btn-g" data-dx="sign">서약하고 이수 완료</button></div></section></div>';
    root.innerHTML = s; window.scrollTo(0, 0);
    sigPad($('#psig', root)); bind(root);
  }
  function sigPad(cv) {
    var r = window.devicePixelRatio || 1, ctx, drawing = false, n = 0;
    function size() { var b = cv.getBoundingClientRect(); cv.width = b.width * r; cv.height = b.height * r; ctx = cv.getContext('2d'); ctx.setTransform(r, 0, 0, r, 0, 0); ctx.lineWidth = 2.6; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#0F1729'; }
    size();
    function pt(e) { var b = cv.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; }
    cv.addEventListener('pointerdown', function (e) { drawing = true; cv.setPointerCapture(e.pointerId); var p = pt(e); ctx.beginPath(); ctx.moveTo(p[0], p[1]); e.preventDefault(); });
    cv.addEventListener('pointermove', function (e) { if (!drawing) return; var p = pt(e); ctx.lineTo(p[0], p[1]); ctx.stroke(); n++; e.preventDefault(); });
    cv.addEventListener('pointerup', function () { drawing = false; });
    cv.addEventListener('pointercancel', function () { drawing = false; });
    cv.sigCount = function () { return n; }; cv.clear = function () { ctx.clearRect(0, 0, cv.width, cv.height); n = 0; };
  }
  function sigData(cv) {   // 작게 줄여 보관 (서버 · 이수증용)
    var w = 360, h = Math.round(cv.height / cv.width * w), c = document.createElement('canvas'); c.width = w; c.height = h;
    var x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, w, h); x.drawImage(cv, 0, 0, w, h); return c.toDataURL('image/png');
  }
  function sign(root) {
    var nm = $('#pnm', root).value.trim(), tl = $('#ptl', root).value.trim(), er = $('#perr', root), cv = $('#psig', root);
    if (!nm) return (er.textContent = '성명을 적어 주세요');
    if (!/^01[016789]-?\d{3,4}-?\d{4}$/.test(tl.replace(/\s/g, ''))) return (er.textContent = '휴대폰 번호를 확인해 주세요');
    if (!$('#pck', root).checked) return (er.textContent = '서약 내용 확인에 체크해 주세요');
    if (cv.sigCount() < 8) return (er.textContent = '서명을 해 주세요');
    var at = Date.now(), r = { person: nm, tel: tl, at: at, untilT: at + VALID_DAYS * 864e5, ver: EDU_VER, score: E.score, of: QZ.length, sig: sigData(cv), cert: 'L' + new Date(at).toISOString().slice(2, 10).replace(/-/g, '') + '-' + Math.random().toString(36).slice(2, 7).toUpperCase(), sent: false };
    lset('sig-S01-edu', r);
    var b = $('[data-dx=sign]', root); b.disabled = true; b.textContent = '기록하는 중…';
    sendEdu().then(function () { cert(root, true); });
  }
  function sendEdu() {
    var r = rec(); if (!r || r.sent || !hasApi()) return Promise.resolve();
    return api('train', { person: r.person, tel: r.tel, score: r.score, ver: r.ver, sig: r.sig }).then(function (j) { r.sent = true; r.cert = j.cert || r.cert; lset('sig-S01-edu', r); }).catch(function () {});
  }
  function certHTML(r) {
    return '<div style="width:794px;height:1123px;box-sizing:border-box;padding:70px 76px;background:#fff;color:#141B2D;font-family:\'Noto Sans KR\',\'Apple SD Gothic Neo\',sans-serif;position:relative;border:14px solid #F3EEE3">' +
      '<div style="border:2px solid #C9A961;height:100%;box-sizing:border-box;padding:60px 56px;text-align:center">' +
      '<p style="letter-spacing:.3em;color:#8A5A00;font-weight:800;font-size:15px;margin:0">CERTIFICATE OF COMPLETION</p>' +
      '<h1 style="font-family:\'Noto Serif KR\',serif;font-size:40px;margin:22px 0 6px">교육 이수증</h1>' +
      '<p style="font-size:17px;color:#5A6170;margin:0">개인정보 보호 · 불법스팸 방지 교육</p>' +
      '<p style="font-size:15px;color:#5A6170;margin:40px 0 0">이수 번호 ' + esc(r.cert) + '</p>' +
      '<p style="font-family:\'Noto Serif KR\',serif;font-size:34px;margin:16px 0 4px">' + esc(r.person) + '</p><p style="margin:0;color:#5A6170">' + esc(r.tel) + '</p>' +
      '<p style="font-size:18px;line-height:1.9;margin:44px auto 0;max-width:520px;word-break:keep-all">위 사람은 분양 상담사 개인정보 보호 교육 ' + L.length + '강을 마치고 확인 문제 ' + (r.of || QZ.length) + '문제 중 ' + r.score + '문제를 맞혔으며, 개인정보 보호 및 불법스팸 방지 서약서를 제출하였기에 이 증서를 드립니다.</p>' +
      '<table style="margin:46px auto 0;font-size:16px;border-collapse:collapse"><tr><td style="padding:6px 18px;color:#5A6170">이수일</td><td style="padding:6px 18px;font-weight:700">' + day(r.at) + '</td></tr><tr><td style="padding:6px 18px;color:#5A6170">유효 기한</td><td style="padding:6px 18px;font-weight:700">' + day(r.untilT) + ' (분기 갱신)</td></tr><tr><td style="padding:6px 18px;color:#5A6170">교육 버전</td><td style="padding:6px 18px;font-weight:700">' + esc(r.ver) + '</td></tr></table>' +
      '<div style="margin:44px auto 0;display:flex;justify-content:center;gap:60px;align-items:flex-end"><div><img src="' + r.sig + '" style="width:180px;height:auto;display:block;margin:0 auto" alt="서명"><p style="border-top:1px solid #141B2D;margin:4px 0 0;padding-top:6px;font-size:14px;color:#5A6170">서약인 확인 서명</p></div>' +
      '<div><p style="font-family:\'Noto Serif KR\',serif;font-size:24px;font-weight:700;margin:0">디어 에듀테크</p><p style="border-top:1px solid #141B2D;margin:8px 0 0;padding-top:6px;font-size:14px;color:#5A6170">교육 주관</p></div></div>' +
      '</div></div>';
  }
  function cert(root, fresh) {
    var r = rec(); if (!r) return edu(root);
    var s = '<div class="dx">' + eduHead(3) + '<section class="dxb"><h2>' + (fresh ? '이수를 마쳤습니다' : '교육 이수증') + '</h2><p class="sub">' + esc(r.person) + ' · ' + day(r.untilT) + '까지 유효합니다. 기한이 지나면 상담 데스크가 다시 교육 화면으로 열립니다.' + (hasApi() ? (r.sent ? ' 이수 기록이 운영사에 저장되었습니다.' : ' 인터넷 연결 뒤 이수 기록이 운영사로 보내집니다.') : '') + '</p>' +
      '<div class="nav" style="margin-top:12px"><a class="btn btn-p" href="./">상담 데스크 열기 →</a><button class="btn" data-dx="pdf">이수증 PDF 저장</button><button class="btn" data-dx="redo">교육 다시 듣기</button></div>' +
      '<div class="cert"><div id="certbox" style="zoom:.62;transform-origin:0 0">' + certHTML(r) + '</div></div></section></div>';
    root.innerHTML = s; window.scrollTo(0, 0);
    var fit = function () { var w = Math.min(innerWidth, document.documentElement.clientWidth) - 80; var cb = $('#certbox'); if (cb) cb.style.zoom = Math.min(.8, Math.max(.32, w / 794)); };
    fit(); addEventListener('resize', fit);
    bind(root); sendEdu();
  }
  function bind(root) {
    root.onclick = function (e) {
      var b = e.target.closest('[data-dx]'); if (!b) return; e.preventDefault(); var a = b.dataset.dx;
      if (a === 'next') { E.i = Math.min(L.length - 1, E.i + 1); edu(root); }
      else if (a === 'prev') { E.i = Math.max(0, E.i - 1); edu(root); }
      else if (a === 'quiz') quiz(root);
      else if (a === 'back') { E.i = 0; edu(root); }
      else if (a === 'grade') grade(root);
      else if (a === 'clr') $('#psig', root).clear();
      else if (a === 'sign') sign(root);
      else if (a === 'cert') cert(root);
      else if (a === 'demo') demoPass(root);
      else if (a === 'autofill') { QZ.forEach(function (q, i) { E.ans[i] = q[2]; var r0 = root.querySelector('input[name=q' + i + '][value="' + q[2] + '"]'); if (r0) r0.checked = true; }); grade(root); }
      else if (a === 'redo') { E = { i: 0, read: {}, ans: {}, quizOk: false, score: 0 }; edu(root); }
      else if (a === 'pdf') { b.disabled = true; var t = b.textContent; b.textContent = '만드는 중…'; load('../assets/pdfsave.js').then(function () { return PDFSAVE.save([certHTML(rec())], '보안교육_이수증_' + rec().person + '.pdf'); }).then(function () { toast('PDF로 저장했습니다 · 다운로드 폴더'); }).catch(function () { toast('저장하지 못했습니다'); }).then(function () { b.disabled = false; b.textContent = t; }); }
    };
  }

  /* ================= 고객 질문함 ================= */
  function qa(root) {
    css();
    var s = '<div class="dx"><header class="vtop"><div><a class="back" href="./">← 상담 데스크</a><p class="eyebrow">고객 링크에서 들어온 질문</p><h1>고객 질문함</h1><p class="sub">고객이 링크 안의 ‘궁금한 점 물어보기’로 남긴 질문입니다. 질문이 오면 이메일로도 알려 드립니다. 답변을 적으면 고객에게 보낼 답변 링크가 만들어집니다.</p></div><button class="btn" data-q="reload">새로고침</button></header><div id="qlist"><p class="sub">불러오는 중…</p></div></div>';
    root.innerHTML = s; window.scrollTo(0, 0);
    if (!hasApi()) { $('#qlist').innerHTML = '<div class="dxb"><h2>웹앱 연결 전입니다</h2><p>지금은 고객이 질문을 남기면 <b>문자 앱이 열려 상담사 번호로</b> 질문이 바로 옵니다. 운영사가 웹앱을 연결하면 질문이 이곳과 이메일로 모이고, 답변 링크를 보낼 수 있습니다.</p></div>'; return; }
    api('qlist').then(function (j) {
      try { localStorage.setItem('sig-S01-qseen', String(j.list.length)); } catch (e) {}
      var h = j.book ? '<p class="note">고객 명부 · 접수 기록 · 질문함 원본: <a href="' + esc(j.book) + '" target="_blank" rel="noopener">내 구글 시트 열기 ↗</a></p>' : '';
      if (!j.list.length) h += '<div class="dxb"><p>아직 들어온 질문이 없습니다.</p></div>';
      j.list.forEach(function (q) {
        var tel = String(q.tel || ''), raw = tel.replace(/\D/g, ''), isNew = q.status === '새 질문';
        h += '<div class="qi' + (isNew ? ' new' : '') + '" data-id="' + esc(q.id) + '"><div class="qh"><span><b style="color:var(--ink)">' + esc(q.name || '이름 없음') + '</b> · ' + esc(tel) + ' · ' + esc(q.at) + '</span><span class="pill' + (isNew ? '' : ' done') + '">' + esc(q.status) + '</span></div>' +
          '<p class="qq">' + esc(q.q) + '</p>' + (q.page ? '<p class="note" style="margin-top:0">보던 화면: ' + esc(q.page) + '</p>' : '') +
          (q.a ? '<p class="qa"><b>보낸 답변 · ' + esc(q.aat) + '</b>\n' + esc(q.a) + '</p>' : '') +
          '<textarea placeholder="답변을 적어 주세요. 고객은 답변 링크에서 이 글을 봅니다.">' + esc(q.a || '') + '</textarea>' +
          '<div class="row"><button class="btn btn-g" data-q="send">답변 저장 · 보내기</button><a class="btn" style="text-decoration:none;display:inline-flex;align-items:center" href="tel:' + raw + '">전화하기</a><button class="btn" data-q="called">통화로 답변함</button></div><div class="snd"></div></div>';
      });
      $('#qlist').innerHTML = h;
    }).catch(function (e) { $('#qlist').innerHTML = '<div class="dxb"><p>질문을 불러오지 못했습니다 (' + esc(e.message) + '). 인터넷 연결을 확인하고 새로고침해 주세요.</p></div>'; });
    root.onclick = function (e) {
      var b = e.target.closest('[data-q]'); if (!b) return; var a = b.dataset.q, card = b.closest('.qi');
      if (a === 'reload') return qa(root);
      var id = card.dataset.id;
      if (a === 'called') { b.disabled = true; api('qdone', { id: id, status: '통화 완료' }).then(function () { toast('통화 완료로 표시했습니다'); qa(root); }).catch(function () { b.disabled = false; toast('저장하지 못했습니다'); }); }
      if (a === 'send') {
        var text = $('textarea', card).value.trim(); if (!text) return toast('답변을 적어 주세요');
        b.disabled = true; b.textContent = '저장하는 중…';
        api('answer', { id: id, text: text }).then(function (j) {
          b.textContent = '저장했습니다'; var raw = String(j.tel || '').replace(/\D/g, '');
          var msg = '[장준우] ' + (j.name || '고객') + '님, 남겨 주신 질문에 답변을 드렸습니다. 아래 링크에서 확인해 주세요.\n' + j.link;
          $('.snd', card).innerHTML = '<div class="dxb" style="margin-top:10px"><b>고객에게 답변 링크 보내기</b><p class="qa" style="margin-top:8px">' + esc(msg) + '</p><div class="row"><a class="btn btn-p" style="text-decoration:none;display:inline-flex;align-items:center" href="sms:' + raw + '?&body=' + encodeURIComponent(msg) + '">문자로 보내기</a><button class="btn" data-q2="kakao">카톡 · 다른 앱</button><button class="btn" data-q2="copy">복사</button></div><p class="note">고객이 요청한 질문의 답변이라 광고가 아닙니다. 홍보 문구를 덧붙이지 마세요.</p></div>';
          $('.snd', card).onclick = function (ev) { var c = ev.target.closest('[data-q2]'); if (!c) return; if (c.dataset.q2 === 'copy') D().copy(msg); else load('../assets/share.js').then(function () { SHARE.open({ title: '답변 링크 보내기', text: msg.replace(j.link, '').trim(), url: j.link }); }); };
        }).catch(function () { b.disabled = false; b.textContent = '답변 저장 · 보내기'; toast('저장하지 못했습니다 · 인터넷 연결 확인'); });
      }
    };
  }

  /* ================= 설정 · 비밀번호 ================= */
  function b64(u) { var s = ''; u = new Uint8Array(u); for (var i = 0; i < u.length; i++) s += String.fromCharCode(u[i]); return btoa(s); }
  function set(root) {
    css(); var r = rec();
    var s = '<div class="dx"><header class="vtop"><div><a class="back" href="./">← 상담 데스크</a><p class="eyebrow">이 태블릿</p><h1>설정</h1></div></header>' +
      '<section class="dxb"><h2>이 태블릿 PIN</h2><p class="sub">상담 데스크는 사람마다 다른 <b>접속 코드</b>로 처음 한 번 열고, 그다음부터는 이 태블릿에만 저장되는 <b>PIN 숫자 6자리</b>로 엽니다. PIN을 5번 틀리면 이 태블릿에서 지워지고 접속 코드를 다시 넣어야 합니다.</p>' +
      (D().hasPin() ? '<label class="field">지금 PIN<input id="pw0" type="password" inputmode="numeric" maxlength="6" autocomplete="off"></label>' : '<p class="note">이 태블릿에는 아직 PIN이 없습니다. 지금 정하면 다음부터 PIN으로 엽니다.</p>') +
      '<label class="field">새 PIN 숫자 6자리<input id="pw1" type="password" inputmode="numeric" maxlength="6" autocomplete="off"></label><label class="field">새 PIN 한 번 더<input id="pw2" type="password" inputmode="numeric" maxlength="6" autocomplete="off"></label><p class="err" id="pwerr"></p>' +
      '<div class="nav"><button class="btn" data-s="pinclear">이 태블릿에서 PIN 지우기</button><button class="btn btn-g" data-s="pin">' + (D().hasPin() ? 'PIN 바꾸기' : 'PIN 정하기') + '</button></div></section>' +
      '<section class="dxb"><h2>태블릿을 잃어버렸거나 반납할 때</h2><ul style="margin:8px 0 0;padding-left:20px;line-height:1.7"><li><b>잃어버렸을 때</b> 바로 운영사(디어 에듀테크)에 알려 주세요. 구독을 멈춰 그 태블릿의 상담 자료 · 고객 기록을 지우고(다음 인터넷 연결 때), 새 접속 코드를 드립니다.</li><li><b>반납 · 교체할 때</b> 위 \'PIN 지우기\'를 누르면 이 태블릿의 PIN과 진행 중이던 고객 기록이 함께 지워지고 잠깁니다. 접수된 고객 정보는 내 구글 시트에 남습니다.</li><li>접속 코드는 다른 사람에게 알려 주지 마세요. 사람마다 다르게 발급됩니다.</li></ul></section>' +
      '<section class="dxb"><h2>개인정보 보안교육</h2>' + (r ? '<p>' + esc(r.person) + ' · 이수 ' + day(r.at) + ' · ' + (trained() ? '<b>' + day(r.untilT) + '까지 유효</b>' : '<b style="color:var(--rust)">기한 지남</b>') + '</p>' : '<p>이수 기록이 없습니다.</p>') + '<div class="row"><a class="btn" style="text-decoration:none;display:inline-flex;align-items:center" href="?p=edu">이수증 보기 · 교육 다시 듣기</a></div></section>' +
      (isDemo() ? '<section class="dxb"><h2>시연판</h2><p>이 기기는 시연 모드입니다. 비밀번호 없이 열리고 교육 확인 문제는 정답 처리됩니다.</p><div class="row"><button class="btn" data-s="demooff">시연 모드 끄기 · 잠그기</button></div></section>' : '') +
      '<section class="dxb"><h2>연결 상태</h2><p id="ping" class="sub">' + (hasApi() ? '확인 중…' : '웹앱 연결 전 · 고객 등록은 구글 폼으로, 질문은 문자로 받습니다.') + '</p></section></div>';
    root.innerHTML = s; window.scrollTo(0, 0);
    if (hasApi()) fetch(cfg().api + '?op=ping').then(function (x) { return x.json(); }).then(function (j) { $('#ping').textContent = j.ok ? '웹앱 연결됨 · 고객 등록 · 질문 · 교육 기록이 내 구글 시트로 들어갑니다.' : '웹앱 응답 이상'; }).catch(function () { $('#ping').textContent = '웹앱에 연결하지 못했습니다 · 인터넷 연결을 확인해 주세요'; });
    root.onclick = function (e) {
      var b = e.target.closest('[data-s]'); if (!b) return;
      if (b.dataset.s === 'demooff') { try { localStorage.removeItem('sig-S01-demo'); localStorage.removeItem('sig-S01-edu'); localStorage.removeItem('sig-S01-staff-k'); sessionStorage.clear(); } catch (x) {} location.href = './'; return; }
      var er = $('#pwerr');
      if (b.dataset.s === 'pinclear') { try { ['sig-S01-lead', 'hosil', 'sig-S01-cust'].forEach(function (k) { localStorage.removeItem(k); }); } catch (x) {} D().clearPin(); D().lock(); return; }
      var p0 = $('#pw0') ? $('#pw0').value : '', p1 = $('#pw1').value, p2 = $('#pw2').value;
      if (!D().pinOk(p1)) return (er.textContent = '같은 숫자 반복 · 연속 숫자가 아닌 숫자 6자리로 정해 주세요');
      if (p1 !== p2) return (er.textContent = '새 PIN이 서로 다릅니다');
      b.disabled = true; er.textContent = '';
      (D().hasPin() ? D().checkPin(p0) : Promise.resolve(true)).then(function (ok) {
        if (!ok) throw new Error('old');
        return D().setPin(p1);
      }).then(function () { er.innerHTML = '<span style="color:#0F6B4F">PIN을 저장했습니다. 다음에 열 때부터 이 PIN을 씁니다.</span>'; ['pw0', 'pw1', 'pw2'].forEach(function (i) { if ($('#' + i)) $('#' + i).value = ''; }); })
        .catch(function (x) { er.textContent = x.message === 'old' ? '지금 PIN이 맞지 않습니다' : '저장하지 못했습니다'; })
        .then(function () { b.disabled = false; });
    };
  }

  /* ================= 운영자 통계 (숫자만) ================= */
  function stat(root) {
    css();
    root.innerHTML = '<div class="dx"><header class="vtop"><div><a class="back" href="./">← 상담 데스크</a><p class="eyebrow">운영자 전용 · 고객 이름 · 연락처는 나오지 않습니다</p><h1>구독자 현황</h1><p class="sub">상담사(프리랜서)의 고객 정보는 상담사 본인 것입니다. 운영사와 위 단계(팀장 · 본부장)에는 숫자만 보입니다.</p></div></header><div id="st"><p class="sub">불러오는 중…</p></div></div>';
    if (!hasApi()) { $('#st').innerHTML = '<div class="dxb"><p>웹앱 연결 뒤 볼 수 있습니다.</p></div>'; return; }
    Promise.all([api('stats'), api('trainlist')]).then(function (x) {
      var j = x[0], t = x[1], now = new Date().toISOString().slice(0, 10);
      var h = '<div class="dxb" style="overflow-x:auto"><h2>구독자별 숫자 · ' + esc(j.at) + '</h2><table><tr><th>구독자</th><th>팀 · 본부</th><th>고객</th><th>최근 7일</th><th>접수</th><th>광고 동의</th><th>수신거부</th><th>질문 (미답)</th><th>교육 유효</th></tr>' +
        j.list.map(function (o) { return '<tr><td><b>' + esc(o.sid) + '</b> ' + esc(o.name) + '</td><td>' + esc([o.team, o.hq].filter(Boolean).join(' · ') || '-') + '</td><td class="n">' + o.leads + '</td><td class="n">' + o.leads7 + '</td><td class="n">' + o.visits + '</td><td class="n">' + o.mkt + '</td><td class="n">' + o.optout + '</td><td class="n">' + o.asks + (o.open ? ' (<b style="color:var(--rust)">' + o.open + '</b>)' : '') + '</td><td>' + (o.trained ? (o.trained >= now ? o.trained : '<b style="color:var(--rust)">' + o.trained + ' 지남</b>') : '<b style="color:var(--rust)">미이수</b>') + '</td></tr>'; }).join('') + '</table></div>';
      h += '<div class="dxb" style="overflow-x:auto"><h2>교육 이수 기록</h2><table><tr><th>이수 번호</th><th>일시</th><th>구독자</th><th>이름</th><th>점수</th><th>유효 기한</th></tr>' + (t.list.map(function (r) { return '<tr><td>' + esc(r.cert) + '</td><td>' + esc(r.at) + '</td><td>' + esc(r.sid) + '</td><td>' + esc(r.person) + '</td><td class="n">' + esc(r.score) + '</td><td>' + esc(r.until) + '</td></tr>'; }).join('') || '<tr><td colspan="6">아직 기록이 없습니다</td></tr>') + '</table></div>';
      $('#st').innerHTML = h;
    }).catch(function (e) { $('#st').innerHTML = '<div class="dxb"><p>불러오지 못했습니다 (' + esc(e.message) + ')</p></div>'; });
  }

  /* ================= 근거 자료 (공식 출처 목록) ================= */
  function src(root) {
    css(); var G = window.REG || { S: {} }, I = window.SITEINFO || { src: {} };
    function row(x) { return '<tr><td>' + esc(x.t) + '</td><td>' + esc(x.o || '') + '</td><td>' + esc(x.d) + '</td><td>' + (x.u ? '<a href="' + esc(x.u) + '" target="_blank" rel="noopener">원문 ↗</a>' : '-') + '</td></tr>'; }
    root.innerHTML = '<div class="dx"><header class="vtop"><div><a class="back" href="./">← 상담 데스크</a><p class="eyebrow">신뢰가 생명 · 공식 자료만</p><h1>근거 자료</h1><p class="sub">상담 화면과 고객 화면의 규제 · 대출 · 세금 · 단지 정보가 기대고 있는 공식 자료입니다. 규제 · 대출 기준일 ' + esc(G.asof || '') + ' · 단지 자료 기준일 ' + esc(I.asof || '') + '. 매일 아침 국토교통부 · 금융위원회 등 공식 발표를 점검해 바뀌면 운영사에 바로 알림이 갑니다.</p></div></header>' +
      '<section class="dxb" style="overflow-x:auto"><h2>규제지역 · 대출 · 세금</h2><table><tr><th>내용</th><th>발표 기관</th><th>날짜</th><th>원문</th></tr>' + Object.keys(G.S || {}).map(function (k) { return row(G.S[k]); }).join('') + '</table></section>' +
      '<section class="dxb" style="overflow-x:auto"><h2>단지 기본 설명</h2><table><tr><th>내용</th><th>발표 기관</th><th>날짜</th><th>원문</th></tr>' + Object.keys(I.src || {}).map(function (k) { var x = I.src[k]; return row({ t: x.t, o: '', d: x.d, u: x.u }); }).join('') + '</table>' +
      '<p class="note">단지 사실은 입주자모집공고(2026.08.14)와 롯데건설 공식 홍보물을 따릅니다. 정부 계획(GTX-B 등)은 정부 발표 원문을 따르고 ‘예정 사항’으로 표시합니다. 원문으로 확인되지 않은 숫자는 화면에 넣지 않습니다.</p></section></div>';
    window.scrollTo(0, 0);
  }

  /* ================= 상담 데스크 첫 화면 꾸미기 ================= */
  function hubDecor() {
    var r = rec(), el = document.getElementById('eduStat');
    if (el && r) el.textContent = esc(r.person) + ' · ' + day(r.untilT) + '까지 유효';
    var q = document.getElementById('qaStat');
    if (q) {
      if (!hasApi()) q.textContent = '웹앱 연결 전 · 질문은 문자로 옵니다';
      else api('qlist').then(function (j) { var n = j.list.filter(function (x) { return x.status === '새 질문'; }).length; q.innerHTML = n ? '<b style="color:var(--rust)">새 질문 ' + n + '개</b>' : '새 질문 없음 · 전체 ' + j.list.length + '개'; }).catch(function () { q.textContent = '불러오지 못했습니다'; });
    }
    sendEdu();
  }

  window.DESKX = { src: src, isDemo: isDemo, trained: trained, edu: function (root, why) { css(); if (trained() && why !== 'first') return cert(root); E.why = why; edu(root, why); }, qa: qa, set: set, stat: stat, hubDecor: hubDecor, rec: rec, api: api, hasApi: hasApi, VER: EDU_VER };
})();
