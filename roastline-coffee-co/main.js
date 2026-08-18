(function(){
  "use strict";

  /* ---------- year ---------- */
  var yearEl = document.getElementById('year');
  if(yearEl){ yearEl.textContent = new Date().getFullYear(); }

  /* ---------- mobile nav toggle ---------- */
  var nav = document.getElementById('siteNav');
  var navToggle = document.getElementById('navToggle');
  if(navToggle && nav){
    navToggle.addEventListener('click', function(){
      var open = nav.classList.toggle('menu-open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // close menu when a link is tapped
    nav.querySelectorAll('.nav-links a').forEach(function(a){
      a.addEventListener('click', function(){
        nav.classList.remove('menu-open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- menu tabs ---------- */
  var tabs = document.querySelectorAll('.tab');
  var panels = document.querySelectorAll('.menu-panel');
  tabs.forEach(function(tab){
    tab.addEventListener('click', function(){
      var target = tab.getAttribute('data-tab');
      tabs.forEach(function(t){ t.classList.remove('active'); });
      tab.classList.add('active');
      panels.forEach(function(p){
        p.classList.toggle('active', p.getAttribute('data-panel') === target);
      });
    });
  });

  /* ---------- roast progress bar ---------- */
  var progress = document.getElementById('roastProgress');
  function updateProgress(){
    if(!progress) return;
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progress.style.width = Math.min(100, Math.max(0, pct)) + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ---------- back to top ---------- */
  var backToTop = document.getElementById('backToTop');
  function toggleBackToTop(){
    if(!backToTop) return;
    backToTop.classList.toggle('show', (window.scrollY || document.documentElement.scrollTop) > 600);
  }
  window.addEventListener('scroll', toggleBackToTop, { passive: true });
  toggleBackToTop();
  if(backToTop){
    backToTop.addEventListener('click', function(){
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if('IntersectionObserver' in window && revealEls.length){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in-view'); });
  }

  /* ---------- nav shrink on scroll ---------- */
  var lastY = 0;
  window.addEventListener('scroll', function(){
    if(!nav) return;
    var y = window.scrollY || document.documentElement.scrollTop;
    nav.style.boxShadow = y > 10 ? '0 4px 20px rgba(42,27,18,0.08)' : 'none';
    lastY = y;
  }, { passive: true });

  /* ---------- newsletter form (demo only, no backend) ---------- */
  var form = document.getElementById('signupForm');
  var note = document.getElementById('formNote');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var input = document.getElementById('emailInput');
      if(input && input.value){
        note.textContent = "You're on the list — first notes land next roast day.";
        form.reset();
      }
    });
  }

})();
