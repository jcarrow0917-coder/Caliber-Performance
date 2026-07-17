(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var progressBar = document.getElementById('scrollProgress');
  var header = document.getElementById('siteHeader');
  var heroShape = document.getElementById('heroShape');
  var heroBadge = document.getElementById('heroBadge');
  var parallaxImgs = document.querySelectorAll('.parallax-img');

  var ticking = false;

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }

  function update() {
    var scrollY = window.scrollY || window.pageYOffset;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';

    if (scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (!reduceMotion) {
      if (heroShape) {
        heroShape.style.transform = 'translateX(-50%) translateY(' + scrollY * 0.25 + 'px)';
      }
      if (heroBadge) {
        var heroFade = Math.max(0, 1 - scrollY / 500);
        heroBadge.style.transform = 'translateY(' + scrollY * 0.15 + 'px)';
        heroBadge.style.opacity = heroFade;
      }

      var winMid = scrollY + window.innerHeight / 2;
      parallaxImgs.forEach(function (img) {
        var rect = img.getBoundingClientRect();
        var elMid = rect.top + scrollY + rect.height / 2;
        var offset = (winMid - elMid) * 0.08;
        img.style.transform = 'translateY(' + offset + 'px) scale(1.08)';
      });
    }

    ticking = false;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  update();

  var revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-up');

  if ('IntersectionObserver' in window && !reduceMotion) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }
})();
