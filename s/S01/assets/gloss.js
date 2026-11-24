/* 용어 풀이 · 쉽게 보기 — 상담 화면 · 서랍(안내 1 · 2) · 결과지가 같이 씀
   모든 풀이의 근거는 입주자모집공고(2026.08.14) · 정부 발표 · 법령 원문만 씁니다. 바뀌면 여기 한 곳만 고칩니다. */
(function () {
  'use strict';
  var G = {
    '계약금': ['집을 사기로 약속하면서 처음 내는 돈입니다.', '분양가의 5%입니다. 계약하는 날 1,000만 원, 나머지는 30일 안에 냅니다.', '입주자모집공고'],
    '중도금': ['공사하는 동안 나눠서 내는 돈입니다.', '분양가의 60%를 6번에 나눠 냅니다. 중도금 대출로 낼 수 있고 이자는 입주 때 한 번에 냅니다(후불제).', '입주자모집공고'],
    '잔금': ['입주할 때 마지막으로 내는 돈입니다.', '분양가의 35%입니다. 잔금대출을 받으면 그만큼 내 돈이 줄어듭니다.', '입주자모집공고'],
    '중도금 대출': ['공사 기간에 내는 중도금을 은행이 대신 빌려주는 것입니다.', '이 단지는 이자 후불제라 입주 전까지 이자를 따로 내지 않고 입주 때 정산합니다.', '입주자모집공고'],
    '후불제': ['이자를 지금 내지 않고 나중에 한 번에 내는 방식입니다.', '중도금 대출 이자는 입주 때 한 번에 냅니다.', '입주자모집공고'],
    '잔금대출': ['입주할 때 집을 담보로 받는 대출입니다(주택담보대출).', '수도권 주택구입 대출은 집값 15억 원 이하 최대 6억, 15억 초과~25억 최대 4억, 25억 초과 최대 2억입니다. 소득에 따라 은행이 최종 확정합니다.', '금융위원회 2025.10.15 발표'],
    'DSR': ['한 해 소득 가운데 대출 원금과 이자로 갚는 돈의 비율입니다.', '같은 집이라도 소득에 따라 대출 한도가 달라지는 이유입니다. 정확한 한도는 은행에서 확인합니다.', '금융위원회'],
    '취득세': ['집을 살 때 한 번 내는 세금입니다.', '무주택 · 1주택은 84㎡ 기준 약 3.3%입니다. 이 집이 3번째 집이면 8%, 4번째 이상이면 12%가 기본 세율입니다. 잔금 때 주택 수로 정해집니다.', '지방세법'],
    '인지세': ['계약서에 붙이는 세금입니다.', '계약자 부담분 17만 5천 원을 전자수입인지로 냅니다.', '인지세법 · 입주자모집공고'],
    '발코니 확장': ['발코니를 방이나 거실처럼 넓혀 쓰도록 공사하는 것입니다.', '이 단지는 전 세대 발코니 확장을 무상으로 해 줍니다. 확장비 0원입니다.', '입주자모집공고'],
    '전용면적': ['우리 가족만 쓰는 집 안 면적입니다.', '84㎡ · 113㎡ · 121㎡가 이 숫자입니다. 발코니는 들어가지 않습니다.', '입주자모집공고'],
    '공급면적': ['전용면적에 계단 · 복도 같은 공용 부분을 더한 면적입니다.', '흔히 말하는 ‘평형’이 이 면적 기준입니다.', '입주자모집공고'],
    '계약면적': ['공급면적에 주차장 · 관리사무소 같은 공용 시설까지 더한 면적입니다.', '분양가 계산의 기준이 되는 가장 큰 면적입니다.', '입주자모집공고'],
    '실사용': ['실제로 생활하는 넓이입니다.', '전용면적에 무상 확장되는 발코니 면적을 더해 평으로 보여 드립니다.', '입주자모집공고 면적 기준 계산'],
    '판상형': ['방과 거실이 한 줄로 나란히 남쪽을 보는 구조입니다.', '맞바람이 잘 들고 가구 배치가 쉬운 편입니다.', '일반 용어'],
    '4Bay': ['앞쪽 창에 방 · 거실이 4칸 나란히 있는 구조입니다.', '앞쪽 창이 많아 집 안이 밝은 편입니다.', '일반 용어'],
    '알파룸': ['서재 · 놀이방 · 옷방으로 쓰는 작은 덤 공간입니다.', '84A · 84C · 84D · 113A · 113B에 있습니다.', '입주자모집공고 평면도'],
    '보조주방': ['주방 옆 작은 주방입니다. 냄새 나는 요리나 보관에 씁니다.', '113A · 113B · 121에 있습니다.', '입주자모집공고 평면도'],
    '전매제한': ['분양받은 권리(분양권)를 다른 사람에게 팔 수 없는 기간입니다.', '이 단지는 1년입니다.', '입주자모집공고'],
    '거주의무': ['분양받은 집에 정해진 기간 직접 살아야 하는 의무입니다.', '이 단지는 거주의무가 없습니다.', '입주자모집공고'],
    '비규제지역': ['투기과열지구 · 조정대상지역 같은 규제지역이 아닌 곳입니다.', '이 단지가 있는 곳은 비규제지역입니다. 규제 내용은 정부 발표로 바뀔 수 있습니다.', '입주자모집공고 · 국토교통부'],
    '입주자모집공고': ['분양 조건을 공식으로 알리는 문서입니다.', '분양가 · 납부 일정 · 계약 조건은 모두 이 문서를 기준으로 안내합니다.', '주택법'],
    '관리형토지신탁': ['신탁회사가 사업을 맡아 분양대금을 관리하는 방식입니다.', '분양대금은 한국자산신탁 명의의 지정 계좌로만 냅니다. 개인 계좌 · 현금은 인정되지 않습니다.', '입주자모집공고'],
    '피난층': ['불이 났을 때 대피하도록 비워 둔 층입니다.', '이 단지는 26층이 피난층이라 27층부터 다음 가격 구간입니다.', '입주자모집공고'],
    '커뮤니티': ['입주민이 함께 쓰는 운동 · 교육 · 휴식 시설입니다.', '스포츠클럽은 107동 옆, 어린이집 · 에듀클럽 · 시니어클럽은 106동, 컬쳐클럽은 103동 3층입니다.', '공식 홍보물'],
    'GTX-B': ['수도권을 빠르게 잇는 광역급행철도 B노선입니다.', '부천종합운동장역은 국토교통부가 2030년 개통 목표로 발표했고, 공식 홍보물에는 2031년 개통 예정으로 적혀 있습니다. 예정 사항이라 바뀔 수 있습니다.', '국토교통부 2024.2 · 공식 홍보물'],
    '일시적 2주택': ['새집으로 갈아타면서 잠깐 두 채가 되는 경우입니다.', '잔금대출을 받으면 기존 집을 6개월 안에 처분하는 조건이 붙고, 그러면 무주택과 같은 기준으로 대출을 받습니다.', '금융위원회 2025.6.27 발표'],
    '생애최초': ['부부 모두 집을 가져 본 적이 없는 경우입니다.', '대출 · 세금에서 따로 보는 조건이 있어 먼저 여쭙니다.', '금융위원회 · 지방세법'],
    '자금조달계획서': ['집 살 돈을 어떻게 마련하는지 적어 내는 서류입니다.', '계약일부터 30일 안에 냅니다. 내지 않거나 거짓으로 쓰면 과태료가 있습니다.', '부동산 거래신고 등에 관한 법률'],
    '유니트': ['견본주택에 실제 크기로 지어 놓은 집입니다.', '84A · 84C · 84F · 113A · 121은 견본주택에서 직접 보실 수 있습니다.', '견본주택'],
    '조감도': ['하늘에서 내려다본 모습을 그린 그림입니다.', '이해를 돕기 위한 이미지라 실제와 다를 수 있습니다.', '공식 홍보물'],
    '선착순': ['남은 호실을 먼저 계약하는 분께 드리는 방식입니다.', '그래서 1 · 2 · 3순위를 정해 두면 원하는 호실이 먼저 계약되어도 바로 다음으로 진행할 수 있습니다.', '분양 계약 방식'],
    '분양가': ['이 집의 값으로 공식 발표된 금액입니다.', '층과 호수에 따라 다르고, 금액은 입주자모집공고 기준입니다.', '입주자모집공고']
  };
  var KEYS = Object.keys(G).sort(function (a, b) { return b.length - a.length; });
  var SKIP = /^(BUTTON|A|SELECT|OPTION|INPUT|TEXTAREA|SCRIPT|STYLE|SVG|LABEL|SUMMARY|H1)$/;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]; }); }
  function topDoc() { try { return window.top.document; } catch (e) { return document; } }
  function css(doc) {
    if (doc.getElementById('sig-gl-css')) return;
    var s = doc.createElement('style'); s.id = 'sig-gl-css';
    s.textContent = '.gl{border:none;background:none;padding:0;margin:0;color:inherit;text-decoration:underline dotted 2px;text-decoration-color:var(--gold2,#E8B547);text-underline-offset:4px;cursor:help;display:inline}' +
      '.glsheet{position:fixed;left:0;right:0;bottom:0;z-index:120;background:var(--surface,#fff);color:var(--ink,#0F1729);border-top:4px solid var(--gold2,#E8B547);border-radius:22px 22px 0 0;box-shadow:0 -16px 40px rgba(0,0,0,.25);padding:18px max(20px,env(safe-area-inset-left,0px)) calc(20px + env(safe-area-inset-bottom,0px));max-height:70vh;overflow:auto;font-family:var(--sans,sans-serif)}' +
      '.glsheet .gh{display:flex;justify-content:space-between;align-items:center;gap:10px}.glsheet h3{font-size:24px;margin:0;font-family:var(--serif,serif)}.glsheet .gx{min-height:48px;padding:0 18px;border-radius:12px;border:1.5px solid var(--line2,#D9D1C3);background:transparent;color:inherit;font:inherit;font-weight:700}' +
      '.glsheet .g1{font-size:20px;font-weight:700;margin:10px 0 0;line-height:1.5}.glsheet .g2{margin:10px 0 0;font-size:17px;line-height:1.6;background:var(--surface2,#FBF9F5);border:1px solid var(--line,#E6E0D5);border-radius:12px;padding:10px 12px}.glsheet .g2 b{display:block;font-size:13px;color:var(--gold,#7A4F00);letter-spacing:.06em}.glsheet .g3{margin:10px 0 0;font-size:13.5px;color:var(--muted,#5E6677)}' +
      '.glmask{position:fixed;inset:0;z-index:119;background:rgba(0,0,0,.35)}' +
      '.ezb{display:inline-flex;align-items:center;gap:6px;min-height:44px;padding:0 14px;margin:6px 0;border-radius:999px;border:2px solid var(--gold2,#E8B547);background:var(--gold-soft,#FBE7B5);color:var(--gold-ink,#4A2E00);font:inherit;font-size:15px;font-weight:800;cursor:pointer}' +
      '.ezov{position:fixed;inset:0;z-index:118;background:rgba(11,15,24,.72);display:flex;align-items:center;justify-content:center;padding:16px}.ezbox{background:var(--surface,#fff);color:var(--ink,#0F1729);border-radius:22px;max-width:760px;width:100%;max-height:92vh;overflow:auto;padding:22px;box-shadow:0 20px 50px rgba(0,0,0,.35);font-family:var(--sans,sans-serif)}' +
      '.ezbox .eh{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}.ezbox .ek{font-size:13px;font-weight:800;letter-spacing:.12em;color:var(--gold,#7A4F00)}.ezbox h2{font-size:26px;margin:4px 0 0;font-family:var(--serif,serif)}.ezbox .e1{font-size:21px;font-weight:700;margin:14px 0 0;line-height:1.5;background:var(--gold-soft,#FBE7B5);color:var(--gold-ink,#4A2E00);border-radius:14px;padding:12px 14px}' +
      '.ezbox svg{width:100%;height:auto;margin-top:14px;display:block}.ezbox .es{display:grid;gap:8px;margin:14px 0 0;padding:0;list-style:none;counter-reset:e}.ezbox .es li{counter-increment:e;display:flex;gap:10px;align-items:flex-start;font-size:17px;line-height:1.55;padding:10px 12px;border-radius:12px;border:1.5px solid var(--line,#E6E0D5);opacity:.45;transition:opacity .25s,border-color .25s}' +
      '.ezbox .es li::before{content:counter(e);flex:none;width:30px;height:30px;border-radius:50%;background:var(--navy,#0F1729);color:var(--navy-ink,#fff);font-weight:800;display:flex;align-items:center;justify-content:center}.ezbox .es li.on{opacity:1;border-color:var(--gold2,#E8B547);box-shadow:0 0 0 3px var(--gold-soft,#FBE7B5)}' +
      '.ezbox .eo{margin-top:14px;border-radius:14px;padding:12px 14px;background:var(--navy,#0F1729);color:var(--navy-ink,#fff)}.ezbox .eo b{color:var(--gold2,#E8B547);display:block;font-size:13px;letter-spacing:.08em}.ezbox .eo p{margin:4px 0 0;font-size:17.5px;line-height:1.55}' +
      '.ezbox .ef{font-size:13px;color:var(--muted,#5E6677);margin-top:12px}.ezbox .ebt{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.ezbox .ebt button{min-height:52px;padding:0 20px;border-radius:12px;font:inherit;font-weight:800;font-size:16px;border:1.5px solid var(--line2,#D9D1C3);background:transparent;color:inherit}.ezbox .ebt .p{background:var(--navy,#0F1729);color:var(--navy-ink,#fff);border-color:var(--navy,#0F1729)}' +
      '.ezbox [data-seg]{transition:opacity .25s}.ezbox svg.dim [data-seg]{opacity:.28}.ezbox svg.dim [data-seg].hi{opacity:1}';
    (doc.head || doc.documentElement).appendChild(s);
  }
  /* 용어 표시: root 안의 글자에서 용어마다 처음 한 번만 밑줄 */
  function mark(root) {
    if (!root) return; var doc = root.ownerDocument || document; css(doc);
    var seen = {}; [].forEach.call(root.querySelectorAll('.gl'), function (x) { seen[x.dataset.gl] = 1; });
    var tw = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: function (n) {
      for (var p = n.parentNode; p && p !== root; p = p.parentNode) { if (SKIP.test(p.nodeName.toUpperCase()) || (p.classList && (p.classList.contains('gl') || p.classList.contains('nogl')))) return NodeFilter.FILTER_REJECT; }
      return n.nodeValue.trim().length > 1 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT; } });
    var nodes = []; while (tw.nextNode()) nodes.push(tw.currentNode);
    while (nodes.length) {
      var n = nodes.shift(), t = n.nodeValue, hit = null, at = -1;
      KEYS.forEach(function (k) { if (seen[k]) return; var i = t.indexOf(k); if (i >= 0 && (at < 0 || i < at)) { at = i; hit = k; } });
      if (!hit) continue; seen[hit] = 1;
      var b = doc.createElement('span'); b.setAttribute('role', 'button'); b.tabIndex = 0; b.className = 'gl'; b.dataset.gl = hit; b.textContent = hit;
      var after = n.splitText(at); after.nodeValue = after.nodeValue.slice(hit.length); n.parentNode.insertBefore(b, after);
      if (after.nodeValue.length > 1) nodes.unshift(after);
    }
    if (!doc.__glOn) { doc.__glOn = 1; doc.addEventListener('click', function (e) { var g = e.target.closest && e.target.closest('.gl'); if (g) { e.preventDefault(); e.stopPropagation(); open(g.dataset.gl); } }, true); }
  }
  function close(doc) { doc = doc || topDoc(); [].forEach.call(doc.querySelectorAll('.glsheet,.glmask'), function (x) { x.remove(); }); }
  function open(k) {
    var x = G[k]; if (!x) return; var doc = topDoc(); css(doc); close(doc);
    var m = doc.createElement('div'); m.className = 'glmask'; m.onclick = function () { close(doc); };
    var s = doc.createElement('div'); s.className = 'glsheet'; s.setAttribute('role', 'dialog');
    s.innerHTML = '<div class="gh"><h3>' + esc(k) + '</h3><button class="gx" type="button">닫기</button></div><p class="g1">' + esc(x[0]) + '</p><div class="g2"><b>우리 단지에서는</b>' + esc(x[1]) + '</div><p class="g3">근거 · ' + esc(x[2]) + '</p>';
    s.querySelector('.gx').onclick = function () { close(doc); };
    doc.body.appendChild(m); doc.body.appendChild(s);
    try { if (window.top.CX && window.top.CX.ask) window.top.CX.ask('용어 · ' + k); } catch (e) { }
  }
  /* ---------- 쉽게 보기 ---------- */
  function won(v) { if (v == null || isNaN(v)) return '—'; var m = Math.round(v * 10000); if (m >= 10000) { var e = Math.floor(m / 10000), r = m % 10000; return e + '억' + (r ? ' ' + r.toLocaleString('ko-KR') + '만' : '') + ' 원'; } return m.toLocaleString('ko-KR') + '만 원'; }
  function svgMoney(c) {
    var W = 700, x0 = 20, w = 660, a = w * .05, b = w * .60;
    return '<svg viewBox="0 0 ' + W + ' 150" role="img" aria-label="계약금 5% · 중도금 60% · 잔금 35%">' +
      '<g data-seg="1"><rect x="' + x0 + '" y="40" width="' + a + '" height="52" rx="6" fill="#C98A12"/><text x="' + x0 + '" y="30" font-size="16" font-weight="700" fill="currentColor">계약금 5%</text><text x="' + x0 + '" y="118" font-size="14" fill="currentColor">계약할 때</text></g>' +
      '<g data-seg="2"><rect x="' + (x0 + a + 4) + '" y="40" width="' + (b - 4) + '" height="52" rx="6" fill="#5B7DB1"/><text x="' + (x0 + a + b / 2) + '" y="72" text-anchor="middle" font-size="18" font-weight="800" fill="#fff">중도금 60% · 6번</text><text x="' + (x0 + a + b / 2) + '" y="118" text-anchor="middle" font-size="14" fill="currentColor">공사하는 동안 · 중도금 대출 · 이자 후불</text></g>' +
      '<g data-seg="3"><rect x="' + (x0 + a + b + 4) + '" y="40" width="' + (w - a - b - 4) + '" height="52" rx="6" fill="#2F8F6A"/><text x="' + (x0 + a + b + (w - a - b) / 2) + '" y="72" text-anchor="middle" font-size="18" font-weight="800" fill="#fff">잔금 35%</text><text x="' + (x0 + a + b + (w - a - b) / 2) + '" y="118" text-anchor="middle" font-size="14" fill="currentColor">입주할 때 · 잔금대출</text></g>' +
      '<text x="' + x0 + '" y="146" font-size="13" fill="currentColor" opacity=".7">막대 전체 = 분양가' + (c && c.P ? ' ' + won(c.P) : '') + '</text></svg>';
  }
  function svgLoan(c) {
    var p = c && c.P ? Math.max(8, Math.min(30, c.P)) : null, X = function (v) { return 20 + (v - 8) / 22 * 660; };
    return '<svg viewBox="0 0 700 150" role="img" aria-label="집값 15억 · 25억 기준 잔금대출 한도">' +
      '<g data-seg="1"><rect x="20" y="40" width="' + (X(15) - 20) + '" height="50" fill="#2F8F6A" rx="6"/><text x="' + ((20 + X(15)) / 2) + '" y="71" text-anchor="middle" font-size="18" font-weight="800" fill="#fff">최대 6억</text><text x="20" y="112" font-size="14" fill="currentColor">15억 이하</text></g>' +
      '<g data-seg="2"><rect x="' + (X(15) + 3) + '" y="40" width="' + (X(25) - X(15) - 3) + '" height="50" fill="#5B7DB1" rx="6"/><text x="' + ((X(15) + X(25)) / 2) + '" y="71" text-anchor="middle" font-size="18" font-weight="800" fill="#fff">최대 4억</text><text x="' + (X(15) + 4) + '" y="112" font-size="14" fill="currentColor">15억 초과 ~ 25억</text></g>' +
      '<g data-seg="3"><rect x="' + (X(25) + 3) + '" y="40" width="' + (680 - X(25) - 3) + '" height="50" fill="#8A6A9E" rx="6"/><text x="' + ((X(25) + 680) / 2) + '" y="71" text-anchor="middle" font-size="16" font-weight="800" fill="#fff">최대 2억</text><text x="' + (X(25) + 4) + '" y="112" font-size="14" fill="currentColor">25억 초과</text></g>' +
      (p ? '<g><path d="M' + X(p) + ' 28 l-8 -12 h16z" fill="#C0392B"/><text x="' + X(p) + '" y="12" text-anchor="middle" font-size="14" font-weight="800" fill="#C0392B">우리 집</text></g>' : '') +
      '<text x="20" y="140" font-size="13" fill="currentColor" opacity=".7">왼쪽에서 오른쪽으로 갈수록 집값이 높습니다 (수도권 주택구입 주택담보대출)</text></svg>';
  }
  function svgFloor() {
    var bars = [['4층', 20, 30], ['5층', 80, 36], ['6~9층', 140, 52], ['10~19층', 250, 66], ['20층 이상', 400, 80]];
    return '<svg viewBox="0 0 700 170" role="img" aria-label="층 가격 구간">' + bars.map(function (b, i) {
      return '<g data-seg="' + (i < 2 ? 1 : (i === 3 ? 3 : 2)) + '"><rect x="' + b[1] + '" y="' + (130 - b[2]) + '" width="' + (i > 1 ? 100 : 50) + '" height="' + b[2] + '" rx="6" fill="' + ['#B9A88A', '#B9A88A', '#5B7DB1', '#2F8F6A', '#8A6A9E'][i] + '"/><text x="' + (b[1] + (i > 1 ? 50 : 25)) + '" y="152" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">' + b[0] + '</text></g>';
    }).join('') + '<g data-seg="3"><path d="M340 50 l0 -22" stroke="#C0392B" stroke-width="3"/><text x="348" y="34" font-size="14" font-weight="800" fill="#C0392B">같은 값이면 구간 맨 위층 (19층)</text></g></svg>';
  }
  function svgTax() {
    var r = [['무주택 · 1주택', 3.3, '#2F8F6A'], ['이 집이 3번째', 8, '#C98A12'], ['4번째 이상', 12, '#A4432F']];
    return '<svg viewBox="0 0 700 170" role="img" aria-label="주택 수에 따른 취득세율">' + r.map(function (x, i) {
      var w = x[1] / 12 * 440; return '<g data-seg="' + (i + 1) + '"><text x="20" y="' + (42 + i * 46) + '" font-size="16" font-weight="700" fill="currentColor">' + x[0] + '</text><rect x="200" y="' + (22 + i * 46) + '" width="' + w + '" height="30" rx="6" fill="' + x[2] + '"/><text x="' + (210 + w) + '" y="' + (43 + i * 46) + '" font-size="17" font-weight="800" fill="currentColor">약 ' + x[1] + '%</text></g>';
    }).join('') + '</svg>';
  }
  function svgTable() {
    return '<svg viewBox="0 0 700 170" role="img" aria-label="표 읽는 법"><g data-seg="1"><rect x="160" y="10" width="520" height="36" rx="6" fill="#0F1729"/><text x="420" y="34" text-anchor="middle" font-size="16" font-weight="700" fill="#F2C14E">맨 윗줄 · 무엇을 비교하는지</text></g>' +
      '<g data-seg="2"><rect x="20" y="52" width="132" height="108" rx="6" fill="#5B7DB1"/><text x="86" y="110" text-anchor="middle" font-size="15" font-weight="700" fill="#fff">왼쪽 칸 · 항목</text></g>' +
      '<g data-seg="3"><rect x="160" y="52" width="520" height="108" rx="6" fill="none" stroke="currentColor" stroke-opacity=".3"/><rect x="420" y="90" width="120" height="34" rx="6" fill="#2F8F6A"/><text x="480" y="112" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">만나는 칸</text></g></svg>';
  }
  var EZ = {
    money: { k: '자금 흐름', t: '언제, 얼마를 내나요?', one: '계약할 때 조금, 공사 중에 여섯 번, 입주할 때 나머지를 냅니다.', svg: svgMoney,
      steps: ['막대 전체가 이 집의 분양가입니다.', '왼쪽부터 내는 순서입니다. 계약금 → 중도금 6번 → 잔금.', '중도금은 대출로, 잔금은 잔금대출로 낼 수 있어 실제 내 돈은 계약금과 잔금 일부 · 세금입니다.'],
      mine: function (c) { return c && c.P ? '계약금 ' + won(c.P * .05) + ' (계약일 1,000만 원 + 30일 안에 나머지) → 중도금 ' + won(c.P * .6) + ' (6번 · 중도금 대출) → 잔금 ' + won(c.P * .35) + (c.loan ? ' (잔금대출 최대 ' + c.loan + '억)' : '') + '. 입주 때 내 돈은 약 ' + won(c.mine) + '입니다 (추정).' : ''; },
      fine: '비율 · 회차는 입주자모집공고 기준이고, 대출 · 세금은 추정입니다. 은행 · 세무사에게 최종 확인합니다.' },
    loan: { k: '잔금대출', t: '대출은 얼마나 나오나요?', one: '집값이 15억 원 이하면 최대 6억, 15억~25억이면 최대 4억입니다.', svg: svgLoan,
      steps: ['초록 칸: 집값 15억 원 이하 → 최대 6억.', '파란 칸: 15억 초과 25억 이하 → 최대 4억.', '빨간 표시가 우리 집 분양가 자리입니다. 소득(DSR)에 따라 은행이 최종 정합니다.'],
      mine: function (c) { return c && c.P ? '고르신 호실 분양가 ' + won(c.P) + ' → ' + (c.loan ? '잔금대출 최대 ' + c.loan + '억' : '잔금대출 제한 (다주택)') + '입니다.' : ''; },
      fine: '금융위원회 2025.10.15 발표 기준 · 수도권 주택구입 주택담보대출. 입주 때 그때 규정으로 확정됩니다.' },
    floor: { k: '층과 가격', t: '몇 층이 좋을까요?', one: '같은 가격 구간이면 그 구간 맨 위층이 같은 돈으로 더 높습니다.', svg: svgFloor,
      steps: ['막대 하나가 같은 가격으로 파는 층 묶음입니다.', '오른쪽으로 갈수록 높은 층 · 높은 가격입니다.', '같은 묶음 안에서는 위층일수록 유리합니다. 6~9층은 9층, 10~19층은 19층.'],
      mine: function (c) { return c && c.bn ? '고르신 층: ' + c.bn + '. 이 구간 안에서 위층부터 확인해 드립니다. 26층은 피난층입니다.' : ''; },
      fine: '가격 구간은 입주자모집공고 기준입니다. 정확한 층 · 호수는 확인한 뒤 확정합니다.' },
    tax: { k: '취득세', t: '세금은 얼마나 되나요?', one: '집을 살 때 한 번 내는 세금이고, 가진 집 수에 따라 달라집니다.', svg: svgTax,
      steps: ['무주택 · 1주택은 84㎡ 기준 약 3.3%입니다.', '이 집이 3번째 집이면 8%입니다.', '4번째 이상이면 12%입니다. 잔금 때 주택 수로 정해집니다.'],
      mine: function (c) { return c && c.tx ? '고르신 호실 기준 취득세 약 ' + won(c.tx) + '입니다 (추정).' : ''; },
      fine: '지방세법 기준 세율 · 지방교육세 등 포함 추정. 정확한 금액은 세무사에게 확인합니다.' },
    table: { k: '표 읽는 법', t: '이 표는 어떻게 보나요?', one: '맨 윗줄과 왼쪽 칸이 만나는 곳의 숫자를 읽으면 됩니다.', svg: svgTable,
      steps: ['맨 윗줄은 무엇을 비교하는지 알려 줍니다.', '왼쪽 칸은 항목(동 · 타입 · 층)입니다.', '윗줄과 왼쪽 칸이 만나는 칸이 답입니다. 손가락으로 따라가 보세요.'],
      mine: function () { return ''; }, fine: '' }
  };
  function guess(text) {
    text = text || '';
    if (/중도금|잔금|계약금|납부|내 돈/.test(text)) return 'money';
    if (/대출|15억|6억|4억/.test(text)) return 'loan';
    if (/취득세|세금/.test(text)) return 'tax';
    if (/층|구간/.test(text)) return 'floor';
    return 'table';
  }
  function ezOpen(k, ctx) {
    var E = EZ[k] || EZ.table, doc = topDoc(); css(doc);
    var old = doc.getElementById('ezov'); if (old) old.remove();
    var o = doc.createElement('div'); o.className = 'ezov'; o.id = 'ezov';
    var mine = E.mine(ctx || null);
    o.innerHTML = '<div class="ezbox" role="dialog"><div class="eh"><div><p class="ek">쉽게 보기 · ' + E.k + '</p><h2>' + E.t + '</h2></div><button class="gx" data-ez="x" style="min-height:48px;padding:0 18px;border-radius:12px;border:1.5px solid var(--line2,#D9D1C3);background:transparent;color:inherit;font:inherit;font-weight:700">닫기</button></div>' +
      '<p class="e1">' + E.one + '</p><div class="ezsv">' + E.svg(ctx) + '</div><ol class="es">' + E.steps.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol>' +
      (mine ? '<div class="eo"><b>우리 집이라면</b><p>' + esc(mine) + '</p></div>' : '') + (E.fine ? '<p class="ef">' + E.fine + '</p>' : '') +
      '<div class="ebt"><button data-ez="prev">← 앞으로</button><button class="p" data-ez="next">다음 단계 짚기 →</button></div></div>';
    doc.body.appendChild(o);
    var i = -1, sv = o.querySelector('svg'), lis = o.querySelectorAll('.es li');
    function show(n) { i = Math.max(0, Math.min(lis.length - 1, n)); [].forEach.call(lis, function (l, j) { l.classList.toggle('on', j === i); }); sv.classList.add('dim'); [].forEach.call(sv.querySelectorAll('[data-seg]'), function (g) { g.classList.toggle('hi', +g.dataset.seg === i + 1); }); }
    show(0);
    o.addEventListener('click', function (e) { if (e.target === o) { o.remove(); return; } var b = e.target.closest('[data-ez]'); if (!b) return; var a = b.dataset.ez;
      if (a === 'x') o.remove(); else if (a === 'next') { if (i >= lis.length - 1) { sv.classList.remove('dim'); [].forEach.call(lis, function (l) { l.classList.add('on'); }); b.textContent = '다 봤어요 · 닫기'; b.dataset.ez = 'x'; } else show(i + 1); } else if (a === 'prev') show(i - 1); });
    mark(o.querySelector('.ezbox'));
    try { if (window.top.CX && window.top.CX.ask) window.top.CX.ask('쉽게 보기 · ' + E.k); } catch (e) { }
  }
  /* 표 · 그래프 앞에 '쉽게 보기' 버튼 붙이기 (root 안) · ctxFn: 우리 집 숫자 */
  function decorate(root, ctxFn) {
    if (!root) return; var doc = root.ownerDocument || document; css(doc);
    [].forEach.call(root.querySelectorAll('table, svg:not(.noez), .chart, .bars, .paybar, .flow'), function (t) {
      if (t.closest('.ezbox,.noez') || t.__ez || (t.previousElementSibling && t.previousElementSibling.classList && t.previousElementSibling.classList.contains('ezb'))) return;
      if (t.getBoundingClientRect().height < 60 || t.closest('details:not([open])')) return;
      t.__ez = 1; var k = guess((t.closest('section,.card,.box,div') || t).textContent.slice(0, 400));
      var b = doc.createElement('button'); b.type = 'button'; b.className = 'ezb'; b.dataset.ezk = k; b.textContent = '? 쉽게 보기';
      t.parentNode.insertBefore(b, t);
    });
    if (!doc.__ezOn) { doc.__ezOn = 1; doc.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('.ezb'); if (b) { e.preventDefault(); e.stopPropagation(); ezOpen(b.dataset.ezk, ctxFn ? ctxFn() : null); } }, true); }
  }
  window.GLOSS = { G: G, mark: mark, open: open, close: close, css: css };
  window.EZ = { open: ezOpen, decorate: decorate, guess: guess, TOPICS: EZ, won: won };
})();
