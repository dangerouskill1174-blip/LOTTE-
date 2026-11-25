/* 화면 모드 (색 · 큰 글씨 · 기념일) — 상담 데스크 · 상담 화면 · 결과지가 같이 씀
   저장: localStorage 'sig-skin' = {s:'white'|'dark'|'blue'|'green'|'beige'|'hc'|'anniv'|'auto', ann:'birth'…, big:true}
   결과지(고객 폰)는 주소의 sk= · an= 값으로 엽니다 (저장하지 않음). */
(function () {
  'use strict';
  var LIST = [
    { id: 'white', n: '화이트', d: '기본 · 밝은 상담석', sw: ['#F6F3EE', '#0F1729', '#E8B547'] },
    { id: 'dark', n: '다크', d: '저녁 상담 · 눈부심 적게', sw: ['#10151F', '#1B2232', '#E8B547'] },
    { id: 'blue', n: '신뢰 블루', d: '첫 방문 · 자금 · 대출 이야기', sw: ['#F1F5FB', '#123A6B', '#4C8DDB'] },
    { id: 'green', n: '친환경 그린', d: '공원 · 정원 · 아이 있는 가족', sw: ['#F1F6F0', '#1E4D36', '#6FAF7B'] },
    { id: 'beige', n: '따뜻한 베이지', d: '60대 이상 고객 · 편안하게', sw: ['#F7EFE3', '#5A3B22', '#D19A5B'] },
    { id: 'hc', n: '큰 글씨 · 고대비', d: '시력이 불편할 때 · 햇빛 드는 자리', sw: ['#FFFFFF', '#000000', '#FFD400'] },
    { id: 'anniv', n: '기념일', d: '생일 · 결혼기념일 · 명절 · 계약 축하', sw: ['#FFF4F4', '#7A1F3A', '#E8728F'] },
    { id: 'auto', n: '자동', d: '낮에는 화이트 · 저녁 6시부터 다크', sw: ['#F6F3EE', '#10151F', '#E8B547'] }
  ];
  var ANN = [
    { id: 'birth', n: '생일', e: '🎂', c: '#D9567A', m: '생일을 축하드립니다' },
    { id: 'wed', n: '결혼기념일', e: '💍', c: '#B5577E', m: '결혼기념일을 축하드립니다' },
    { id: 'parents', n: '어버이날', e: '🌸', c: '#C8436A', m: '어버이날, 감사의 마음을 전합니다' },
    { id: 'newyear', n: '설', e: '🧧', c: '#B23A2E', m: '새해 복 많이 받으세요' },
    { id: 'chuseok', n: '추석', e: '🌕', c: '#B5762A', m: '풍성한 한가위 보내세요' },
    { id: 'xmas', n: '크리스마스', e: '🎄', c: '#1F6F4A', m: '즐거운 성탄절 보내세요' },
    { id: 'contract', n: '계약 축하', e: '🎉', c: '#B8860B', m: '내 집 마련을 축하드립니다' }
  ];
  // 변수만 바꿈: 상담 데스크 · 상담 화면 · 호실 고르기(iframe) · 결과지가 같은 이름을 씀
  var V = {
    dark: '--bg:#0E131C;--surface:#182030;--surface2:#1E2738;--ink:#EEF1F6;--muted:#A9B2C3;--line:#2B3547;--line2:#3A4659;--navy:#070A10;--navy2:#111827;--navy-ink:#F5F1E8;--gold:#F2C14E;--gold2:#E8B547;--gold-soft:#3A2F14;--gold-ink:#F6D488;color-scheme:dark',
    blue: '--bg:#F1F5FB;--surface:#FFFFFF;--surface2:#F6F9FD;--ink:#0D1B33;--muted:#4D5B73;--line:#DCE4F0;--line2:#C6D2E4;--navy:#123A6B;--navy2:#1B4C86;--navy-ink:#F2F6FC;--gold:#1F5FAE;--gold2:#7FB2EE;--gold-soft:#DCEAFB;--gold-ink:#0E3566',
    green: '--bg:#F1F6F0;--surface:#FFFFFF;--surface2:#F7FAF6;--ink:#122318;--muted:#4E6153;--line:#DCE7DA;--line2:#C3D4C0;--navy:#1E4D36;--navy2:#2A6247;--navy-ink:#F1F7F2;--gold:#2E7A4C;--gold2:#9ED08F;--gold-soft:#DDF0D8;--gold-ink:#1A4A2C',
    beige: '--bg:#F7EFE3;--surface:#FFFBF5;--surface2:#FBF4EA;--ink:#2B1D12;--muted:#6E5A48;--line:#EADBC6;--line2:#DCC7AA;--navy:#5A3B22;--navy2:#6E4A2D;--navy-ink:#FBF3E6;--gold:#9A5B1E;--gold2:#E0A868;--gold-soft:#F6E1C2;--gold-ink:#5A3410',
    hc: '--bg:#FFFFFF;--surface:#FFFFFF;--surface2:#F4F4F4;--ink:#000000;--muted:#222222;--line:#555555;--line2:#222222;--navy:#000000;--navy2:#111111;--navy-ink:#FFFFFF;--gold:#000000;--gold2:#FFD400;--gold-soft:#FFF3A6;--gold-ink:#000000'
  };
  function css(doc) {
    var s = '';
    Object.keys(V).forEach(function (k) { s += 'html[data-skin="' + k + '"]{' + V[k] + '}\n'; });
    s += 'html[data-skin="anniv"]{--gold2:var(--ann,#E8728F);--gold-soft:#FFE3EA}\n';
    // 다크에서 흰 바탕 칸의 글자가 묻히지 않게
    s += 'html[data-skin="dark"] .cpane,html[data-skin="dark"] .oqq button,html[data-skin="dark"] .gi,html[data-skin="dark"] .xth,html[data-skin="dark"] .th,html[data-skin="dark"] .mph button{color:#0F1729}\n';
    s += 'html[data-skin="dark"] .navrow{background:linear-gradient(rgba(14,19,28,0),var(--bg) 35%)}\n';
    s += 'html[data-skin="dark"] img{filter:brightness(.92)}\n';
    s += 'html[data-skin="dark"] .xnow{background:#2A2414;border-color:#5A4A1E}html[data-skin="dark"] .sayq{background:#14233F;border-color:#3B6FD8}html[data-skin="dark"] .sayq p{color:#CFE0FF}\n';
    s += 'html[data-skin="hc"] body{font-weight:500}html[data-skin="hc"] .sub,html[data-skin="hc"] .fine{color:#111}\n';
    // 큰 글씨
    s += 'html.big #stage,html.big .xpbd,html.big .box,html.big .wrap,html.big .clw{zoom:1.08}html.big body.sim-embed{zoom:1.08}\n';
    // 나이대별 보기 (40대 보통 · 50대 크게 · 60~70대 아주 크게) — 화면에는 나이 대신 크기로만 표시
    s += 'html[data-age="50"] #stage,html[data-age="50"] .xpbd,html[data-age="50"] .box,html[data-age="50"] .wrap,html[data-age="50"] .clw,html[data-age="50"] body.sim-embed{zoom:1.16}\n';
    s += 'html[data-age="70"] #stage,html[data-age="70"] .xpbd,html[data-age="70"] .box,html[data-age="70"] .wrap,html[data-age="70"] .clw,html[data-age="70"] body.sim-embed{zoom:1.3}\n';
    s += '@media (max-width:600px){html[data-age="50"] #stage,html[data-age="50"] .xpbd,html[data-age="50"] .box,html[data-age="50"] .wrap,html[data-age="50"] .clw,html[data-age="50"] body.sim-embed{zoom:1.06}html[data-age="70"] #stage,html[data-age="70"] .xpbd,html[data-age="70"] .box,html[data-age="70"] .wrap,html[data-age="70"] .clw,html[data-age="70"] body.sim-embed{zoom:1.12}}\n';
    s += 'html[data-age] body.sim-embed{overflow-x:hidden}html[data-age] body.sim-embed .opt{min-width:0;max-width:100%}html[data-age] body.sim-embed .opt *{min-width:0;overflow-wrap:anywhere}\n';
    s += 'html[data-age="70"]:not([data-skin="dark"]){--muted:#3A4252;--line:#CFC6B6;--line2:#B9AE9B}html[data-age="70"] body{line-height:1.65}html[data-age="70"] .fine,html[data-age="70"] small{opacity:1}\n';
    s += '.annrib{position:fixed;z-index:31;right:max(12px,env(safe-area-inset-right,0px));top:calc(var(--topH,0px) + 8px);background:var(--ann,#E8728F);color:#fff;font-weight:800;font-size:14px;border-radius:999px;padding:6px 14px;box-shadow:0 6px 18px rgba(0,0,0,.18);pointer-events:none}\n';
    var st = doc.getElementById('sig-skin-css');
    if (!st) { st = doc.createElement('style'); st.id = 'sig-skin-css'; (doc.head || doc.documentElement).appendChild(st); }
    st.textContent = s;
  }
  function read() {
    var o = null;
    try { o = JSON.parse(localStorage.getItem('sig-skin') || 'null'); } catch (e) { }
    if (!o) o = { s: 'white', ann: '', big: true };
    if (o.big == null) o.big = true;
    return o;
  }
  function fromUrl() {
    var m = /[?&#]sk=([a-z]+)/.exec(location.href), a = /[?&#]an=([a-z]+)/.exec(location.href);
    return m ? { s: m[1], ann: a ? a[1] : '', big: false, url: true } : null;
  }
  /* 나이대별 보기: 고객마다 다름 → 'sig-age' (새 고객이면 지움) · 결과지는 주소의 ag= */
  var AGES = [{ id: '', n: '보통', d: '지금 크기', h: '40대' }, { id: '50', n: '크게', d: '글씨 · 버튼 15% 크게', h: '50대' }, { id: '70', n: '아주 크게', d: '30% 크게 · 진한 글씨', h: '60~70대' }];
  function ageRead() { var m = /[?&#]ag=(50|70)/.exec(location.href); if (m) return m[1]; try { return localStorage.getItem('sig-age') || ''; } catch (e) { return ''; } }
  function ageApply(doc, a) { doc = doc || document; a = a == null ? ageRead() : a; if (a) doc.documentElement.setAttribute('data-age', a); else doc.documentElement.removeAttribute('data-age'); }
  function ageSet(a) { try { if (a) localStorage.setItem('sig-age', a); else localStorage.removeItem('sig-age'); } catch (e) { } ageApply(document, a);
    try { [].forEach.call(document.querySelectorAll('iframe'), function (f) { try { ageApply(f.contentDocument, a); } catch (e) { } }); } catch (e) { } }
  function eff(o) { if (o.s === 'auto') { var h = new Date().getHours(); return (h >= 18 || h < 7) ? 'dark' : 'white'; } return o.s; }
  function ann(id) { for (var i = 0; i < ANN.length; i++) if (ANN[i].id === id) return ANN[i]; return null; }
  function apply(doc, o) {
    doc = doc || document; o = o || fromUrl() || read();
    css(doc);
    var r = doc.documentElement, s = eff(o);
    r.setAttribute('data-skin', s);
    r.classList.toggle('big', !!o.big); ageApply(doc);
    var a = s === 'anniv' ? ann(o.ann) : null;
    if (a) r.style.setProperty('--ann', a.c); else r.style.removeProperty('--ann');
    var rb = doc.getElementById('annrib');
    if (a && doc.body && !o.norib) { if (!rb) { rb = doc.createElement('div'); rb.id = 'annrib'; rb.className = 'annrib'; doc.body.appendChild(rb); } rb.textContent = a.e + ' ' + a.n; }
    else if (rb) rb.remove();
    return o;
  }
  function save(o) { try { localStorage.setItem('sig-skin', JSON.stringify(o)); } catch (e) { } }
  function set(patch) { var o = read(); for (var k in patch) o[k] = patch[k]; if (o.s !== 'anniv') o.ann = ''; save(o); apply(document, o);
    try { [].forEach.call(document.querySelectorAll('iframe'), function (f) { try { if (f.contentWindow && f.contentWindow.SKIN) f.contentWindow.SKIN.apply(); else apply(f.contentDocument, o); } catch (e) { } }); } catch (e) { }
    return o; }
  /* 고르기 화면 (상담 화면 · 상담 데스크 공용) */
  function picker(host, onDone) {
    var o = read();
    var h = '<div class="skp"><div class="skh"><h2>화면 색</h2><button class="btn btn-s" data-sk="close">닫기</button></div><p class="sub">오늘 분위기나 고객에 맞춰 바꿉니다. “고객님 편한 색으로 바꿔 드릴까요?”로 시작해 보세요.</p><div class="skg">';
    LIST.forEach(function (x) { h += '<button class="skc' + (o.s === x.id ? ' on' : '') + '" data-sk="' + x.id + '"><span class="sw">' + x.sw.map(function (c) { return '<i style="background:' + c + '"></i>'; }).join('') + '</span><b>' + x.n + '</b><small>' + x.d + '</small></button>'; });
    h += '</div>';
    if (o.s === 'anniv') { h += '<p class="skl">어떤 날인가요?</p><div class="ska">' + ANN.map(function (a) { return '<button class="' + (o.ann === a.id ? 'on' : '') + '" data-ska="' + a.id + '">' + a.e + ' ' + a.n + '</button>'; }).join('') + '</div><p class="fine">결과지 맨 위에 “' + ((ann(o.ann) || ANN[0]).m) + '” 문구가 들어갑니다. 고객 이름은 넣지 않습니다. ‘새 고객’을 누르면 기념일은 풀립니다.</p>'; }
    var ag = ageRead();
    h += '<p class="skl">글씨 크기 · 고객에 맞춰</p><div class="ska skage">' + AGES.map(function (x) { return '<button class="' + (ag === x.id ? 'on' : '') + '" data-skg="' + (x.id || '0') + '"><b>' + x.n + '</b> <small>' + x.d + '</small></button>'; }).join('') + '</div>';
    h += '<label class="skbig"><input type="checkbox" data-skb ' + (o.big ? 'checked' : '') + '> 큰 글씨 (기본 켜짐)</label></div>';
    host.innerHTML = h;
    host.onclick = function (e) {
      var b = e.target.closest('[data-sk],[data-ska],[data-skg]'); if (!b) return;
      if (b.dataset.skg) { ageSet(b.dataset.skg === '0' ? '' : b.dataset.skg); picker(host, onDone); return; }
      if (b.dataset.sk === 'close') { onDone && onDone(); return; }
      if (b.dataset.sk) set({ s: b.dataset.sk, ann: b.dataset.sk === 'anniv' ? (read().ann || 'birth') : '' });
      if (b.dataset.ska) set({ ann: b.dataset.ska });
      picker(host, onDone);
    };
    host.onchange = function (e) { if (e.target.hasAttribute('data-skb')) { set({ big: e.target.checked }); } };
  }
  var PCSS = '.skp .skh{display:flex;justify-content:space-between;align-items:center;gap:10px}.skg{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:10px;margin-top:14px}' +
    '.skc{display:flex;flex-direction:column;align-items:flex-start;gap:4px;text-align:left;border:2px solid var(--line2);background:var(--surface);color:var(--ink);border-radius:16px;padding:12px 14px;min-height:96px;font:inherit}' +
    '.skc.on{border-color:var(--gold2);box-shadow:0 0 0 3px var(--gold-soft)}.skc .sw{display:flex;gap:4px}.skc .sw i{width:22px;height:22px;border-radius:6px;border:1px solid rgba(0,0,0,.15)}.skc b{font-size:17px}.skc small{font-size:13px;color:var(--muted);line-height:1.4}' +
    '.skl{margin-top:16px;font-weight:800}.ska{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}.ska button{min-height:48px;padding:0 14px;border-radius:999px;border:1.5px solid var(--line2);background:var(--surface);color:var(--ink);font:inherit;font-weight:700}.ska button.on{background:var(--navy);color:var(--navy-ink);border-color:var(--navy)}' +
    '.skage button{display:inline-flex;align-items:baseline;gap:6px}.skage small{font-weight:500;opacity:.8}' +
    '.skbig{display:flex;align-items:center;gap:10px;margin-top:16px;font-weight:700;min-height:48px}.skbig input{width:24px;height:24px}';
  function pickerCss(doc) { doc = doc || document; if (doc.getElementById('sig-skin-pcss')) return; var s = doc.createElement('style'); s.id = 'sig-skin-pcss'; s.textContent = PCSS; doc.head.appendChild(s); }
  window.SKIN = { LIST: LIST, ANN: ANN, read: read, set: set, apply: function (doc) { return apply(doc); }, eff: eff, ann: ann, picker: function (h, d) { pickerCss(); picker(h, d); },
    AGES: AGES, age: ageRead, setAge: ageSet, applyAge: ageApply,
    clearAnn: function () { var o = read(); if (o.s === 'anniv') { o.s = 'white'; o.ann = ''; save(o); apply(document, o); } } };
  apply(document);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { apply(document); });
  setInterval(function () { var o = fromUrl() || read(); if (o.s === 'auto') apply(document, o); }, 10 * 60e3);
})();
