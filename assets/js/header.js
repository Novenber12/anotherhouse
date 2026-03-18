// Another House — redesigned header injector
// Usage: add `<div id="siteHeader"></div>` inside <body> then include this script before `assets/js/app.js`.
//
// Optional per-page customization via <body> attributes:
// - data-header-subtitle="About"
// - data-header-cta-text="Book now"
// - data-header-cta-href="booking.html"

(function () {
    const STYLES = `
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  
      #siteHeader * { box-sizing: border-box; }
  
      #siteHeader {
        --ah-cream: #F5F0E8;
        --ah-ink: #1C1917;
        --ah-olive: #5C6645;
        --ah-gold: #B8935A;
        --ah-muted: rgba(28,25,23,0.45);
        --ah-border: rgba(28,25,23,0.1);
      }
  
      .ah-header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 50;
        background: rgba(245, 240, 232, 0.88);
        backdrop-filter: blur(18px) saturate(160%);
        -webkit-backdrop-filter: blur(18px) saturate(160%);
        border-bottom: 1px solid var(--ah-border);
        font-family: 'DM Sans', sans-serif;
      }
  
      .ah-header-inner {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 28px;
        height: 68px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
      }
  
      /* ── Brand ── */
      .ah-brand {
        display: flex;
        align-items: center;
        gap: 14px;
        text-decoration: none;
        color: var(--ah-ink);
      }
  
      .ah-brand-mark {
        position: relative;
        width: 38px;
        height: 38px;
        flex-shrink: 0;
      }
  
      .ah-brand-mark::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 10px;
        background: var(--ah-olive);
        transform: rotate(6deg);
        opacity: 0.18;
        transition: transform 0.4s ease, opacity 0.4s ease;
      }
  
      .ah-brand:hover .ah-brand-mark::before {
        transform: rotate(0deg);
        opacity: 0.28;
      }
  
      .ah-brand-img-wrap {
        position: absolute;
        inset: 0;
        border-radius: 10px;
        background: var(--ah-olive);
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
      }
  
      .ah-brand-img-wrap img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
  
      .ah-brand-text {
        display: flex;
        flex-direction: column;
        gap: 1px;
      }
  
      .ah-brand-name {
        font-family: 'Cormorant Garamond', serif;
        font-size: 20px;
        font-weight: 400;
        letter-spacing: 0.04em;
        color: var(--ah-ink);
        line-height: 1.1;
        transition: color 0.25s ease;
      }
  
      .ah-brand:hover .ah-brand-name {
        color: var(--ah-olive);
      }
  
      .ah-brand-sub {
        font-size: 10px;
        font-weight: 300;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--ah-muted);
        line-height: 1;
      }
  
      /* ── Nav ── */
      .ah-nav {
        display: flex;
        align-items: center;
        gap: 0;
      }
  
      .ah-nav-link {
        position: relative;
        padding: 6px 16px;
        font-size: 12px;
        font-weight: 400;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--ah-muted);
        text-decoration: none;
        transition: color 0.25s ease;
      }
  
      .ah-nav-link::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 16px;
        right: 16px;
        height: 1px;
        background: var(--ah-gold);
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      }
  
      .ah-nav-link:hover {
        color: var(--ah-ink);
      }
  
      .ah-nav-link:hover::after {
        transform: scaleX(1);
      }
  
      /* ── CTA ── */
      .ah-actions {
        display: flex;
        align-items: center;
        gap: 12px;
      }
  
      .ah-cta {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 9px 22px;
        font-family: 'DM Sans', sans-serif;
        font-size: 11px;
        font-weight: 500;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        text-decoration: none;
        color: var(--ah-cream);
        background: var(--ah-ink);
        border: 1px solid var(--ah-ink);
        border-radius: 2px;
        overflow: hidden;
        transition: color 0.35s ease, border-color 0.35s ease;
      }
  
      .ah-cta::before {
        content: '';
        position: absolute;
        inset: 0;
        background: var(--ah-gold);
        transform: translateX(-102%);
        transition: transform 0.45s cubic-bezier(0.7, 0, 0.3, 1);
      }
  
      .ah-cta:hover {
        color: var(--ah-cream);
        border-color: var(--ah-gold);
      }
  
      .ah-cta:hover::before {
        transform: translateX(0);
      }
  
      .ah-cta span {
        position: relative;
        z-index: 1;
      }
  
      /* ── Mobile toggle ── */
      .ah-toggle {
        display: none;
        width: 40px;
        height: 40px;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: 1px solid var(--ah-border);
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.2s ease;
      }
  
      .ah-toggle:hover {
        background: rgba(28,25,23,0.05);
      }
  
      .ah-toggle svg {
        display: block;
        color: var(--ah-ink);
      }
  
      /* ── Mobile drawer ── */
      .ah-overlay {
        display: none;
        position: fixed;
        inset: 0;
        z-index: 40;
        background: rgba(28,25,23,0);
        transition: background 0.35s ease;
      }
  
      .ah-overlay.is-open {
        display: block;
        background: rgba(28,25,23,0.45);
      }
  
      .ah-drawer {
        position: fixed;
        z-index: 50;
        top: 0;
        right: 0;
        height: 100%;
        width: min(88%, 340px);
        background: var(--ah-cream);
        border-left: 1px solid var(--ah-border);
        display: flex;
        flex-direction: column;
        transform: translateX(102%);
        transition: transform 0.42s cubic-bezier(0.7, 0, 0.3, 1);
        font-family: 'DM Sans', sans-serif;
      }
  
      .ah-drawer.is-open {
        transform: translateX(0);
      }
  
      .ah-drawer-head {
        padding: 20px 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid var(--ah-border);
      }
  
      .ah-drawer-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: 22px;
        font-weight: 300;
        letter-spacing: 0.04em;
        color: var(--ah-ink);
      }
  
      .ah-drawer-close {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: 1px solid var(--ah-border);
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.2s ease;
      }
  
      .ah-drawer-close:hover {
        background: rgba(28,25,23,0.05);
      }
  
      .ah-drawer-nav {
        flex: 1;
        padding: 32px 24px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
  
      .ah-drawer-link {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 0;
        border-bottom: 1px solid var(--ah-border);
        font-size: 13px;
        font-weight: 400;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--ah-ink);
        text-decoration: none;
        transition: color 0.2s ease;
      }
  
      .ah-drawer-link:hover {
        color: var(--ah-olive);
      }
  
      .ah-drawer-link svg {
        opacity: 0.3;
        transition: opacity 0.2s, transform 0.2s;
      }
  
      .ah-drawer-link:hover svg {
        opacity: 0.7;
        transform: translateX(4px);
      }
  
      .ah-drawer-footer {
        padding: 24px;
        border-top: 1px solid var(--ah-border);
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
  
      .ah-drawer-cta {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 14px;
        background: var(--ah-ink);
        color: var(--ah-cream);
        font-size: 11px;
        font-weight: 500;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        text-decoration: none;
        border-radius: 2px;
        transition: background 0.25s ease;
      }
  
      .ah-drawer-cta:hover {
        background: var(--ah-olive);
      }
  
      .ah-drawer-tagline {
        font-size: 10px;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: var(--ah-muted);
        text-align: center;
      }
  
      /* ── Responsive ── */
      @media (max-width: 767px) {
        .ah-nav, .ah-actions { display: none !important; }
        .ah-toggle { display: flex !important; }
      }
    `;
  
    function escapeHtml(str) {
      return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }
  
    function injectStyles() {
      if (document.getElementById("ah-header-styles")) return;
      const style = document.createElement("style");
      style.id = "ah-header-styles";
      style.textContent = STYLES;
      document.head.appendChild(style);
    }
  
    function renderHeader() {
      const mount = document.getElementById("siteHeader");
      if (!mount) return;
  
      injectStyles();
  
      const body = document.body;
      const subtitle  = body.getAttribute("data-header-subtitle") || "Creative boutique homestay";
      const ctaText   = body.getAttribute("data-header-cta-text") || "Book now";
      const ctaHref   = body.getAttribute("data-header-cta-href") || "bookingDesktop.html";
  
      mount.innerHTML = `
        <header class="ah-header" role="banner">
          <div class="ah-header-inner">
  
            <!-- Brand -->
            <a href="../desktop/indexDesktop.html" class="ah-brand" aria-label="Another House — home">
            
                  <img src="../assets/img/logo2.png" class="w-16 h-18 object-cover" alt="" aria-hidden="true" />

              <div class="ah-brand-text">
                <div class="ah-brand-name">Another House</div>
                <div class="ah-brand-sub">${escapeHtml(subtitle)}</div>
              </div>
            </a>
  
            <!-- Desktop nav -->
            <nav class="ah-nav" aria-label="Main navigation">
              <a data-navlink="1" href="../desktop/indexDesktop.html"   class="ah-nav-link">Home</a>
              <a data-navlink="1" href="../desktop/roomsDesktop.html"   class="ah-nav-link">Rooms</a>
              <a data-navlink="1" href="../desktop/aboutDesktop.html"   class="ah-nav-link">About</a>
              <a data-navlink="1" href="../desktop/contactDesktop.html" class="ah-nav-link">Contact</a>
            </nav>
  
            <!-- Desktop CTA -->
            <div class="ah-actions">
              <a href="${escapeHtml(ctaHref)}" class="ah-cta">
                <span>${escapeHtml(ctaText)}</span>
              </a>
            </div>
  
            <!-- Mobile hamburger -->
            <button
              class="ah-toggle"
              id="ahNavToggle"
              aria-label="Open menu"
              aria-expanded="false"
              aria-controls="ahDrawer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M4 7h16M4 12h10M4 17h16"/>
              </svg>
            </button>
          </div>
  
          <!-- Overlay -->
          <div class="ah-overlay" id="ahOverlay" aria-hidden="true"></div>
  
          <!-- Mobile drawer -->
          <div
            class="ah-drawer"
            id="ahDrawer"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div class="ah-drawer-head">
              <div class="ah-drawer-title">Another House</div>
              <button class="ah-drawer-close" id="ahDrawerClose" aria-label="Close menu">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M6 6l12 12M18 6L6 18"/>
                </svg>
              </button>
            </div>
  
            <nav class="ah-drawer-nav" aria-label="Mobile navigation">
              <a data-navlink="1" href="index.html"   class="ah-drawer-link">Home    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
              <a data-navlink="1" href="rooms.html"   class="ah-drawer-link">Rooms   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
              <a data-navlink="1" href="about.html"   class="ah-drawer-link">About   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
              <a data-navlink="1" href="contact.html" class="ah-drawer-link">Contact <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
            </nav>
  
            <div class="ah-drawer-footer">
              <a href="${escapeHtml(ctaHref)}" class="ah-drawer-cta">${escapeHtml(ctaText)}</a>
              <div class="ah-drawer-tagline">Boutique mood &nbsp;·&nbsp; Minimal luxury &nbsp;·&nbsp; Unique concepts</div>
            </div>
          </div>
        </header>
      `;
  
      /* ── JS interactions ── */
      const toggle   = document.getElementById("ahNavToggle");
      const closeBtn = document.getElementById("ahDrawerClose");
      const overlay  = document.getElementById("ahOverlay");
      const drawer   = document.getElementById("ahDrawer");
  
      function openMenu() {
        drawer.classList.add("is-open");
        overlay.classList.add("is-open");
        toggle.setAttribute("aria-expanded", "true");
        document.body.style.overflow = "hidden";
      }
  
      function closeMenu() {
        drawer.classList.remove("is-open");
        overlay.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
  
      toggle  && toggle.addEventListener("click", openMenu);
      closeBtn && closeBtn.addEventListener("click", closeMenu);
      overlay  && overlay.addEventListener("click", closeMenu);
  
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeMenu();
      });
  
      /* Active nav link highlight */
      const currentPage = location.pathname.split("/").pop() || "index.html";
      document.querySelectorAll("[data-navlink]").forEach(function (link) {
        const href = link.getAttribute("href");
        if (href === currentPage) {
          link.style.color = "var(--ah-olive)";
          link.style.fontWeight = "500";
        }
      });
    }
  
    renderHeader();
    window.AH_renderHeader = renderHeader;
  })();