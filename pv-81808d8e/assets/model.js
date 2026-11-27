/* 모형도 사진에 우리 집 '불 켜기' — 상담 화면(클로징) · 고객 결과지 공용
   위치는 견본주택 모형 사진(4방향)을 보고 동마다 대략 짚은 값입니다. 층은 높이 비율로 표시한 '대략 위치'입니다.
   MODELV.html(cands, opts) → 화면 조각 · MODELV.bind(host, getCands, opts) → 방향 바꾸기 버튼 연결
   cands: [{ dong:'106', lo:10, hi:19, r:0(순위 0부터), off:false, label:'106동 84C' }] */
(function () {
  var TOP = { '101': 48, '103': 48, '107': 48 };
  var BAND = { b4: [4, 4], b5: [5, 5], b69: [6, 9], b1019: [10, 19], b2025: [20, 25], b2739: [27, 39], b40: [40, 49] };
  // D: 동 → [가운데 x%, 너비 %, 꼭대기 y%, 바닥(1층) y%]
  var PH = [
    { id: 'meast', n: '터미널 쪽에서', ar: '4 / 3', D: { '104': [20, 18, 10, 84], '105': [41, 17, 8, 84], '106': [61, 18, 7, 84], '107': [82, 20, 14, 84] } },
    { id: 'mwest', n: '27M 도로 쪽에서', ar: '4 / 3', D: { '101': [29, 18, 15, 84], '102': [48, 16, 9, 84], '103': [66, 15, 12, 84], '104': [80, 7, 26, 76] } },
    { id: 'mnorth', n: '상동역 쪽에서', ar: '3 / 4', D: { '107': [25, 30, 11, 82], '101': [75, 30, 11, 82] } },
    { id: 'msouth', n: '어린이공원 쪽에서', ar: '3 / 4', D: { '103': [30, 18, 24, 74], '104': [70, 24, 21, 78] } }
  ];
  var RKC = ['#E8B547', '#5B8DEF', '#E07B39'];
  function top(d) { return TOP[d] || 49; }
  function band(id) { return BAND[id] || null; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]; }); }
  function best(cands) {
    var on = cands.filter(function (c) { return !c.off; }), b = PH[0], bs = -1;
    PH.forEach(function (p) { var s = 0; on.forEach(function (c) { if (p.D[c.dong]) s += c.r === 0 ? 3 : 2; }); cands.forEach(function (c) { if (c.off && p.D[c.dong]) s += .5; }); if (s > bs) { bs = s; b = p; } });
    return b.id;
  }
  function css(doc) {
    doc = doc || document; if (doc.getElementById('sig-model-css')) return;
    var s = doc.createElement('style'); s.id = 'sig-model-css';
    s.textContent = '.mv{margin-top:10px}.mvt{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px}.mvt button{min-height:44px;padding:0 14px;border-radius:999px;border:1.5px solid var(--line2,#D9D1C3);background:var(--surface,#fff);color:var(--ink,#0F1729);font:inherit;font-weight:700;font-size:14px}.mvt button.on{background:var(--navy,#0F1729);color:#F5F1E8;border-color:var(--navy,#0F1729)}.mvt button i{font-style:normal;display:inline-flex;gap:2px;margin-left:6px}.mvt button i b{width:9px;height:9px;border-radius:50%;background:var(--c)}' +
      '.mvf{position:relative;border-radius:16px;overflow:hidden;background:#222;max-width:100%}.mvf img{display:block;width:100%;height:100%;object-fit:cover}.mvf .dim{position:absolute;inset:0;background:rgba(0,0,0,.28)}' +
      '.mvb{position:absolute;border:3px solid var(--c);border-radius:6px;box-shadow:0 0 0 2px rgba(0,0,0,.25),0 0 22px 4px var(--c);animation:mvp 1.8s ease-in-out infinite;pointer-events:none}' +
      '.mvb.off{border-color:#9AA0A8;box-shadow:none;animation:none;opacity:.55;border-style:dashed}' +
      '.mvl{position:absolute;left:-3px;right:-3px;background:var(--c);opacity:.78;box-shadow:0 0 18px 6px var(--c);border-radius:3px}.mvb.off .mvl{background:#9AA0A8;box-shadow:none;opacity:.5}' +
      '.mvn{position:absolute;transform:translate(-50%,-115%);display:flex;align-items:center;gap:6px;white-space:nowrap;background:var(--c);color:#111;font-weight:800;font-size:14px;border-radius:999px;padding:5px 12px 5px 6px;box-shadow:0 6px 16px rgba(0,0,0,.35)}.mvn i{font-style:normal;width:24px;height:24px;border-radius:50%;background:#111;color:var(--c);display:inline-flex;align-items:center;justify-content:center;font-size:14px}.mvn.off{background:#C9CDD3;opacity:.8;text-decoration:line-through}' +
      '.mvc{margin-top:6px;font-size:13px;color:var(--muted,#5E6677);line-height:1.5}' +
      '@keyframes mvp{0%,100%{box-shadow:0 0 0 2px rgba(0,0,0,.25),0 0 10px 2px var(--c)}50%{box-shadow:0 0 0 2px rgba(0,0,0,.25),0 0 28px 8px var(--c)}}' +
      '@media (prefers-reduced-motion:reduce){.mvb{animation:none}}';
    (doc.head || doc.documentElement).appendChild(s);
  }
  function html(cands, o) {
    o = o || {}; css(o.doc); var base = o.base || '../assets/g/', id = o.ph || best(cands), P = PH.filter(function (p) { return p.id === id; })[0] || PH[0];
    var tabs = '<div class="mvt" role="tablist">' + PH.map(function (p) {
      var dots = cands.filter(function (c) { return !c.off && p.D[c.dong]; }).map(function (c) { return '<b style="--c:' + (c.col || RKC[c.r % 3]) + '"></b>'; }).join('');
      return '<button type="button" data-mv="' + p.id + '"' + (p.id === P.id ? ' class="on"' : '') + '>' + p.n + (dots ? '<i>' + dots + '</i>' : '') + '</button>'; }).join('') + '</div>';
    var ov = '', miss = [], seen = {};
    cands.slice().sort(function (a, b) { return (a.off ? 0 : 1) - (b.off ? 0 : 1) || b.r - a.r; }).forEach(function (c) {
      var d = P.D[c.dong]; if (!d) { if (!c.off) miss.push(c); return; }
      var x = d[0], w = d[1], t = d[2], b = d[3], h = b - t, T = top(c.dong), lo = c.lo || 1, hi = c.hi || T;
      var y1 = b - (Math.min(hi, T) / T) * h, y2 = b - ((Math.max(lo, 1) - 1) / T) * h, col = c.col || RKC[c.r % 3];
      ov += '<div class="mvb' + (c.off ? ' off' : '') + '" style="--c:' + col + ';left:' + (x - w / 2) + '%;width:' + w + '%;top:' + t + '%;height:' + h + '%"><div class="mvl" style="top:' + ((y1 - t) / h * 100) + '%;height:' + Math.max(1.2, (y2 - y1) / h * 100) + '%"></div></div>';
      var k = seen[c.dong] = (seen[c.dong] || 0) + 1, ly = Math.max(t, 11) + (k - 1) * 8;
      ov += '<div class="mvn' + (c.off ? ' off' : '') + '" style="--c:' + col + ';left:' + x + '%;top:' + ly + '%"><i>' + (c.mark || (c.r + 1)) + '</i>' + esc(c.label || c.dong + '동') + '</div>';
    });
    var f = '<div class="mvf" style="aspect-ratio:' + P.ar + '"><img src="' + base + 'model-' + P.id + '.jpg" alt="견본주택 모형 · ' + esc(P.n) + '"><div class="dim"></div>' + ov + '</div>';
    var cap = '<p class="mvc">견본주택 모형 사진 · ' + esc(P.n) + ' 본 모습입니다. 빛나는 띠가 고르신 층 구간의 <b>대략 위치</b>입니다.' + (miss.length ? ' ' + miss.map(function (c) { return (c.r + 1) + '순위 ' + c.dong + '동'; }).join(' · ') + '은 다른 방향 사진에 보입니다.' : '') + '</p>';
    return '<div class="mv" data-mvph="' + P.id + '">' + tabs + f + cap + '</div>';
  }
  function bind(host, get, o) {
    if (!host || host.__mv) return; host.__mv = 1;
    host.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('[data-mv]'); if (!b) return; e.preventDefault();
      var box = b.closest('.mv'); if (!box) return; var oo = {}; for (var k in (o || {})) oo[k] = o[k]; oo.ph = b.dataset.mv; if (o && o.onPh) o.onPh(b.dataset.mv);
      var t = document.createElement('div'); t.innerHTML = html(get(), oo); box.replaceWith(t.firstChild); });
  }
  window.MODELV = { html: html, bind: bind, band: band, top: top, PH: PH, RKC: RKC, css: css };
})();
