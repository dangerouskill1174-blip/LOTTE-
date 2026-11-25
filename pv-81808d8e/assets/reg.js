/* 규제지역 · 대출 · 취득세 참고 판단 (상담용) · 기준일이 지나면 운영사가 이 파일 한 곳만 고칩니다.
   REG.isReg(시도, 시군구) · REG.judge({houses, first, own:{sido,sgg}, price}) */
(function () {
  var R = window.REG = {
    asof: '2026-11-23',
    src: '정부 발표 원문 기준 (정책브리핑 2025.10.15 · 2026.6.30, 금융위원회 2025.6.27 · 2025.10.15, 지방세법 · 소득세법 · 부동산 거래신고법). 대출은 은행 심사, 세금은 세무사 확인으로 최종 확정',
    // 근거 자료 (상담 데스크 '근거 자료' 화면 · 고객 화면 출처 줄)
    S: {
      reg1: { t: '서울 전역 · 경기 12곳 투기과열지구 · 조정대상지역 · 토지거래허가구역 지정', o: '정책브리핑 (관계부처 합동)', d: '2025.10.15', u: 'https://www.korea.kr/news/policyNewsView.do?newsId=148950973' },
      reg2: { t: '화성 동탄구 · 용인 기흥구 · 구리시 투기과열지구 · 조정대상지역 추가 지정 (7.1 효력)', o: '정책브리핑 · 국토교통부', d: '2026.06.30', u: 'https://www.korea.kr/news/policyNewsView.do?newsId=148967354' },
      loan1: { t: '수도권 중심 가계부채 관리 강화 방안 (수도권 · 규제지역 주담대 6억 한도 · 다주택자 제한 · 처분 조건 6개월 · 생애최초 LTV 70% · 전입 6개월)', o: '금융위원회 보도자료', d: '2025.06.27', u: 'https://www.fsc.go.kr/no010101/84824' },
      loan2: { t: '대출수요 관리 방안 · 주택가격별 한도(15억 이하 6억 · 25억 이하 4억 · 초과 2억) · 규제지역 LTV 40% · 중도금 · 잔금 경과 규정', o: '금융위원회 정책문답 · 정책브리핑', d: '2025.10.15', u: 'https://fsc.go.kr/po020201/85518' },
      tax1: { t: '지방세법 제11조 · 제13조의2 (주택 취득세율 · 다주택 중과)', o: '국가법령정보센터', d: '현행', u: 'https://www.law.go.kr/법령/지방세법' },
      tax2: { t: '지방세특례제한법 제36조의3 (생애최초 주택 취득세 감면)', o: '국가법령정보센터', d: '현행', u: 'https://www.law.go.kr/법령/지방세특례제한법' },
      tax3: { t: '소득세법 제104조 (분양권 · 다주택 양도소득세율) · 시행령 제155조 · 제156조의3 (일시적 2주택)', o: '국가법령정보센터', d: '현행', u: 'https://www.law.go.kr/법령/소득세법' },
      fund: { t: '부동산 거래신고 등에 관한 법률 시행령 별표 1 (자금조달계획서 제출 대상)', o: '국가법령정보센터', d: '현행', u: 'https://www.law.go.kr/법령/부동산거래신고등에관한법률시행령' },
      gong: { t: '상동역 롯데캐슬 시그니처 입주자모집공고 · 단지 주요정보 (비규제지역 · 전매제한 1년 · 거주의무 없음)', o: '사업주체', d: '2026.08.14', u: 'https://www.applyhome.co.kr' },
      spam: { t: '불법스팸 전송 시 관련 매출액 6% 이하 과징금 · 부당이익 몰수 · 추징 (정보통신망법 개정)', o: '정책브리핑 · 방송미디어통신위원회', d: '2026.03.24', u: 'https://www.korea.kr/news/policyNewsView.do?newsId=148961346' },
      ict: { t: '정보통신망법 제50조 · 시행령 제62조의3 (광고 수신 동의 · (광고) 표시 · 무료 수신거부 · 밤 9시~아침 8시 별도 동의 · 14일 처리 결과 통지 · 2년마다 동의 확인)', o: '국가법령정보센터', d: '현행', u: 'https://www.law.go.kr/법령/정보통신망이용촉진및정보보호등에관한법률' },
      pipa: { t: '개인정보 보호법 제15조 · 제34조 · 시행령 제39조 (수집 · 이용, 유출 시 72시간 안 통지 · 신고)', o: '국가법령정보센터', d: '현행', u: 'https://www.law.go.kr/법령/개인정보보호법' },
      dong: { t: '부천시 행정구역 (3개 구 · 37개 동)', o: '부천시청', d: '2024.01 출범', u: 'https://www.bucheon.go.kr/site/homepage/menu/viewMenu?menuid=148009003' }
    },
    here: { sido: '경기도', sgg: '부천시 원미구', dong: '상동', name: '상동역 롯데캐슬 시그니처' },
    // 조정대상지역 = 투기과열지구 (현재 같은 범위)
    reg: {
      '서울특별시': '*',
      '경기도': ['과천시', '광명시', '하남시', '의왕시', '구리시', '성남시 분당구', '성남시 수정구', '성남시 중원구', '수원시 영통구', '수원시 장안구', '수원시 팔달구', '안양시 동안구', '용인시 수지구', '용인시 기흥구', '화성시 동탄구']
    },
    SIDO: ['서울특별시', '경기도', '인천광역시', '부산광역시', '대구광역시', '광주광역시', '대전광역시', '울산광역시', '세종특별자치시', '강원특별자치도', '충청북도', '충청남도', '전북특별자치도', '전라남도', '경상북도', '경상남도', '제주특별자치도'],
    SGG: {
      '서울특별시': ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'],
      '경기도': ['가평군', '고양시 덕양구', '고양시 일산동구', '고양시 일산서구', '과천시', '광명시', '광주시', '구리시', '군포시', '김포시', '남양주시', '동두천시', '부천시 원미구', '부천시 소사구', '부천시 오정구', '성남시 분당구', '성남시 수정구', '성남시 중원구', '수원시 권선구', '수원시 영통구', '수원시 장안구', '수원시 팔달구', '시흥시', '안산시 단원구', '안산시 상록구', '안성시', '안양시 동안구', '안양시 만안구', '양주시', '양평군', '여주시', '연천군', '오산시', '용인시 기흥구', '용인시 수지구', '용인시 처인구', '의왕시', '의정부시', '이천시', '파주시', '평택시', '포천시', '하남시', '화성시 동탄구', '화성시 만세구', '화성시 병점구', '화성시 효행구'],
      '인천광역시': ['강화군', '검단구', '계양구', '남동구', '미추홀구', '부평구', '서구', '연수구', '영종구', '옹진군', '제물포구']
    },
    BUCHEON: {
      '원미구': ['상동', '상1동', '상2동', '상3동', '중동', '중1동', '중2동', '중3동', '중4동', '약대동', '도당동', '심곡1동', '심곡2동', '심곡3동', '원미1동', '원미2동', '소사동', '역곡1동', '역곡2동', '춘의동'],
      '소사구': ['송내1동', '송내2동', '심곡본동', '심곡본1동', '소사본동', '소사본1동', '괴안동', '역곡3동', '범박동', '옥길동'],
      '오정구': ['오정동', '신흥동', '원종1동', '원종2동', '고강본동', '고강1동', '성곡동']
    }
  };
  R.isReg = function (sido, sgg) {
    var l = R.reg[sido]; if (!l) return false; if (l === '*') return true;
    return l.indexOf(sgg) >= 0;
  };
  R.hereReg = function () { return R.isReg(R.here.sido, R.here.sgg); };
  function eok(v) { return (Math.round(v * 10) / 10) + '억'; }
  // houses: 이 집을 빼고 지금 가진 주택 수(분양권 · 입주권 포함) · first: 생애최초 · own: 가진 집 위치 · price: 분양가(억, 모르면 null)
  R.judge = function (o) {
    var h = o.houses, reg = R.hereReg(), out = [];
    out.push({ k: 'here', t: '이번 집 · ' + R.here.sgg + ' ' + R.here.dong, b: reg ? '조정대상지역 · 투기과열지구' : '비규제지역', tone: reg ? 'warn' : 'ok', src: ['reg1', 'reg2', 'gong'],
      d: [reg ? '규제지역 기준으로 대출 · 세금을 봅니다.' : '조정대상지역 · 투기과열지구 · 토지거래허가구역이 아닙니다 (' + R.asof + ' 기준).', '입주자모집공고: 비규제지역 · 전매제한 1년 · 거주의무 없음 · 재당첨제한 없음.', '수도권이라 수도권 공통 대출 규제(한도 · 다주택 제한 · 처분 조건)는 적용됩니다.'] });
    if (h == null) return out;
    var n = h + 1, tx;
    if (reg) tx = n === 1 ? ['1~3%', '일반세율 (6억 이하 1%, 6억~9억 구간별, 9억 초과 3%)'] : (n === 2 ? ['8%', '조정대상지역 2주택 중과 · 일시적 2주택이면 1~3%'] : ['12%', '조정대상지역 3주택 이상 중과']);
    else tx = n <= 2 ? ['1~3%', n === 1 ? '일반세율 (6억 이하 1%, 6억~9억 구간별, 9억 초과 3%)' : '비조정대상지역 2주택은 일반세율'] : (n === 3 ? ['8%', '비조정대상지역 3주택 중과'] : ['12%', '4주택 이상 중과']);
    var td = [tx[1] + ' · 지방교육세 · 농어촌특별세가 더해집니다.', '분양권은 <b>계약하는 날</b> 가진 주택 수(2020.8.12 이후 취득한 분양권 · 입주권 포함)로 세율이 정해지고, 세금은 잔금 때 냅니다.'];
    if (h === 0 && o.first) td.push('생애최초 취득세 감면(지방세특례제한법 제36조의3)은 금액 · 요건 · 적용 기한을 세무 확인합니다.');
    out.push({ k: 'tax', t: '취득세 · 이 집이 ' + n + '번째 집', b: tx[0], tone: n >= 3 ? 'warn' : 'ok', d: td, src: n === 1 && o.first ? ['tax1', 'tax2'] : ['tax1'] });
    var ld;
    if (h === 0) ld = ['가능', ['LTV ' + (reg ? '40%' : '70%') + (o.first ? ' · 생애최초 70% (수도권 · 규제지역, 6개월 안 전입)' : '') + ' 와 한도 중 작은 금액.', '수도권 주택구입 주담대 한도: 집값 15억 이하 최대 6억 · 15억 초과~25억 4억 · 25억 초과 2억.', '소득 기준 DSR 40% (스트레스 금리 가산) · 은행 심사로 최종 확정.']];
    else if (h === 1) ld = ['조건부 가능', ['기존 집을 <b>6개월 안에 처분</b>하는 조건이면 무주택과 같은 기준(비규제 70%)으로 받습니다.', '처분하지 않고 추가로 사는 경우 수도권 · 규제지역 구입용 주담대는 막혀 있습니다.', '수도권 한도 (15억 이하 최대 6억) · DSR 40%.']];
    else ld = ['제한', ['수도권 · 규제지역에서 2주택 이상 보유자의 추가 주택 구입용 주담대는 금지(LTV 0%)입니다.', '잔금은 자기자금 · 보증금 등으로 계획합니다. 처분 계획이 있으면 처분 뒤 기준으로 다시 봅니다.']];
    ld[1].push('중도금 대출은 한도 규제 대상이 아니고, 잔금대출로 바뀔 때 적용됩니다. 증액 없이 전환하면 중도금 대출 취급 때의 LTV를 적용할 수 있습니다. 중도금 대출 조건은 시행사가 정한 금융기관 기준입니다.');
    out.push({ k: 'loan', t: '잔금대출 · 주담대', b: ld[0], tone: h >= 2 ? 'warn' : (h === 1 ? 'mid' : 'ok'), d: ld[1], src: ['loan1', 'loan2'] });
    if (h >= 1) {
      var ow = o.own || {}, oreg = ow.sido ? R.isReg(ow.sido, ow.sgg) : null, od = [];
      if (ow.sido) od.push('가진 집 위치: ' + ow.sido + ' ' + (ow.sgg || '') + ' → <b>' + (oreg ? '조정대상지역' : '비규제지역') + '</b>');
      if (h === 1) od.push('1주택 + 분양권은 <b>일시적 2주택</b> 특례: 분양권 취득일부터 3년 안에 기존 집을 팔거나, 새 집 완공 뒤 3년 안에 팔고 이사해 1년 이상 살면 비과세를 검토할 수 있습니다 (요건 세무 확인).');
      if (oreg) od.push('조정대상지역 집을 다주택 상태로 팔면 양도세 중과가 적용될 수 있습니다. 처분 순서를 세무사와 먼저 정합니다.');
      od.push('분양권을 되팔면(전매제한 1년 이후) 보유 1년 미만 70%, 그 뒤 60% 양도세율이 적용됩니다.');
      out.push({ k: 'own', t: '지금 가진 집 · 처분 순서', b: oreg ? '규제지역 주택' : (ow.sido ? '비규제지역 주택' : '위치 확인'), tone: oreg ? 'warn' : 'mid', d: od, src: ['tax3', 'loan1'] });
    }
    var pd = o.price != null ? (o.price >= 6 ? '제출 대상 (분양가 ' + eok(o.price) + ')' : '제출 안 함 (6억 미만)') : '6억 이상 호실이면 제출';
    out.push({ k: 'fund', t: '자금조달계획서', b: reg ? '제출 대상' : pd, tone: 'mid', d: [reg ? '규제지역은 금액과 관계없이 제출하고 증빙도 냅니다.' : '비규제지역은 거래가 6억 이상이면 공급계약 신고 때 함께 냅니다.', '예금 · 주식 · 대출 · 증여 등 돈의 출처를 미리 정리해 두면 계약일이 편합니다.'], src: ['fund'] });
    return out;
  };
  // 고른 내용으로 '나의 상태'를 한 줄 · 칸으로 (확정은 은행 · 세무사)
  R.status = function (o, where) {
    var h = o.houses, reg = R.hereReg(); if (h == null) return null;
    var J = R.judge(o), g = function (k) { for (var i = 0; i < J.length; i++) if (J[i].k === k) return J[i]; return null; };
    var hl = ['무주택', '1주택', '2주택', '3주택 이상'][Math.min(h, 3)] + (h === 0 && o.first ? ' · 생애최초' : '');
    var tax = g('tax'), loan = g('loan'), own = g('own'), fund = g('fund');
    var ltv = reg ? 0.4 : 0.7, cap = o.price == null ? 6 : (o.price <= 15 ? 6 : (o.price <= 25 ? 4 : 2));
    var mx = o.price == null ? null : Math.min(cap, Math.floor(o.price * ltv * 10) / 10);
    var amt = mx == null ? '최대 ' + cap + '억 (15억 이하 집)' : '이 호실 최대 약 ' + mx + '억';
    var lv = h === 0 ? 'LTV ' + Math.round(ltv * 100) + '% · ' + amt : (h === 1 ? '6개월 안 기존 집 처분 조건 · ' + amt : '구입용 주담대 제한 · 자기자금');
    var items = [
      ['나', hl + (where ? ' · ' + where : ''), 'mid'],
      ['이번 집', (reg ? '규제지역' : '비규제지역') + ' · 전매제한 1년', reg ? 'warn' : 'ok'],
      ['취득세', tax.b + ' · 이 집이 ' + (h + 1) + '번째 집', tax.tone],
      ['잔금대출', loan.b + ' · ' + lv, loan.tone]
    ];
    if (own) items.push(['가진 집', own.b + (h === 1 ? ' · 일시적 2주택 처분 기한 확인' : ''), own.tone]);
    items.push(['자금조달계획서', fund.b, 'mid']);
    var head = hl + ' 고객님은 상동(' + (reg ? '규제지역' : '비규제지역') + ')에서 취득세 ' + tax.b + ', 잔금대출 ' + (h === 0 ? amt : (h === 1 ? '처분 조건부 ' + amt : '제한')) + ' 구간입니다 (소득 DSR에 따라 줄 수 있음).';
    return { head: head, items: items };
  };
  R.statusHTML = function (st, esc) {
    if (!st) return '';
    esc = esc || function (x) { return x; };
    return '<div class="mys"><p class="myh">나의 상태 한눈에 <span>' + R.asof.replace(/-/g, '.') + ' 공식 발표 기준 · 참고용</span></p><p class="myl">' + esc(st.head) + '</p><div class="myc">' +
      st.items.map(function (x) { return '<div class="' + x[2] + '"><span>' + esc(x[0]) + '</span><b>' + esc(x[1]) + '</b></div>'; }).join('') +
      '</div><p class="myf">확정: 대출은 <b>은행 심사</b>, 세금은 <b>세무사 확인</b>으로 정해집니다. 대출 금액은 분양가 기준 추정이며 잔금 때 시세 · 감정가와 소득(DSR)으로 다시 정해집니다. 상담사는 확정하지 않고 기준을 안내합니다.</p></div>';
  };
  R.css = '.mys{border:2px solid #141B2D;border-radius:16px;padding:14px 16px;background:#fff;margin-top:12px}.myh{font-weight:800;font-size:15px;margin:0}.myh span{font-weight:500;font-size:12px;color:#6A7180;margin-left:6px}' +
    '.myl{font-size:17px;font-weight:700;line-height:1.5;margin:8px 0 0;color:#141B2D}.myc{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin-top:10px}' +
    '.myc div{border-radius:12px;padding:9px 11px;background:#F7F4EE;border-top:4px solid #E8B547}.myc div.ok{border-top-color:#2F8F6A}.myc div.warn{border-top-color:#A4432F}.myc span{display:block;font-size:12px;color:#6A7180;font-weight:700}.myc b{display:block;font-size:15px;line-height:1.4;margin-top:2px;color:#141B2D}' +
    '.myf{font-size:12.5px;color:#3D4454;margin:10px 0 0;background:#FFF6DB;border-radius:8px;padding:6px 9px}.rgd{margin-top:10px}.rgd>summary{cursor:pointer;font-weight:700;font-size:14px;color:#8A5A00;padding:6px 0}';
  (function () { try { if (document.getElementById('reg-css')) return; var st = document.createElement('style'); st.id = 'reg-css'; st.textContent = R.css; (document.head || document.documentElement).appendChild(st); } catch (e) {} })();
  R.srcHTML = function (keys, esc) {
    esc = esc || function (x) { return x; };
    return keys.map(function (k) { var x = R.S[k]; return x ? '<a href="' + x.u + '" target="_blank" rel="noopener">' + esc(x.o) + ' · ' + esc(x.d) + '</a>' : ''; }).filter(Boolean).join(' · ');
  };
})();
