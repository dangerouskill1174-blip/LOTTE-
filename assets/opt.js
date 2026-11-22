/* 상동역 롯데캐슬 시그니처 · 추가선택품목(유상옵션) 견적
   출처: 입주자모집공고 「발코니 확장 및 추가선택품목」 (가구 · 가전 · 시스템에어컨) · 금액 원, 부가세 포함
   계약 시 10% · 입주지정일 90% · 계약 후 변경 · 해제 불가 */
(function () {
  var T = ['84A', '84B', '84C', '84D', '84E', '84F', '113A', '113B', '121'];
  function P(map) { var o = {}; Object.keys(map).forEach(function (k) { k.split(',').forEach(function (t) { o[t] = map[k]; }); }); return o; }
  var D = {
    hg: { sp: '현관', n: '현관 스타일업', p: P({ '84A': 1826000, '84B': 1705000, '84C,84D,84E': 1705000, '84F': 2002000, '113A': 6281000, '113B': 3058000, '121': 3608000 }),
      d: P({ '84A,84C,84D,84E': '현관중문(스윙도어) · 대형 바닥타일 · 신발장 가구 디자인 고급화(템바도어 · 하부 간접조명)',
             '84B,84F': '현관중문(3연동 슬라이딩 도어) · 대형 바닥타일 · 신발장 가구 디자인 고급화(템바도어 · 하부 간접조명)',
             '113A': '현관중문(스윙도어) · 대형 바닥타일 · 프리미엄 신발장 · 현관팬트리 벽판넬형 시스템가구',
             '113B,121': '현관중문(3연동 슬라이딩 도어) · 대형 바닥타일 · 프리미엄 신발장 · 현관팬트리 벽판넬형 시스템가구' }) },
    lv: { sp: '거실', n: '거실 스타일업', p: P({ '84A,84B': 9680000, '84C,84D,84E': 7469000, '84F': 6512000, '113A,113B,121': 16148000 }),
      d: P({ '84A,84B,113A,113B,121': '거실 아트월 및 복도 유럽산 세라믹타일 · 거실 · 주방 · 복도 벽/천장 도장 및 AL마이너스몰딩',
             '84C,84D,84E,84F': '거실 아트월 유럽산 세라믹타일 · 거실 · 주방 · 복도 벽/천장 도장 및 AL마이너스몰딩' }) },
    cr: { sp: '복도', n: '복도장 고급화', p: P({ '84A,84F': 1287000, '113A,113B': 1397000 }), d: P({ '84A,84F,113A,113B': '복도장 고급화' }) },
    fl: { sp: '마루', n: '광폭 원목마루', p: P({ '84A,84B': 9218000, '84C,84D,84E,84F': 8228000, '113A,113B,121': 11924000 }),
      d: P({ '84A,84B,84C,84D,84E,84F,113A,113B,121': '광폭 원목마루 · 시공 위치 지정 불가 · 원목 특성상 색상 · 옹이가 견본주택과 다를 수 있음' }) },
    kt: { sp: '주방', n: '주방 스타일업', p: P({ '84A,84B': 21593000, '84C,84D,84F': 22737000, '84E': 25432000, '113A,113B': 17512000, '121': 25740000 }),
      d: P({ '84A,84B': '주방 외산가구(라마쿠치네, 키큰장 제외) · 벽 · 상판 유럽산 세라믹타일 · 고급 주방수전 · 외산 렌지후드(엘리카)',
             '84C,84D,84E,84F': '주방 외산가구(라마쿠치네, 키큰장 제외) · 벽 · 상판 유럽산 세라믹타일 · 아일랜드장 옆 벽면 유럽산 세라믹타일 · 고급 주방수전 · 외산 렌지후드(엘리카)',
             '113A,113B,121': '주방 외산가구 업그레이드(라마쿠치네, 키큰장 제외) · 벽 · 상판 유럽산 세라믹타일 · 고급 주방수전 · 외산 렌지후드(엘리카) · 상판 세라믹타일 디자인 선택 가능' }) },
    lt1: { sp: '조명', n: '조명 스타일업 1안', g: 'lt', auto: true, p: P({ '84A,84B,84C,84D,84E,84F': 5357000, '113A,113B,121': 6985000 }),
      d: P({ '84B,84C,84D,84E,84F,113A,121': '거실 스타일업 안 고를 때 · 거실/주방 우물천장 간접조명 · 거실/주방/복도/드레스룸 매입조명 · 침실 직부조명(색온도/밝기 조절) · 거실/침실 커튼박스 간접조명 · 현관/복도 등박스 조성+간접조명',
             '84A,113B': '거실 스타일업 안 고를 때 · 거실/주방 우물천장 간접조명 · 거실/주방/복도/드레스룸 매입조명 · 침실 직부조명(색온도/밝기 조절) · 거실/침실 커튼박스 간접조명 · 복도 등박스 조성+간접조명' }) },
    lt2: { sp: '조명', n: '조명 스타일업 2안', g: 'lt', auto: true, p: P({ '84A,84B,84C,84D,84E,84F': 6534000, '113A,113B,121': 8547000 }),
      d: P({ '84B,84C,84D,84E,84F,113A,121': '거실 스타일업 고를 때 · 거실/주방 우물천장 간접조명 · 거실/주방/복도/드레스룸 매입조명 · 침실 직부조명(색온도/밝기 조절) · 거실/침실 커튼박스 간접조명 · 현관/복도 등박스 조성+간접조명',
             '84A,113B': '거실 스타일업 고를 때 · 거실/주방 우물천장 간접조명 · 거실/주방/복도/드레스룸 매입조명 · 침실 직부조명(색온도/밝기 조절) · 거실/침실 커튼박스 간접조명 · 복도 등박스 조성+간접조명' }) },
    bt: { sp: '욕실', n: '욕실 스타일업', p: P({ '84A,84B,84C,84D,84E,84F,113A,113B': 8690000, '121': 9009000 }),
      d: P({ '84A,84B,84C,84D,84E,84F': '유럽산 욕실 벽타일(600×1200) · 욕실1 세면기 · 욕실1 · 2 비데일체형 양변기(아메리칸스탠다드) · 욕실1 ENG 젠다이 및 하부벽/욕조 에이프런 · 욕실2 샤워부스 고급화 · 외산 수전(듀라빗) 및 고급 악세서리',
             '113A,113B,121': '유럽산 욕실 벽타일(600×1200) · 욕실1 · 2 비데일체형 양변기(아메리칸스탠다드) · 욕실1 욕조 에이프런 ENG · 욕실2 샤워부스 고급화 · 외산 수전(듀라빗) 및 고급 악세서리' }) },
    al: { sp: '알파룸', n: '알파룸', p: P({ '84A': 2574000, '84B': 2695000 }),
      d: P({ '84A': '알파룸 팬트리 · 복도 팬트리 · 침실2 드레스룸', '84B': '알파룸 드레스룸 특화 · 벽판넬형 시스템가구 (안 고르면 벽지 마감 · 일반 시스템가구)' }) },
    md: { sp: '안방', n: '안방 드레스룸', g: 'md', p: P({ '84A': 3993000, '84B': 4598000, '84E': 3410000, '84F': 6336000, '84C,84D': 7480000, '113A,113B': 5324000, '121': 6402000 }),
      d: P({ '84A,84B,84E': '안방 드레스룸 특화 · 벽판넬형 시스템가구', '84F': '안방 드레스룸 확장 · 벽판넬형 시스템가구',
             '84C,84D': '안방 드레스룸 특화 1안 · 대형 드레스룸(알파룸 통합) · 슬라이딩 도어 · 벽판넬형 시스템가구', '113A,113B,121': '안방 드레스룸 · 벽판넬형 시스템가구 · 가구도어 고급화' }) },
    md2: { sp: '안방', n: '안방 드레스룸 2안', g: 'md', p: P({ '84C,84D': 3443000 }), d: P({ '84C,84D': '안방 드레스룸 특화 2안 · 벽판넬형 시스템가구' }) },
    b1: { sp: '침실1', n: '침실1', p: P({ '84B': 1298000, '84F,113A': 4092000 }),
      d: P({ '84B': '붙박이장', '84F,113A': '침실1 드레스룸 특화 · 벽판넬형 시스템가구' }) },
    b2: { sp: '침실2', n: '침실2 붙박이장', p: P({ '84C,84D,84E,84F,113A,113B': 1067000 }), d: P({ '84F,113A': '붙박이장 · 파우더형', '84C,84D,84E,113B': '붙박이장 · 수납강화형' }) },
    b3: { sp: '침실3', n: '침실3 붙박이장', p: P({ '121': 1298000 }), d: P({ '121': '붙박이장 · 수납강화형' }) },
    fr: { sp: '가전', n: '빌트인 냉장고 3종', p: P({ '84A,84B,84C,84D,84E,84F,113A,113B,121': 5800000 }), d: P({ '84A,84B,84C,84D,84E,84F,113A,113B,121': '1도어 냉장 + 1도어 냉동 + 1도어 김치냉장고 일괄 (삼성 RR40C7995AP · RZ34C7965AP · RQ34C7945AP) · 따로 고를 수 없음' }) },
    ih: { sp: '가전', n: '빌트인 디자인 3구 인덕션', p: P({ '84A,84B,84C,84D,84E,84F,113A,113B,121': 1430000 }), d: P({ '84A,84B,84C,84D,84E,84F,113A,113B,121': '삼성 NZ63DB657CAWS · 안 고르면 3구 가스쿡탑' }) },
    dw: { sp: '가전', n: '빌트인 식기세척기', p: P({ '84A,84B,84C,84D,84E,84F,113A,113B,121': 990000 }), d: P({ '84A,84B,84C,84D,84E,84F,113A,113B,121': '가구도어 부착형 · 삼성 DW80F71Y1SEW' }) },
    ov: { sp: '가전', n: '빌트인 전기오븐 비스포크', p: P({ '84A,84B,84C,84D,84E,84F,113A,113B,121': 300000 }), d: P({ '84A,84B,84C,84D,84E,84F,113A,113B,121': '삼성 NQ36A6588CW · 안 고르면 삼성 일반형 전기오븐' }) },
    bv: { sp: '가전', n: '욕실 복합 환기제 (욕실1 · 2)', p: P({ '84A,84B,84C,84D,84E,84F,113A,113B,121': 1100000 }), d: P({ '84A,84B,84C,84D,84E,84F,113A,113B,121': '복합형 (후젠트 · 힘펠)' }) },
    dh: { sp: '가전', n: '드레스룸 제습기', p: P({ '84A,84B,84C,84D,84E,84F,113A,113B,121': 830000 }), d: P({ '84A,84B,84C,84D,84E,84F,113A,113B,121': '코스텔 CDD-800B · 안방 드레스룸에만 설치' }) },
    ev1: { sp: '가전', n: '전열교환기 1안 · 본체', g: 'ev', p: P({ '84A,84B,84C,84D,84E,84F,113A,113B,121': 1980000 }), d: P({ '84A,84B,84C,84D,84E,84F,113A,113B,121': 'LG 프리미엄 전열교환기 본체' }) },
    ev2: { sp: '가전', n: '전열교환기 2안 · 본체+각실 제어', g: 'ev', p: P({ '84A,84B,84C,84D,84E,84F,113A,113B,121': 3940000 }), d: P({ '84A,84B,84C,84D,84E,84F,113A,113B,121': 'LG 프리미엄 전열교환기 본체 + 각실 제어' }) }
  };
  // 천장형 시스템에어컨 · 타입마다 하나만
  var AC = {
    '84A': [['ac1', '일반형', '거실+주방+안방', 4840000], ['ac2', '일반형', '거실+주방+안방+침실1+침실2', 7238000], ['ac3', '일반형', '전실 (거실+주방+안방+침실1+침실2+알파룸)', 8008000],
            ['ac4', '인피니티형', '거실+주방+안방', 6138000], ['ac5', '인피니티형', '거실+주방+안방+침실1+침실2', 9889000], ['ac6', '인피니티형', '전실 (거실+주방+안방+침실1+침실2+알파룸)', 11154000]],
    '84B': 'S84', '84C': 'S84', '84D': 'S84', '84E': 'S84', '84F': 'S84',
    S84: [['ac1', '일반형', '거실+주방+안방', 4840000], ['ac2', '일반형', '전실 (거실+주방+안방+침실1+침실2)', 7238000], ['ac3', '인피니티형', '거실+주방+안방', 6138000], ['ac4', '인피니티형', '전실 (거실+주방+안방+침실1+침실2)', 9889000]],
    '113A': 'S113', '113B': 'S113',
    S113: [['ac1', '일반형', '거실+주방+안방', 6292000], ['ac2', '일반형', '전실 (거실1 · 2+주방+안방+침실1+침실2+알파룸)', 9922000], ['ac3', '인피니티형', '거실+주방+안방', 8514000], ['ac4', '인피니티형', '전실 (거실1 · 2+주방+안방+침실1+침실2+알파룸)', 13585000]],
    '121': [['ac1', '일반형', '거실+주방+안방', 4940000], ['ac2', '일반형', '전실 (거실+주방+안방+침실1+침실2+침실3)', 9449000], ['ac3', '인피니티형', '거실+주방+안방', 6226000], ['ac4', '인피니티형', '전실 (거실+주방+안방+침실1+침실2+침실3)', 12738000]]
  };
  function acList(t) { var a = AC[t]; return typeof a === 'string' ? AC[a] : (a || []); }
  var ORDER = ['hg', 'lv', 'cr', 'fl', 'kt', 'lt1', 'lt2', 'bt', 'al', 'md', 'md2', 'b1', 'b2', 'b3', 'fr', 'ih', 'dw', 'ov', 'bv', 'dh', 'ev1', 'ev2'];
  var won = function (v) { return Math.round(v).toLocaleString('ko-KR'); };
  var man = function (v) { var m = v / 10000; return (Math.round(m * 10) / 10).toLocaleString('ko-KR') + '만원'; };

  var O = window.OPT = {
    TYPES: T,
    ACC: { bank: '수협은행', no: '1130-0065-2661', holder: '한국자산신탁(주)', sale: '1130-0065-2641' },
    has: function (t, id) { return !!(D[id] && D[id].p[t]); },
    items: function (t) { return ORDER.filter(function (id) { return D[id].p[t]; }).map(function (id) { var x = D[id]; return { id: id, sp: x.sp, n: x.n, g: x.g || '', auto: !!x.auto, price: x.p[t], d: x.d[t] || '' }; }); },
    ac: function (t) { return acList(t).map(function (a) { return { id: a[0], kind: a[1], room: a[2], price: a[3] }; }); },
    // 규칙: 조명은 거실 스타일업 여부로 1안/2안 자동, 같은 묶음(안방 · 전열교환기 · 에어컨)은 하나만
    normalize: function (t, sel) {
      var s = {}; (sel || []).forEach(function (id) { s[id] = 1; });
      var out = [];
      Object.keys(s).forEach(function (id) { if (D[id] ? D[id].p[t] : acList(t).some(function (a) { return a[0] === id; })) out.push(id); });
      var light = out.indexOf('lt1') >= 0 || out.indexOf('lt2') >= 0;
      out = out.filter(function (id) { return id !== 'lt1' && id !== 'lt2'; });
      if (light) out.push(out.indexOf('lv') >= 0 ? 'lt2' : 'lt1');
      if (out.indexOf('md') >= 0 && out.indexOf('md2') >= 0) out.splice(out.indexOf('md2'), 1);
      if (out.indexOf('ev1') >= 0 && out.indexOf('ev2') >= 0) out.splice(out.indexOf('ev1'), 1);
      var acs = out.filter(function (id) { return /^ac\d$/.test(id); }); if (acs.length > 1) acs.slice(0, -1).forEach(function (id) { out.splice(out.indexOf(id), 1); });
      return out;
    },
    lines: function (t, sel) {
      sel = O.normalize(t, sel); var L = [];
      ORDER.forEach(function (id) { if (sel.indexOf(id) >= 0) { var x = D[id]; L.push({ id: id, sp: x.sp, n: x.n, d: x.d[t] || '', p: x.p[t] }); } });
      acList(t).forEach(function (a) { if (sel.indexOf(a[0]) >= 0) L.push({ id: a[0], sp: '에어컨', n: '천장형 시스템에어컨 · ' + a[1], d: a[2] + ' · 냉방 전용 · 리모컨 실내기 1대당 1개 · 기본 배관(거실 · 안방)은 빠짐', p: a[3] }); });
      L.forEach(function (x) { x.c = Math.round(x.p * 0.1); x.r = x.p - x.c; });
      var sum = L.reduce(function (a, x) { return a + x.p; }, 0), c = L.reduce(function (a, x) { return a + x.c; }, 0);
      return { lines: L, sum: sum, c: c, r: sum - c, sel: sel };
    },
    presets: function (t) {
      var all = ORDER.filter(function (id) { return D[id].p[t] && id !== 'lt1' && id !== 'md2' && id !== 'ev1'; });
      var acs = acList(t), top = acs[acs.length - 1], gen = acs.filter(function (a) { return a[1] === '일반형'; }).pop();
      return { full: all.concat([top[0]]), basic: [gen[0], 'fr', 'ih', 'dw'] };
    },
    encode: function (t, sel) { return 't=' + encodeURIComponent(t) + '&o=' + O.normalize(t, sel).join('.'); },
    decode: function (q) { var m = /[?&]t=([^&#]+)/.exec(q), o = /[?&]o=([^&#]*)/.exec(q); var t = m ? decodeURIComponent(m[1]) : ''; if (T.indexOf(t) < 0) return null; return { t: t, sel: O.normalize(t, o && o[1] ? o[1].split('.') : []) }; },
    won: won, man: man,
    // A4 견적서 (794×1123)
    sheet: function (t, sel, meta) {
      meta = meta || {}; var R = O.lines(t, sel), esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]; }); };
      var d = new Date(), ds = d.getFullYear() + '년 ' + (d.getMonth() + 1) + '월 ' + d.getDate() + '일';
      var small = R.lines.length > 13;
      return '<div class="oq"><style>' +
        '.oq{width:794px;height:1123px;overflow:hidden;margin:0 auto;background:#fff;color:#16203A;font-family:"Noto Sans KR","Apple SD Gothic Neo",Arial,sans-serif;font-size:11px;line-height:1.45;padding:32px 38px 26px;box-sizing:border-box;position:relative}' +
        '.oq p{margin:0}.oq .qtop{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #16203A;padding-bottom:8px}' +
        '.oq .qey{font-size:10.5px;letter-spacing:.12em;color:#8A6534;font-weight:700}.oq h1{font-family:"Noto Serif KR",Georgia,serif;font-size:22px;margin:2px 0 0}' +
        '.oq .qmeta{text-align:right;font-size:11.5px;color:#444;line-height:1.6}' +
        '.oq .qbig{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:6px;margin-top:10px}.oq .qbig div{background:#F4EFE5;border-radius:7px;padding:7px 9px}.oq .qbig b{display:block;font-family:"Noto Serif KR",Georgia,serif;font-size:16px}.oq .qbig span{font-size:10px;color:#6B5B45;font-weight:700}.oq .qbig .qk{background:#16203A;color:#F4F1EA}.oq .qbig .qk span{color:#F2C14E}' +
        '.oq h2{font-size:12.5px;margin:12px 0 4px}' +
        '.oq table{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums}.oq th,.oq td{border-bottom:1px solid #DDD6C8;padding:' + (small ? '3px 5px' : '4.5px 5px') + ';text-align:left;vertical-align:top}.oq th{background:#16203A;color:#F4F1EA}' +
        '.oq td.qn{text-align:right;white-space:nowrap}.oq td .qsm{display:block;font-size:' + (small ? '8.6px' : '9.3px') + ';color:#6B6F78;line-height:1.35}.oq tr.qtot td{background:#FBE3A6;font-weight:800;font-size:12px}' +
        '.oq .qpay{display:grid;grid-template-columns:1.2fr 1fr;gap:12px;margin-top:10px}.oq .qacc{background:#16203A;color:#F4F1EA;border-radius:7px;padding:8px 11px}.oq .qacc b{font-size:13px;color:#F2C14E}.oq .qwarn{border:1.5px solid #B42318;border-radius:7px;padding:7px 10px;color:#7A1A12;font-weight:700}' +
        '.oq ul{margin:4px 0 0;padding-left:16px}.oq li{margin:1px 0;font-size:10px}.oq .qfine{position:absolute;left:38px;right:38px;bottom:22px;font-size:9px;color:#6B6F78;line-height:1.4}.oq .qnone{padding:30px;text-align:center;color:#6B6F78;font-size:13px;border:1px dashed #CFC6B5;border-radius:8px}' +
        '@page{size:A4;margin:0}</style>' +
        '<div class="qtop"><div><p class="qey">상동역 롯데캐슬 시그니처 · 추가선택품목 (유상옵션)</p><h1>우리 집 옵션 견적서</h1></div><div class="qmeta">작성일 ' + ds + '<br>' + (meta.unit ? esc(meta.unit) + ' · ' : '') + t + ' 타입' + (meta.cust ? ' · 고객 ' + esc(meta.cust) : '') + '<br>담당 ' + esc(meta.who || '') + ' ' + esc(meta.tel || '') + '</div></div>' +
        '<div class="qbig"><div><span>타입</span><b>' + t + '</b></div><div><span>고른 품목</span><b>' + R.lines.length + '개</b></div><div><span>계약 시 10%</span><b>' + won(R.c) + '원</b></div><div class="qk"><span>옵션 합계 (부가세 포함)</span><b>' + won(R.sum) + '원</b></div></div>' +
        '<h2>고른 품목 · 공고 공급금액 기준</h2>' +
        (R.lines.length ? '<table><tr><th style="width:64px">공간</th><th>품목 · 들어가는 것</th><th style="width:96px;text-align:right">공급금액</th><th style="width:84px;text-align:right">계약 시 10%</th><th style="width:96px;text-align:right">입주지정일 90%</th></tr>' +
          R.lines.map(function (x) { return '<tr><td>' + esc(x.sp) + '</td><td><b>' + esc(x.n) + '</b><span class="qsm">' + esc(x.d) + '</span></td><td class="qn">' + won(x.p) + '</td><td class="qn">' + won(x.c) + '</td><td class="qn">' + won(x.r) + '</td></tr>'; }).join('') +
          '<tr class="qtot"><td colspan="2">합계 (부가세 포함 · 취득세 별도)</td><td class="qn">' + won(R.sum) + '</td><td class="qn">' + won(R.c) + '</td><td class="qn">' + won(R.r) + '</td></tr></table>'
          : '<div class="qnone">아직 고른 품목이 없습니다</div>') +
        '<div class="qpay"><div><h2 style="margin-top:0">내는 방법</h2><div class="qacc"><b>옵션 계약금 10% · ' + O.ACC.bank + ' ' + O.ACC.no + '</b><br>예금주 ' + O.ACC.holder + ' · 입금자명 동호수+이름 (예: 101동 301호 홍길동 → 1010301홍길동)<br>잔금 90%: 입주지정일 · 계약 때 세대별 가상계좌 따로 부여</div>' +
        '<div class="qwarn" style="margin-top:6px">분양대금 계좌(' + O.ACC.sale + ')와 다른 계좌입니다. 입금 전에 꼭 확인하세요.</div></div>' +
        '<div><h2 style="margin-top:0">꼭 알아 두세요</h2><ul><li>계약 후 변경 · 해제가 안 됩니다 (자재 선발주 마감공사)</li><li>옵션 계약은 아파트 공급계약과 따로 하며 판매 일정은 별도로 알립니다</li><li>부가세 포함 · 취득세 별도 (입주 후 부과될 수 있음)</li><li>설치 위치는 정해져 있고 계약자가 바꿀 수 없습니다</li><li>현금 · 수표 · 신용카드 납부 불가 · 무통장 입금 또는 계좌이체만</li><li>모델은 품절 · 단종 · 성능 개선 시 같은 수준으로 바뀔 수 있습니다</li><li>고르지 않은 품목은 기본 사양으로 시공됩니다</li></ul></div></div>' +
        '<p class="qfine">※ 이 견적서는 입주자모집공고 추가선택품목(유상옵션) 공급금액으로 계산한 참고용이며 계약서가 아닙니다. 최종 금액과 사양은 옵션 공급계약서와 견본주택에서 확인합니다. 시스템에어컨은 냉방 전용이며 실외기 위치는 세대마다 다르고 실내기 위치는 조정될 수 있습니다. 전열교환기 · 에어컨 · 안방 드레스룸(84C · 84D)은 안 중 하나만 고릅니다.</p></div>';
    }
  };
})();
