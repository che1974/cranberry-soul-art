/* ===== Language Toggle ===== */
(function () {
  const STORAGE_KEY = 'memorial-lang';
  const langToggle = document.getElementById('langToggle');
  const langOptions = langToggle.querySelectorAll('.lang-option');

  function setLang(lang) {
    document.querySelectorAll('[data-ua][data-en]').forEach(function (el) {
      var val = el.getAttribute('data-' + lang);
      if (val.indexOf('<') !== -1) { el.innerHTML = val; } else { el.textContent = val; }
    });
    langOptions.forEach(function (opt) {
      opt.classList.toggle('active', opt.dataset.lang === lang);
    });
    document.documentElement.lang = lang === 'ua' ? 'uk' : 'en';
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }
  }

  langToggle.addEventListener('click', function () {
    var current = localStorage.getItem(STORAGE_KEY) || 'ua';
    setLang(current === 'ua' ? 'en' : 'ua');
  });

  // Init
  var saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* ignore */ }
  setLang(saved || 'ua');
})();


/* ===== Gallery Lightbox ===== */
(function () {
  var lightbox = document.getElementById('lightbox');
  var lightboxImage = document.getElementById('lightboxImage');
  var lightboxCounter = document.getElementById('lightboxCounter');
  var items = Array.from(document.querySelectorAll('.gallery-item img'));
  var currentIndex = 0;

  function open(index) {
    currentIndex = index;
    show();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function show() {
    lightboxImage.classList.remove('loaded');
    var src = items[currentIndex].src;
    lightboxImage.src = src;
    lightboxImage.onload = function () {
      lightboxImage.classList.add('loaded');
    };
    // If already cached
    if (lightboxImage.complete) {
      lightboxImage.classList.add('loaded');
    }
    lightboxCounter.textContent = (currentIndex + 1) + ' / ' + items.length;
    preloadAdjacent();
  }

  function prev() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    show();
  }

  function next() {
    currentIndex = (currentIndex + 1) % items.length;
    show();
  }

  function preloadAdjacent() {
    var prevIdx = (currentIndex - 1 + items.length) % items.length;
    var nextIdx = (currentIndex + 1) % items.length;
    new Image().src = items[prevIdx].src;
    new Image().src = items[nextIdx].src;
  }

  // Click on gallery images
  items.forEach(function (img, i) {
    img.parentElement.addEventListener('click', function () {
      open(i);
    });
  });

  // Controls
  document.getElementById('lightboxClose').addEventListener('click', close);
  document.getElementById('lightboxPrev').addEventListener('click', prev);
  document.getElementById('lightboxNext').addEventListener('click', next);

  // Click backdrop to close
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox || e.target.classList.contains('lightbox-image-wrap')) {
      close();
    }
  });

  // Keyboard
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  // Touch swipe
  var touchStartX = 0;
  var touchEndX = 0;

  lightbox.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', function (e) {
    touchEndX = e.changedTouches[0].screenX;
    var diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
  }, { passive: true });
})();


/* ===== Smooth scroll for nav links ===== */
(function () {
  document.querySelectorAll('.nav a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();


/* ===== Social share links ===== */
(function () {
  var url = encodeURIComponent(window.location.href);
  var title = encodeURIComponent(document.title);
  var text = encodeURIComponent('Пам\'яті Лілії Козлової — 102 малюнки, у яких вона продовжує жити');

  var fb = document.querySelector('.share-facebook');
  var tw = document.querySelector('.share-twitter');
  var tg = document.querySelector('.share-telegram');
  var wa = document.querySelector('.share-whatsapp');
  var cp = document.querySelector('.share-copy');

  if (fb) fb.href = 'https://www.facebook.com/sharer/sharer.php?u=' + url;
  if (tw) tw.href = 'https://x.com/intent/tweet?url=' + url + '&text=' + text;
  if (tg) tg.href = 'https://t.me/share/url?url=' + url + '&text=' + text;
  if (wa) wa.href = 'https://api.whatsapp.com/send?text=' + text + '%20' + url;

  if (cp) {
    cp.addEventListener('click', function () {
      navigator.clipboard.writeText(window.location.href).then(function () {
        cp.classList.add('copied');
        setTimeout(function () { cp.classList.remove('copied'); }, 2000);
      });
    });
  }
})();
