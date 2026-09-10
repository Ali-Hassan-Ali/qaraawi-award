/* جائزة الشيخ إبراهيم بن عثمان القرعاوي — سلوك الموقع العام */
(function () {
  "use strict";

  /* ---------- شريط التنقل عند التمرير ---------- */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 12) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- قائمة الجوال ---------- */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("is-open");
      navToggle.classList.toggle("is-active", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
        navToggle.classList.remove("is-active");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- ظهور العناصر عند التمرير ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- العداد التنازلي لإغلاق التقديم ----------
     ملاحظة: التاريخ المستهدف أدناه (data-target على #countdown) قيمة مبدئية
     إلى حين تحديد الموعد النهائي الفعلي لإغلاق باب الترشح. */
  var countdown = document.getElementById("countdown");
  if (countdown) {
    var target = new Date(countdown.getAttribute("data-target")).getTime();
    var dEl = countdown.querySelector('[data-cd="days"]');
    var hEl = countdown.querySelector('[data-cd="hours"]');
    var mEl = countdown.querySelector('[data-cd="minutes"]');
    var sEl = countdown.querySelector('[data-cd="seconds"]');

    function pad(n) { return String(n).padStart(2, "0"); }

    function tick() {
      var now = Date.now();
      var diff = target - now;
      if (diff <= 0) {
        dEl.textContent = hEl.textContent = mEl.textContent = sEl.textContent = "00";
        return;
      }
      var days = Math.floor(diff / 86400000);
      var hours = Math.floor((diff % 86400000) / 3600000);
      var minutes = Math.floor((diff % 3600000) / 60000);
      var seconds = Math.floor((diff % 60000) / 1000);
      dEl.textContent = pad(days);
      hEl.textContent = pad(hours);
      mEl.textContent = pad(minutes);
      sEl.textContent = pad(seconds);
    }
    tick();
    setInterval(tick, 1000);
  }
})();
