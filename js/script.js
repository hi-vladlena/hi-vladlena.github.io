(function () {
  "use strict";

  var STORAGE_KEY = "vladlena-cv-lang";
  var langEnBtn = document.getElementById("langEn");
  var langRuBtn = document.getElementById("langRu");
  var cvLink = document.getElementById("cvLink");

  /* -------------------- RESPONSIVE SCALE-TO-FIT --------------------
     The desktop layout is authored at a fixed 1920px canvas. On any
     viewport narrower than that (and wider than the 900px mobile
     breakpoint) we scale the whole #scaleWrap down as one rigid
     block so every gap/alignment relationship stays exactly as
     designed — only the overall size changes. #scaleOuter's height
     is kept in sync so the page never shows extra blank space or a
     stray scrollbar from the transform.

     The scale is the SMALLER of a width-based ratio and a
     height-based ratio (measured against sections 1+2's own natural
     height, not the whole page) so that opening the site always
     shows sections 1+2 in full, regardless of the browser window's
     aspect ratio or how much vertical space its own chrome eats. */
  var DESIGN_WIDTH = 1920;
  var MOBILE_BREAKPOINT = 900;
  var scaleOuter = document.getElementById("scaleOuter");
  var scaleWrap = document.getElementById("scaleWrap");
  var sec02 = document.querySelector(".sec-02");

  function updateScale() {
    if (!scaleOuter || !scaleWrap) return;
    var vw = window.innerWidth;
    var vh = window.innerHeight;

    if (vw < MOBILE_BREAKPOINT) {
      document.documentElement.style.setProperty("--page-scale", 1);
      scaleOuter.style.height = "";
      return;
    }

    var widthScale = vw / DESIGN_WIDTH;
    var heightScale = 1;
    if (sec02) {
      var sections12Height = sec02.offsetTop + sec02.offsetHeight; /* natural, unscaled */
      if (sections12Height > 0) {
        heightScale = vh / sections12Height;
      }
    }
    var scale = Math.min(1, widthScale, heightScale);
    document.documentElement.style.setProperty("--page-scale", scale);

    var naturalHeight = scaleWrap.offsetHeight; /* offsetHeight ignores CSS transform */
    scaleOuter.style.height = (naturalHeight * scale) + "px";
  }

  updateScale();
  window.addEventListener("resize", updateScale);
  window.addEventListener("orientationchange", updateScale);
  window.addEventListener("load", updateScale);
  /* Fonts loading can change natural height slightly; re-measure once settled. */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(updateScale);
  }
  setTimeout(updateScale, 300);
  setTimeout(updateScale, 1000);

  var cvHref = { en: "cv/Vladlena-CV-eng.pdf", ru: "cv/Vladlena-CV-ru.pdf" };

  var currentLang = "en";

  function applyLang(lang) {
    currentLang = lang === "ru" ? "ru" : "en";

    document.documentElement.setAttribute(
      "lang",
      currentLang === "ru" ? "ru" : "en"
    );

    var nodes = document.querySelectorAll("[data-en]");
    nodes.forEach(function (el) {
      var val = currentLang === "ru" ? el.getAttribute("data-ru") : el.getAttribute("data-en");
      if (val !== null && val !== undefined) {
        el.textContent = val;
      }
    });

    langEnBtn.classList.toggle("active", currentLang === "en");
    langRuBtn.classList.toggle("active", currentLang === "ru");

    if (cvLink) cvLink.setAttribute("href", cvHref[currentLang]);

    try {
      localStorage.setItem(STORAGE_KEY, currentLang);
    } catch (e) {
      /* storage unavailable — ignore */
    }

    updateScale();

    if (activeModal) {
      refreshModalImage();
    }
  }

  langEnBtn.addEventListener("click", function () {
    applyLang("en");
  });
  langRuBtn.addEventListener("click", function () {
    applyLang("ru");
  });

  var savedLang = null;
  try {
    savedLang = localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    savedLang = null;
  }
  applyLang(savedLang === "ru" ? "ru" : "en");

  /* -------------------- MODALS -------------------- */

  var overlay = document.getElementById("modalOverlay");
  var box = document.getElementById("modalBox");
  var img = document.getElementById("modalImg");
  var closeBtn = document.getElementById("modalClose");

  var activeModal = null; // { en, ru, scrollable }

  var PROJECTS = {
    zastava: {
      en: "images/Zastava_eng.webp",
      ru: "images/Zastava_rus.webp",
      scrollable: false
    },
    baush: {
      en: "images/Baush_eng.webp",
      ru: "images/Baush_ru.webp",
      scrollable: true
    },
    maslenitsa: {
      en: "images/Maslenitsa_eng.webp",
      ru: "images/Maslenitsa_rus.webp",
      scrollable: true
    }
  };

  var CERTIFICATES = {
    en: "images/Sertif_eng.webp",
    ru: "images/Sertif_ru.webp",
    scrollable: false
  };

  function refreshModalImage() {
    if (!activeModal) return;
    img.src = activeModal[currentLang];
  }

  function openModal(descriptor) {
    activeModal = descriptor;
    box.classList.toggle("scrollable", !!descriptor.scrollable);
    img.src = descriptor[currentLang];
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
    activeModal = null;
    img.src = "";
  }

  document.getElementById("certBtn").addEventListener("click", function () {
    openModal(CERTIFICATES);
  });

  document.querySelectorAll(".project-card").forEach(function (card) {
    card.addEventListener("click", function () {
      var key = card.getAttribute("data-project");
      if (PROJECTS[key]) openModal(PROJECTS[key]);
    });
  });

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay.classList.contains("open")) closeModal();
  });
})();
