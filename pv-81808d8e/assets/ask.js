/* 고객 화면의 ‘궁금한 점 물어보기’ 버튼 · 질문 → 담당 상담사에게 알림 → 답변 링크
   <script src="../assets/ask.js" data-bottom="88"></script> (sig.js 다음에) */
(function () {
  if (window.SIGASK || !window.SIG) return;
  var me = document.currentScript, bottom = Number((me && me.dataset.bottom) || 20);
  var S = window.SIG, esc = S.esc;
  function el(h) { var d = document.createElement('div'); d.innerHTML = h; return d.firstElementChild; }
  var css = document.createElement('style');
  css.textContent = '.ask-fab{position:fixed;right:max(14px,env(safe-area-inset-right,0px));bottom:calc(' + bottom + 'px + env(safe-area-inset-bottom,0px));z-index:40;display:flex;align-items:center;gap:7px;min-height:50px;padding:0 18px 0 14px;border-radius:999px;border:0;background:#141B2D;color:#F6E7C1;font:700 15px/1 "Noto Sans KR","Apple SD Gothic Neo",sans-serif;box-shadow:0 8px 24px rgba(20,27,45,.28);cursor:pointer}.ask-fab i{font-style:normal;font-size:19px}.ask-fab{transition:width .2s,padding .2s,opacity .2s}.ask-fab.mini{padding:0;width:50px;justify-content:center;opacity:.85}.ask-fab.mini span{display:none}' +
    '.ask-ov{position:fixed;inset:0;z-index:70;background:rgba(12,17,28,.72);display:flex;align-items:flex-end;justify-content:center;padding:12px}@media (min-width:640px){.ask-ov{align-items:center}}' +
    '.ask-in{background:#fff;color:#141B2D;border-radius:18px;width:min(560px,100%);max-height:calc(100dvh - 24px);overflow:auto;padding:20px 18px calc(18px + env(safe-area-inset-bottom,0px));font-family:"Noto Sans KR","Apple SD Gothic Neo",sans-serif}' +
    '.ask-in h2{margin:0;font-size:21px;font-family:"Noto Serif KR",serif}.ask-in .sb{margin:6px 0 0;color:#5A6170;font-size:14.5px;line-height:1.5}.ask-in textarea,.ask-in input[type=text],.ask-in input[type=tel]{display:block;width:100%;box-sizing:border-box;margin-top:6px;border:1.5px solid #D9D1C3;border-radius:10px;padding:10px 12px;font-size:16px;line-height:1.5;font-family:inherit}.ask-in textarea{min-height:110px}' +
    '.ask-in label.f{display:block;margin-top:12px;font-weight:700;font-size:14px}.ask-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}@media (max-width:420px){.ask-row{grid-template-columns:1fr}}' +
    '.ask-b{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.ask-b button,.ask-b a{flex:1 1 140px;min-height:50px;border-radius:12px;font-weight:700;font-size:16px;font-family:inherit;border:1.5px solid #D9D1C3;background:#fff;color:#141B2D;text-decoration:none;display:flex;align-items:center;justify-content:center;cursor:pointer}.ask-b .p{background:#141B2D;color:#F6E7C1;border-color:#141B2D}' +
    '.ask-err{color:#A4432F;font-weight:700;min-height:1.3em;margin:8px 0 0;font-size:14px}.ask-chips{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}.ask-chips button{border:1px solid #E3DCCF;background:#F7F4EE;border-radius:999px;padding:6px 11px;font-size:13.5px;font-family:inherit;cursor:pointer;color:#141B2D}' +
    '.ask-mine{margin-top:14px;border-top:1px solid #EEE8DC;padding-top:10px;font-size:14px}.ask-mine a{color:#8A5A00;font-weight:700}';
  document.head.appendChild(css);
  var CH = ['대출은 얼마나 나오나요?', '계약금은 얼마인가요?', '이 호실 계약 가능한가요?', '방문 상담 예약하고 싶어요', '옵션은 뭐가 좋아요?'];
  function page() { var t = document.title.split('·')[0].trim(); return t + (location.search.indexOf('view=sheet') >= 0 ? ' (사양서)' : ''); }
  function mine() {
    var a = S.asks(); if (!a.length) return '';
    return '<div class="ask-mine"><b>내가 남긴 질문</b><ul style="margin:6px 0 0;padding-left:18px">' + a.slice(0, 5).map(function (x) { return '<li><a href="' + S.base + 'answer/?a=' + encodeURIComponent(x.id) + '">' + esc(x.q) + '</a> · 답변 보기</li>'; }).join('') + '</ul></div>';
  }
  function open(pre) {
    var L = S.lead() || {};
    var o = el('<div class="ask-ov" role="dialog" aria-modal="true" aria-label="궁금한 점 물어보기"><form class="ask-in" novalidate>' +
      '<h2>궁금한 점 물어보기</h2><p class="sb">적어 주시면 ' + esc(S.who) + '에게 바로 전달됩니다. 답변은 문자나 카카오톡으로 링크를 보내 드리거나 전화로 알려 드립니다.</p>' +
      '<div class="ask-chips">' + CH.map(function (c) { return '<button type="button" data-c="' + esc(c) + '">' + esc(c) + '</button>'; }).join('') + '</div>' +
      '<label class="f" for="askq">질문</label><textarea id="askq" maxlength="1500" placeholder="예) 84F 19층 잔금 때 내 돈이 얼마나 필요한가요?">' + esc(pre || '') + '</textarea>' +
      '<div class="ask-row"><label class="f">성함<input type="text" id="asknm" autocomplete="name" value="' + esc(L.name || '') + '"></label><label class="f">연락처<input type="tel" id="asktl" inputmode="tel" autocomplete="tel" placeholder="010-0000-0000" value="' + esc(L.tel || '') + '"></label></div>' +
      '<input type="text" id="askhp" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true">' +
      S.consentHTML({ id: 'ak', purpose: '남기신 질문에 대한 답변과 상담 연락', items: '성함, 연락처, 질문 내용, 보던 화면', refuse: '이 경우 아래 전화 상담으로 물어보실 수 있습니다.', mkt: false }) +
      '<p class="ask-err" id="askerr" role="alert"></p>' +
      '<div class="ask-b"><button type="submit" class="p" id="askgo">질문 보내기</button><a href="tel:' + S.raw + '">전화로 묻기</a><button type="button" data-x>닫기</button></div>' + mine() + '</form></div>');
    document.body.appendChild(o);
    var f = o.querySelector('form'), er = o.querySelector('#askerr');
    function close() { o.remove(); }
    o.addEventListener('click', function (e) { if (e.target === o || e.target.closest('[data-x]')) close(); var c = e.target.closest('[data-c]'); if (c) { var q = o.querySelector('#askq'); q.value = (q.value ? q.value + '\n' : '') + c.dataset.c; q.focus(); } });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = o.querySelector('#askq').value.trim(), n = o.querySelector('#asknm').value.trim(), t = o.querySelector('#asktl').value.trim();
      if (o.querySelector('#askhp').value) return close();
      if (!q) return (er.textContent = '질문을 적어 주세요');
      if (!n) return (er.textContent = '성함을 적어 주세요');
      if (!S.validTel(t)) return (er.textContent = '연락처를 확인해 주세요 (예: 010-1234-5678)');
      if (!o.querySelector('#ak-ack').checked) return (er.textContent = '[필수] 개인정보 수집 · 이용에 동의하셔야 보낼 수 있습니다');
      er.textContent = ''; var b = o.querySelector('#askgo'); b.disabled = true; b.textContent = '보내는 중…';
      S.ask({ name: n, tel: S.fmtTel(t), q: q, page: page() }).then(function (r) {
        if (r.fallback) {
          f.innerHTML = '<h2>문자로 보내 주세요</h2><p class="sb">아래 버튼을 누르면 문자 앱에 질문이 적혀 열립니다. 보내기만 누르시면 ' + esc(S.who) + '에게 바로 갑니다.</p><div class="ask-b"><a class="p" href="' + r.sms + '">문자 앱 열기</a><a href="tel:' + S.raw + '">전화로 묻기</a><button type="button" data-x>닫기</button></div>';
          return;
        }
        if (!r.ok) { b.disabled = false; b.textContent = '질문 보내기'; er.textContent = r.why === 'wait' ? '방금 보내셨어요. 30초 뒤에 다시 보내 주세요' : '보내지 못했습니다. 전화로 물어봐 주세요'; return; }
        f.innerHTML = '<h2>질문을 보냈습니다</h2><p class="sb">' + esc(S.who) + '에게 전달했습니다. 답변이 준비되면 문자나 카카오톡으로 링크를 보내 드리거나 전화 드립니다.</p>' +
          '<div class="ask-b"><a class="p" href="' + S.base + 'answer/?a=' + encodeURIComponent(r.id) + '">내 질문 · 답변 보기</a><button type="button" data-x>닫기</button></div>';
      });
    });
    S.bindConsent(o, 'ak');
    setTimeout(function () { var x = o.querySelector('#askq'); if (x && !x.value) x.focus(); }, 60);
  }
  function mount() {
    if (document.querySelector('.ask-fab') || /[?&]embed=1/.test(location.search)) return;
    var b = el('<button class="ask-fab" type="button" aria-label="궁금한 점 물어보기"><i>💬</i><span>물어보기</span></button>');
    b.addEventListener('click', function () { open(); });
    document.body.appendChild(b);
    // 스크롤하는 동안은 작게 접어 글자를 가리지 않게
    var t = 0; addEventListener('scroll', function () { b.classList.add('mini'); clearTimeout(t); t = setTimeout(function () { b.classList.remove('mini'); }, 1400); }, { passive: true });
  }
  window.SIGASK = { open: open, mount: mount };
  if (!(me && me.dataset.manual)) { if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount); }
})();
