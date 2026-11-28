/* 📥 휴대폰에 보관 · 상담사가 보낸 자료 링크(?t=…)로 열었을 때만 화면 아래에 나옴
   고객이 직접 이름 · 번호 · 동의를 넣으면 담당 상담사의 고객 명단과 동의 기록에 남습니다(입력 안 해도 자료는 그대로 봄).
   동의: [필수] 개인정보 수집 · 이용 / [선택] 분양 홍보 · 판매 권유 목적 이용 / [선택] 광고성 정보 수신(문자 · 카톡 · 전화, 기본 꺼짐) */
(function () {
  'use strict';
  var m = /[?&]t=([A-Za-z0-9-]+)/.exec(location.search); if (!m) return; var T = m[1], DEMO = /^demo/.test(T);
  var v = function (s) { return /^%%/.test(s) ? '' : s; };
  var API = v('https://script.google.com/macros/s/AKfycbw5Klo1YLrsJe_aLt5TnMqTTDV8JXAOFtrUd53f0x1ABgoE8t2qYG9IAcMGrh9XkyUi/exec'), WHO = v('담당 상담사 김성태') || '담당 상담사', TEL = v('010-8315-9602') || v('010-8315-9602'), CVER = v('CV-20261124') || 'CV-20261123', RET = v('수집일부터 6개월 (삭제를 요청하시면 바로 파기)') || '수집일부터 6개월 (삭제를 요청하시면 바로 파기)', OP = v('디어 에듀테크') || '디어 에듀테크';
  var KEY = 'sig-kept-' + T;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (x) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[x]; }); }
  function css() { var s = document.createElement('style');
    s.textContent = '.kp{margin:28px auto 96px;max-width:640px;padding:20px 18px;border-radius:22px;border:2px solid #2E9E6B;background:var(--surface,#fff);color:var(--ink,#0F1729);font-size:17px;line-height:1.55;box-sizing:border-box}.kp h2{margin:0;font-size:23px}.kp .kps{margin:6px 0 0;color:var(--muted,#5E6677)}' +
      '.kp label.kf{display:grid;gap:6px;margin-top:12px;font-weight:700}.kp input[type=text],.kp input[type=tel]{font:inherit;font-size:20px;padding:12px 14px;border-radius:12px;border:1.5px solid #C9C2B4;min-height:54px;width:100%;box-sizing:border-box}' +
      '.kp .kck{display:flex;gap:10px;align-items:flex-start;margin-top:12px;font-size:16px}.kp .kck input{width:26px;height:26px;flex:0 0 26px;margin-top:2px}.kp .kmd{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0 0 36px}.kp .kmd label{display:flex;gap:6px;align-items:center;min-height:44px;padding:0 12px;border:1.5px solid #C9C2B4;border-radius:12px}.kp .kmd input{width:22px;height:22px}' +
      '.kp details{margin-top:10px;font-size:14px;color:var(--muted,#5E6677)}.kp details summary{min-height:44px;display:flex;align-items:center;cursor:pointer}.kp ul{margin:4px 0 0;padding-left:18px}' +
      '.kp .kgo{margin-top:16px;width:100%;min-height:60px;border:0;border-radius:16px;background:#2E9E6B;color:#fff;font:inherit;font-size:19px;font-weight:800;cursor:pointer}.kp .kerr{color:#A4432F;font-weight:700;margin:8px 0 0}.kp .kok{font-size:20px;font-weight:800;color:#0F6B4F}.kp .kbt{display:grid;gap:8px;margin-top:12px}.kp .kbt a,.kp .kbt button{min-height:52px;border-radius:14px;border:1.5px solid #C9C2B4;background:#fff;color:#0F1729;font:inherit;font-weight:700;display:flex;align-items:center;justify-content:center;text-decoration:none}';
    document.head.appendChild(s); }
  function box() { var b = document.getElementById('kp'); if (b) return b; b = document.createElement('section'); b.id = 'kp'; b.className = 'kp'; (document.querySelector('main') || document.body).appendChild(b); return b; }
  function done(o) {
    var b = box(); b.innerHTML = '<p class="kok">✓ 휴대폰에 보관했습니다</p><p>담당 ' + esc(WHO) + ' 상담사에게 받으셨다고 전달했습니다. 이 화면을 <b>홈 화면에 추가</b>하거나 카톡 ‘나와의 채팅’에 보내 두시면 언제든 다시 보실 수 있습니다.</p>' +
      (o.ads ? '<p class="kps">광고성 정보 수신 동의 · ' + esc(o.ads) + ' · ' + esc(o.at || '') + ' (' + esc(o.ver || CVER) + ')<br>원하지 않으시면 언제든 무료로 끊으실 수 있습니다.</p>' : '<p class="kps">광고성 정보는 받지 않으십니다. 요청하신 자료와 상담 연락만 드립니다.</p>') +
      '<div class="kbt"><button type="button" id="kshare">💬 카톡 · 문자로 나에게 보내 두기</button>' + (TEL ? '<a href="tel:' + esc(TEL.replace(/\D/g, '')) + '">📞 ' + esc(WHO) + ' 상담사에게 전화</a>' : '') + '<a href="../optout/">수신거부 · 개인정보 삭제 요청</a></div>';
    var sb = b.querySelector('#kshare'); if (sb) sb.onclick = function () { var t = document.title + ' ' + location.href; if (navigator.share) navigator.share({ title: document.title, text: t }).catch(function () { }); else { try { navigator.clipboard.writeText(t); alert('주소를 복사했습니다'); } catch (e) { } } };
  }
  function form() {
    var b = box();
    b.innerHTML = '<h2>📥 이 자료를 휴대폰에 보관하시겠어요?</h2><p class="kps">보관하시면 언제든 다시 보시고, 담당 상담사가 고르신 호실의 계약 가능 여부를 알려 드릴 수 있습니다. <b>안 하셔도 자료는 그대로 보실 수 있습니다.</b></p>' +
      '<label class="kf">성함 (호칭도 괜찮아요)<input type="text" id="kname" autocomplete="name" maxlength="20" placeholder="예: 김민수"></label>' +
      '<label class="kf">휴대폰 번호<input type="tel" id="ktel" inputmode="tel" autocomplete="tel" placeholder="010-0000-0000"></label>' +
      '<label class="kck"><input type="checkbox" id="kack"><span><b>[필수]</b> 개인정보 수집 · 이용에 동의합니다 (자료 보관 · 계약 가능 여부 회신 · 상담 연락)</span></label>' +
      '<details><summary>개인정보 수집 · 이용 안내 보기</summary><ul><li>받는 사람(처리자): ' + esc(WHO) + (TEL ? ' (' + esc(TEL) + ')' : '') + ' · 상동역 롯데캐슬 시그니처 분양 상담</li><li>항목: 성함, 휴대폰 번호, 받은 자료와 관심 동 · 타입 · 층</li><li>보유: ' + esc(RET) + ' · 제3자 제공 없음 · 시스템 운영 위탁: ' + esc(OP) + ' (구글 서버, 국외)</li><li>동의하지 않으셔도 자료는 그대로 보실 수 있고, 불이익은 없습니다.</li></ul></details>' +
      '<label class="kck"><input type="checkbox" id="kpro"><span><b>[선택]</b> 분양 홍보 · 판매 권유 목적 이용 동의 (미계약 호실 · 분양 조건 · 행사 안내에 관심 동 · 타입 · 층을 이용)</span></label>' +
      '<label class="kck"><input type="checkbox" id="kad"><span><b>[선택]</b> <b>광고성 정보 수신 동의</b> · 받을 방법을 골라 주세요</span></label><div class="kmd"><label><input type="checkbox" id="ksms" disabled> 문자</label><label><input type="checkbox" id="kkakao" disabled> 카카오톡</label><label><input type="checkbox" id="kcall" disabled> 전화</label></div>' +
      '<p class="kps" style="font-size:14px">광고는 (광고) 표시와 무료 수신거부 방법을 넣어 밤 9시 ~ 아침 8시를 피해 보내며, 2년마다 동의를 다시 여쭙니다. 선택 동의는 안 하셔도 됩니다.</p>' +
      '<button type="button" class="kgo" id="kgo">휴대폰에 보관하기</button><p class="kerr" id="kerr"></p>';
    var ad = b.querySelector('#kad'), md = ['ksms', 'kkakao', 'kcall'].map(function (i) { return b.querySelector('#' + i); });
    ad.onchange = function () { md.forEach(function (x) { x.disabled = !ad.checked; if (!ad.checked) x.checked = false; }); };
    var tel = b.querySelector('#ktel'); tel.addEventListener('input', function () { var d = tel.value.replace(/\D/g, '').slice(0, 11); tel.value = d.length > 7 ? d.slice(0, 3) + '-' + d.slice(3, d.length - 4) + '-' + d.slice(-4) : d.length > 3 ? d.slice(0, 3) + '-' + d.slice(3) : d; });
    b.querySelector('#kgo').onclick = function () {
      var name = b.querySelector('#kname').value.trim(), t = tel.value.replace(/\D/g, ''), er = b.querySelector('#kerr');
      if (!name) { er.textContent = '성함을 넣어 주세요'; return; } if (!/^01\d{8,9}$/.test(t)) { er.textContent = '휴대폰 번호를 확인해 주세요'; return; }
      if (!b.querySelector('#kack').checked) { er.textContent = '[필수] 개인정보 수집 · 이용에 동의해 주셔야 보관할 수 있습니다'; return; }
      if (ad.checked && !md.some(function (x) { return x.checked; })) { er.textContent = '광고를 받으실 방법(문자 · 카카오톡 · 전화)을 골라 주세요 · 원하지 않으시면 광고 동의를 꺼 주세요'; return; }
      if (!confirm(tel.value + ' 번호가 맞으세요?')) return;
      var cs = { ver: CVER, ack: true, promo: b.querySelector('#kpro').checked, sms: md[0].checked, kakao: md[1].checked, tel: md[2].checked, night: false };
      var ads = [cs.sms ? '문자' : '', cs.kakao ? '카톡' : '', cs.tel ? '전화' : ''].filter(Boolean).join(' · ');
      var fin = function (j) { var o = { at: (j && j.at) || new Date().toLocaleString('ko-KR'), ads: ads, ver: CVER }; try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) { } done(o); };
      if (DEMO || !API) { fin(null); return; }
      this.disabled = true; this.textContent = '보관하는 중…'; var me = this;
      fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ op: 'dlvreg', t: T, name: name, tel: t, consent: cs }) }).then(function (r) { return r.json(); })
        .then(function (j) { if (j && j.ok) fin(j); else { me.disabled = false; me.textContent = '휴대폰에 보관하기'; er.textContent = j && j.why === 'token' ? '링크가 오래되었습니다 · 상담사에게 다시 받아 주세요' : '잠시 후 다시 눌러 주세요'; } })
        .catch(function () { me.disabled = false; me.textContent = '휴대폰에 보관하기'; er.textContent = '인터넷 연결을 확인해 주세요'; });
    };
  }
  function start() { css(); var k = null; try { k = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { } if (k) done(k); else form(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(start, 300); }); else setTimeout(start, 300);
})();
