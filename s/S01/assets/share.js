/* 보내기 창 (카카오톡 · 문자 · 다른 앱 · 링크 복사) + 카카오톡 안 브라우저 → 크롬에서 열기
   SHARE.open({title, text, url})  ·  SHARE.inApp()  ·  SHARE.external(url)  ·  SHARE.banner(msg) */
(function () {
  var ua = navigator.userAgent || '', isAnd = /Android/i.test(ua), isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var inKakao = /KAKAOTALK/i.test(ua), inApp = inKakao || /NAVER|Instagram|FBAN|FBAV|Line\/|DaumApps|everytimeApp|SamsungBrowser\/[0-9.]+ .*CrossApp/i.test(ua) || (isAnd && /; wv\)/.test(ua));
  function css() {
    if (document.getElementById('shcss')) return;
    var s = document.createElement('style'); s.id = 'shcss';
    s.textContent = '.shov{position:fixed;inset:0;z-index:9999;background:rgba(12,17,28,.55);display:flex;align-items:flex-end;justify-content:center;font-family:"Noto Sans KR","Apple SD Gothic Neo",sans-serif;word-break:keep-all}' +
      '.shbox{background:#fff;color:#0F1729;width:100%;max-width:520px;border-radius:18px 18px 0 0;padding:16px 16px calc(16px + env(safe-area-inset-bottom,0px));box-shadow:0 -10px 40px rgba(0,0,0,.25);animation:shup .2s ease-out}' +
      '@keyframes shup{from{transform:translateY(40px);opacity:.4}to{transform:none;opacity:1}}' +
      '.shbox h3{margin:0;font-size:17px}.shbox .shs{margin:4px 0 0;font-size:13px;color:#5E6677;line-height:1.5}' +
      '.shg{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:14px}' +
      '.shg button,.shg a{display:flex;flex-direction:column;align-items:center;gap:6px;border:none;background:none;font:inherit;font-size:13px;font-weight:700;color:#0F1729;text-decoration:none;cursor:pointer;padding:4px 0}' +
      '.shg i{width:54px;height:54px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-style:normal;font-size:24px}' +
      '.shg .k i{background:#FEE500;color:#3A1D1D}.shg .m i{background:#34C759;color:#fff}.shg .o i{background:#E9E5DD}.shg .c i{background:#0F1729;color:#F2C14E}' +
      '.shl{margin-top:12px;background:#F6F3EE;border:1px solid #E4DED2;border-radius:10px;padding:9px 11px;font-size:12.5px;color:#333;word-break:break-all;user-select:all;-webkit-user-select:all;max-height:84px;overflow:auto}' +
      '.shx{width:100%;margin-top:12px;min-height:48px;border-radius:12px;border:1.5px solid #CFC6B5;background:#fff;font:inherit;font-weight:700;font-size:15px;color:#0F1729}' +
      '.shtoast{position:fixed;left:50%;bottom:calc(28px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);background:#0F1729;color:#fff;padding:12px 18px;border-radius:12px;z-index:10000;font-size:14px;max-width:90vw;text-align:center;font-family:"Noto Sans KR",sans-serif}' +
      '.shban{position:sticky;top:0;z-index:9998;display:flex;gap:10px;align-items:center;justify-content:space-between;background:#FEE500;color:#3A1D1D;padding:10px 14px;font:700 13.5px/1.4 "Noto Sans KR",sans-serif}' +
      '.shban button{flex:none;border:none;background:#3A1D1D;color:#FEE500;font:inherit;padding:8px 12px;border-radius:9px;cursor:pointer}.shban .x{background:transparent;color:#3A1D1D;padding:8px 4px}';
    document.head.appendChild(s);
  }
  function toast(m) { css(); var t = document.createElement('div'); t.className = 'shtoast'; t.textContent = m; document.body.appendChild(t); setTimeout(function () { t.remove(); }, 3200); }
  function copy(txt) {
    return new Promise(function (res) {
      function old() { try { var ta = document.createElement('textarea'); ta.value = txt; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:-1000px;opacity:0'; document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, txt.length); var ok = document.execCommand('copy'); ta.remove(); res(ok); } catch (e) { res(false); } }
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(txt).then(function () { res(true); }, old); else old();
    });
  }
  function external(url) {
    url = url || location.href;
    if (inKakao) { location.href = 'kakaotalk://web/openExternal?url=' + encodeURIComponent(url); return; }
    if (isAnd) { location.href = 'intent://' + url.replace(/^https?:\/\//, '') + '#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=' + encodeURIComponent(url) + ';end'; return; }
    toast('오른쪽 위 메뉴에서 ‘사파리로 열기’를 눌러 주세요');
  }
  var S = window.SHARE = {
    inApp: function () { return inApp; }, inKakao: function () { return inKakao; }, external: external, toast: toast, copy: copy,
    open: function (o) {
      css(); var title = o.title || '보내기', text = o.text || '', url = o.url || location.href, full = text ? text + '\n' + url : url;
      var canNative = !!navigator.share && !inApp;
      var ov = document.createElement('div'); ov.className = 'shov';
      ov.innerHTML = '<div class="shbox" role="dialog" aria-label="' + title + '"><h3>' + title + '</h3><p class="shs">' + (o.sub || '보낼 방법을 고르세요') + '</p><div class="shg">' +
        '<button class="k" data-s="kakao"><i>💬</i>카카오톡</button><button class="m" data-s="sms"><i>✉</i>문자</button>' +
        (canNative ? '<button class="o" data-s="native"><i>⋯</i>다른 앱</button>' : '<button class="o" data-s="ext"><i>🌐</i>크롬에서 열기</button>') +
        '<button class="c" data-s="copy"><i>🔗</i>링크 복사</button></div><div class="shl">' + url.replace(/</g, '&lt;') + '</div><button class="shx" data-s="x">닫기</button></div>';
      function close() { ov.remove(); }
      ov.addEventListener('click', function (e) {
        if (e.target === ov) return close();
        var b = e.target.closest('[data-s]'); if (!b) return; var k = b.getAttribute('data-s');
        if (k === 'x') return close();
        if (k === 'sms') { location.href = 'sms:' + (isIOS ? '&' : '?') + 'body=' + encodeURIComponent(full); close(); return; }
        if (k === 'native' || (k === 'kakao' && canNative)) {
          navigator.share({ title: title, text: text, url: url }).catch(function () {}); close();
          if (k === 'kakao') setTimeout(function () { toast('목록에서 카카오톡을 고르세요'); }, 300); return;
        }
        if (k === 'kakao') { copy(full).then(function (ok) { close(); toast(ok ? (inKakao ? '복사했습니다 · 보낼 대화방에 붙여 넣으세요' : '복사했습니다 · 카카오톡 대화방에 붙여 넣으세요') : '아래 주소를 길게 눌러 복사해 주세요'); if (ok && !inKakao && (isAnd || isIOS)) setTimeout(function () { location.href = 'kakaotalk://'; }, 900); }); return; }
        if (k === 'ext') { close(); external(location.href); return; }
        if (k === 'copy') { copy(full).then(function (ok) { toast(ok ? '링크를 복사했습니다' : '아래 주소를 길게 눌러 복사해 주세요'); if (ok) close(); }); }
      });
      document.body.appendChild(ov);
    },
    banner: function (msg) {
      if (!inApp || document.querySelector('.shban')) return; css();
      var b = document.createElement('div'); b.className = 'shban';
      b.innerHTML = '<span>' + (msg || '카카오톡 안에서는 저장 · 인쇄가 안 될 수 있어요') + '</span><span style="display:flex;gap:4px"><button type="button" data-e>크롬에서 열기</button><button type="button" class="x" aria-label="닫기">✕</button></span>';
      b.querySelector('[data-e]').onclick = function () { external(location.href); };
      b.querySelector('.x').onclick = function () { b.remove(); };
      document.body.insertBefore(b, document.body.firstChild);
    }
  };
})();
