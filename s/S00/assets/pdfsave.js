/* A4 화면(794×1123)을 PDF 파일로 저장 · PDFSAVE.save(htmlList|elements, filename, {onStep}) → Promise<Blob> */
(function () {
  var base = (document.currentScript && document.currentScript.src) ? new URL('./', document.currentScript.src).href : new URL('../assets/', location.href).href;
  function load(src, test) { return new Promise(function (res, rej) { if (test()) return res(); var s = document.createElement('script'); s.src = base + src; s.onload = function () { res(); }; s.onerror = rej; document.head.appendChild(s); }); }
  function libs() { return Promise.all([load('html2canvas.min.js', function () { return !!window.html2canvas; }), load('jspdf.umd.min.js', function () { return !!(window.jspdf && window.jspdf.jsPDF); })]); }
  function download(blob, name) {
    var u = URL.createObjectURL(blob), a = document.createElement('a'); a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(u); }, 60000);
  }
  window.PDFSAVE = {
    libs: libs, download: download,
    save: function (pages, filename, o) {
      o = o || {};
      var box = document.createElement('div'); box.style.cssText = 'position:absolute;left:-12000px;top:0;width:794px;pointer-events:none';
      document.body.appendChild(box);
      return libs().then(function () { return document.fonts && document.fonts.ready ? document.fonts.ready : null; }).then(function () {
        var pdf = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true });
        var chain = Promise.resolve();
        pages.forEach(function (pg, i) {
          chain = chain.then(function () {
            if (o.onStep) o.onStep(i + 1, pages.length);
            box.innerHTML = ''; var el;
            if (typeof pg === 'string') { box.innerHTML = pg; el = box.firstElementChild; } else { el = pg.cloneNode(true); el.style.zoom = 1; box.appendChild(el); }
            var imgs = [].slice.call(el.querySelectorAll('img'));
            return Promise.all(imgs.map(function (im) { return im.complete ? 0 : new Promise(function (r) { im.onload = im.onerror = r; }); })).then(function () {
              return window.html2canvas(el, { scale: 2, backgroundColor: '#ffffff', useCORS: true, logging: false, width: 794, height: 1123, windowWidth: 1100, scrollX: 0, scrollY: 0 });
            }).then(function (cv) {
              if (i) pdf.addPage('a4', 'portrait');
              pdf.addImage(cv.toDataURL('image/jpeg', 0.9), 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
            });
          });
        });
        return chain.then(function () { var blob = pdf.output('blob'); download(blob, filename); return blob; });
      }).finally(function () { box.remove(); });
    }
  };
})();
