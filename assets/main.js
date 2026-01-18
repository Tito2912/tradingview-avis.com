/* ==========================================================================
   TradingView-Avis — main.js
   Rôles : UX, SEO, RGPD/GA4, sécurité, intégrations.
   ========================================================================== */

(function () {
  "use strict";

  /* -----------------------------
     0) CONFIG GLOBAL
  ----------------------------- */
  const CONFIG = {
    AFF_URL: "https://fr.tradingview.com/?aff_id=152551",
    GA4_ID: "G-EFTTSY036T",
    // Renseignez l’URL du déploiement Web App Apps Script (README.md fourni)
    NEWSLETTER_ENDPOINT: "", // ex: "https://script.google.com/macros/s/AKfycbx.../exec"
    // reCAPTCHA v3 (facultatif). Laisser vide pour désactiver.
    RECAPTCHA_SITE_KEY: "",  // ex: "6Lc...YOUR_SITE_KEY..."
    CONSENT_STORAGE_KEY: "tv_consent",
    CONSENT_VERSION: "2025-09-11",
    // Afficher le badge d’affiliation si nécessaire légalement :
    SHOW_AFFILIATE_BADGE: false
  };

  /* -----------------------------
     Helpers
  ----------------------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);
  const nowISO = () => new Date().toISOString();
  const normalize = (s) => (s || "").toString().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const isFrenchUI = () => document.documentElement.lang?.toLowerCase().startsWith("fr");
  const userLangIsFrench = () => {
    const langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""];
    return langs.some(l => (l || "").toLowerCase().startsWith("fr"));
  };

  const pathMapFRtoEN = {
    "/": "/en/",
    "/blog": "/en/blog",
    "/blog-tradingview": "/en/blog-tradingview",
    "/mentions-legales": "/en/legal-notice",
    "/politique-de-confidentialite": "/en/privacy-policy",
    // Backward compatibility (old .html URLs)
    "/blog.html": "/en/blog",
    "/blog-tradingview.html": "/en/blog-tradingview",
    "/mentions-legales.html": "/en/legal-notice",
    "/politique-de-confidentialite.html": "/en/privacy-policy"
  };
  const pathMapENtoFR = Object.fromEntries(Object.entries(pathMapFRtoEN).map(([fr, en]) => [en, fr]));

  /* -----------------------------
     1) NAV Burger & UI basics
  ----------------------------- */
  function initNav() {
    const toggle = $("#navToggle");
    const menu = $("#navMenu");
    if (!toggle || !menu) return;

    on(toggle, "click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      menu.classList.toggle("is-open");
    });

    // Close menu on outside click (mobile)
    on(document, "click", (e) => {
      if (!menu.classList.contains("is-open")) return;
      const clickInside = menu.contains(e.target) || toggle.contains(e.target);
      if (!clickInside) {
        toggle.setAttribute("aria-expanded", "false");
        menu.classList.remove("is-open");
      }
    });
  }

  function initFooterYear() {
    const y = $("#year");
    if (y) y.textContent = new Date().getFullYear();
    // Affiliation badge (masqué par défaut — l’activer seulement si requis)
    if (CONFIG.SHOW_AFFILIATE_BADGE) {
      const footer = $("footer.site-footer");
      if (footer) footer.classList.add("show-badge");
    }
  }

  function enforceAffiliateCTAs() {
    // Sécurise target/rel sur tous les liens vers TradingView
    $$("a[href*='tradingview.com']").forEach(a => {
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener nofollow sponsored");
    });
    // Forcer l’URL sur boutons marqués data-cta si vide
    $$("a[data-cta]").forEach(a => {
      if (!a.getAttribute("href") || a.getAttribute("href") === "#") {
        a.setAttribute("href", CONFIG.AFF_URL);
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener nofollow sponsored");
      }
    });
  }

  /* -----------------------------
     2) Auto-redirect langue (FR <-> EN)
        - Non intrusif : respecte un choix manuel stocké.
  ----------------------------- */
  function initLangRedirect() {
    try {
      // Respecter un choix manuel :
      const manual = localStorage.getItem("lang_pref"); // "fr" | "en"
      if (manual) return;

      const p = window.location.pathname;
      // Si l’utilisateur n’est PAS FR et qu’on est sur une page FR, rediriger vers EN
      if (!userLangIsFrench() && pathMapFRtoEN[p]) {
        window.location.replace(pathMapFRtoEN[p]);
      }
      // (Optionnel) l’inverse si besoin — ici la contrainte impose surtout FR->EN.
      // if (userLangIsFrench() && pathMapENtoFR[p]) { window.location.replace(pathMapENtoFR[p]); }
    } catch (_) {}
  }

  function bindLangSwitcher() {
    // Lorsque l’utilisateur clique une langue, mémoriser la préférence :
    $$(".lang__list a[hreflang]").forEach(a => {
      on(a, "click", () => {
        const hl = (a.getAttribute("hreflang") || "").toLowerCase().startsWith("fr") ? "fr" : "en";
        localStorage.setItem("lang_pref", hl);
      });
    });
  }

  /* -----------------------------
     3) Cookies & Consent (RGPD) + GA4
     - UI : #cookieBanner, #cookieAcceptAll, #cookieDecline, #cookiePrefsToggle, #cookieSave
     - Journal : localStorage tv_consent
  ----------------------------- */
  function getConsent() {
    try {
      const raw = localStorage.getItem(CONFIG.CONSENT_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) { return null; }
  }

  function setConsent(data) {
    const payload = {
      necessary: true,
      analytics: !!data.analytics,
      ts: nowISO(),
      version: CONFIG.CONSENT_VERSION
    };
    localStorage.setItem(CONFIG.CONSENT_STORAGE_KEY, JSON.stringify(payload));
    return payload;
  }

  function applyConsent(consent) {
    // GA4 consent mode default
    window.dataLayer = window.dataLayer || [];
    function gtag(){ window.dataLayer.push(arguments); }
    gtag("consent", "default", { analytics_storage: "denied" });

    if (consent?.analytics) {
      // Charger GA4
      if (CONFIG.GA4_ID) {
        const s = document.createElement("script");
        s.async = true;
        s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(CONFIG.GA4_ID)}`;
        document.head.appendChild(s);

        window.dataLayer = window.dataLayer || [];
        window.gtag = gtag;
        gtag("js", new Date());
        gtag("consent", "update", { analytics_storage: "granted" });
        gtag("config", CONFIG.GA4_ID, {
          transport_type: "beacon"
          // GA4 anonymize_ip est géré côté Google par défaut; pas d’IP complète conservée dans l’UE.
        });
      }
    }
  }

  function initCookieBanner() {
    const banner = $("#cookieBanner");
    if (!banner) return;

    const btnAccept = $("#cookieAcceptAll");
    const btnDecline = $("#cookieDecline");
    const btnPrefs = $("#cookiePrefsToggle");
    const prefsForm = $("#cookiePrefs");
    const btnSave = $("#cookieSave");
    const chkAnalytics = $("#consentAnalytics");

    const consent = getConsent();
    if (consent) {
      // Déjà consenti : masque la bannière et applique
      banner.style.display = "none";
      if (typeof consent.analytics === "boolean") {
        if (chkAnalytics) chkAnalytics.checked = consent.analytics;
      }
      applyConsent(consent);
    } else {
      // Afficher par défaut (préférences masquées)
      banner.style.display = "block";
      if (prefsForm) prefsForm.classList.add("hidden");
      if (chkAnalytics) chkAnalytics.checked = false;
    }

    on(btnAccept, "click", () => {
      const saved = setConsent({ analytics: true });
      applyConsent(saved);
      banner.style.display = "none";
    });

    on(btnDecline, "click", () => {
      const saved = setConsent({ analytics: false });
      applyConsent(saved);
      banner.style.display = "none";
    });

    on(btnPrefs, "click", () => {
      const expanded = btnPrefs.getAttribute("aria-expanded") === "true";
      btnPrefs.setAttribute("aria-expanded", String(!expanded));
      prefsForm.classList.toggle("hidden");
      prefsForm.setAttribute("aria-hidden", String(expanded));
    });

    on(btnSave, "click", () => {
      const saved = setConsent({ analytics: !!(chkAnalytics && chkAnalytics.checked) });
      applyConsent(saved);
      banner.style.display = "none";
    });
  }

  /* -----------------------------
     4) Blog : recherche client-side (titre + tags)
  ----------------------------- */
  function initBlogSearch() {
    const form = $("#blogSearch");
    const input = $("#q");
    const chips = $$(".chip");
    const grid = $("#postsGrid");
    if (!form || !input || !grid) return;

    let activeFilter = "all";
    function applyFilter() {
      const q = normalize(input.value);
      let visible = 0;
      $$(".post", grid).forEach(card => {
        const title = normalize(card.dataset.title || "");
        const tags = normalize(card.dataset.tags || "");
        const matchQ = !q || title.includes(q) || tags.includes(q);
        const matchF = activeFilter === "all" || tags.includes(activeFilter);
        const show = matchQ && matchF;
        card.style.display = show ? "" : "none";
        if (show) visible++;
      });
      if (visible === 0) {
        grid.setAttribute("data-empty", "true");
        grid.setAttribute("aria-live", "polite");
        grid.title = grid.getAttribute("data-empty-text") || "";
      } else {
        grid.removeAttribute("data-empty");
        grid.removeAttribute("title");
      }
    }

    on(input, "input", applyFilter);
    chips.forEach(ch => {
      on(ch, "click", () => {
        chips.forEach(c => { c.classList.remove("is-active"); c.setAttribute("aria-pressed", "false"); });
        ch.classList.add("is-active");
        ch.setAttribute("aria-pressed", "true");
        activeFilter = (ch.dataset.filter || "all").toLowerCase();
        applyFilter();
      });
    });
  }

  /* -----------------------------
     5) FAQ accordéon (progressive enhancement)
     (Les pages utilisent <details>, donc rien d’obligatoire ici)
  ----------------------------- */
  function enhanceFAQ() {
    $$("details.accordion__item").forEach(d => {
      // Ferme les autres quand on ouvre (comportement accordéon)
      on(d, "toggle", () => {
        if (d.open) {
          $$("details.accordion__item").forEach(o => { if (o !== d) o.open = false; });
        }
      });
    });
  }

  /* -----------------------------
     6) Newsletter → Google Sheets (Apps Script)
        - Honeypot #company
        - Délai anti-bot (min 800 ms)
        - reCAPTCHA v3 si clé fournie
  ----------------------------- */
  function initNewsletter() {
    const form = $("#newsletterForm");
    if (!form) return;

    const email = $("#email");
    const company = $("#company"); // honeypot
    const msg = $("#formMsg");
    let startTime = Date.now();

    function setMsg(t, ok) {
      if (msg) {
        msg.textContent = t;
        msg.style.color = ok ? "#9be7c4" : "#ffb4a6";
      }
    }

    async function getRecaptchaToken() {
      if (!CONFIG.RECAPTCHA_SITE_KEY || !window.grecaptcha) return "";
      try {
        await window.grecaptcha.ready();
        const token = await window.grecaptcha.execute(CONFIG.RECAPTCHA_SITE_KEY, { action: "newsletter" });
        return token || "";
      } catch (_) { return ""; }
    }

    on(form, "submit", async (e) => {
      e.preventDefault();

      if (!email || !email.value) {
        setMsg(isFrenchUI() ? "Veuillez entrer un e-mail valide." : "Please enter a valid email.", false);
        return;
      }
      if (company && company.value) {
        // bot
        setMsg(isFrenchUI() ? "Erreur de validation." : "Validation error.", false);
        return;
      }

      const elapsed = Date.now() - startTime;
      if (elapsed < 800) {
        await new Promise(r => setTimeout(r, 800 - elapsed)); // délai anti-bot minimal
      }

      const token = await getRecaptchaToken();

      const payload = {
        email: String(email.value).trim(),
        lang: isFrenchUI() ? "fr" : "en",
        ts: nowISO(),
        token
      };

      // Endpoint obligatoire
      const endpoint = CONFIG.NEWSLETTER_ENDPOINT || form.getAttribute("data-endpoint") || "";
      if (!endpoint) {
        setMsg(isFrenchUI()
          ? "Newsletter à venir : configurez l’endpoint Apps Script (voir README)."
          : "Newsletter coming soon: set the Apps Script endpoint (see README).", false);
        return;
      }

      try {
        setMsg(isFrenchUI() ? "Envoi en cours…" : "Sending…", true);
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          mode: "cors",
          redirect: "follow",
          credentials: "omit"
        });

        if (res.ok) {
          setMsg(isFrenchUI()
            ? "Merci ! Vérifiez votre boîte e-mail."
            : "Thanks! Please check your inbox.", true);
          form.reset();
        } else {
          const text = await res.text().catch(() => "");
          setMsg((isFrenchUI()
            ? `Échec de l’inscription (${res.status}). `
            : `Subscription failed (${res.status}). `) + (text || ""), false);
        }
      } catch (err) {
        setMsg(isFrenchUI()
          ? "Erreur réseau. Réessayez plus tard."
          : "Network error. Please try again later.", false);
      }
    });
  }

  /* -----------------------------
     7) Google Translate (optionnel)
     - Non chargé sur les pages .notranslate
     - Nécessite un conteneur #google_translate_element si souhaité
  ----------------------------- */
  function initTranslate() {
    if (document.body.classList.contains("notranslate")) return;
    const host = $("#google_translate_element");
    if (!host) return; // pas de widget sur ce site par défaut

    window.googleTranslateElementInit = function () {
      /* global google */
      new google.translate.TranslateElement({
        pageLanguage: isFrenchUI() ? "fr" : "en",
        includedLanguages: "en,fr",
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      }, "google_translate_element");
    };

    const s = document.createElement("script");
    s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    s.defer = true;
    document.head.appendChild(s);
  }

  /* -----------------------------
     8) Micro-interactions (petit effet press sur .btn)
  ----------------------------- */
  function initButtonEffects() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn");
      if (!btn) return;
      btn.classList.add("is-pressed");
      setTimeout(() => btn.classList.remove("is-pressed"), 150);
    });
  }

  /* -----------------------------
     9) Init global
  ----------------------------- */
  function init() {
    initNav();
    initFooterYear();
    enforceAffiliateCTAs();
    initLangRedirect();
    bindLangSwitcher();
    initCookieBanner();
    initBlogSearch();
    enhanceFAQ();
    initNewsletter();
    initTranslate();
    initButtonEffects();
  }

  // DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
