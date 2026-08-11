(function () {
  "use strict";

  var STORAGE_KEY = "vladlena-cv-lang";
  var langEnBtn = document.getElementById("langEn");
  var langRuBtn = document.getElementById("langRu");
  var heroPhoto = document.getElementById("heroPhoto");
  var cvLink = document.getElementById("cvLink");

  var photoSrc = { en: "images/Me-eng.webp", ru: "images/Me-ru.webp" };
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

    if (heroPhoto) heroPhoto.src = photoSrc[currentLang];
    if (cvLink) cvLink.setAttribute("href", cvHref[currentLang]);

    try {
      localStorage.setItem(STORAGE_KEY, currentLang);
    } catch (e) {
      /* storage unavailable — ignore */
    }

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
