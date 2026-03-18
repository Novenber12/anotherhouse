// Another House — Mobile-optimized header injector
// Usage: add `<div id="siteHeader"></div>` inside <body> then include this script.
//
// Optimizations:
// - Touch-friendly interactions
// - iOS Safari fixed positioning fixes
// - Smooth drawer animation with hardware acceleration
// - Better scroll locking
// - Prevents body bounce on iOS

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

    /* Scroll lock for body when menu open */
    body.ah-menu-open {
      overflow: hidden !important;
      position: fixed !important;
      width: 100% !important;
      height: 100% !important;
      -webkit-overflow-scrolling: none;
    }

    .ah-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 9999;
      background: rgba(245, 240, 232, 0.92);
      backdrop-filter: blur(12px) saturate(140%);
      -webkit-backdrop-filter: blur(12px) saturate(140%);
      border-bottom: 1px solid var(--ah-border);
      font-family: 'DM Sans', sans-serif;
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
    }

    .ah-header-inner {
      max-width: 100%;
      margin: 0 auto;
      padding: 0 16px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    /* ── Brand ── */
    .ah-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: var(--ah-ink);
      -webkit-tap-highlight-color: transparent;
    }

    .ah-brand-logo {
      width: 36px;
      height: 36px;
      flex-shrink: 0;
      object-fit: contain;
    }

    .ah-brand-text {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .ah-brand-name {
      font-family: 'Cormorant Garamond', serif;
      font-size: 17px;
      font-weight: 400;
      letter-spacing: 0.03em;
      color: var(--ah-ink);
      line-height: 1.1;
    }

    .ah-brand-sub {
      font-size: 9px;
      font-weight: 300;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--ah-muted);
      line-height: 1;
    }

    /* ── Mobile hamburger button ── */
    .ah-toggle {
      display: flex;
      width: 44px;
      height: 44px;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: 1px solid var(--ah-border);
      border-radius: 8px;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
      transition: background 0.15s ease;
    }

    .ah-toggle:active {
      background: rgba(28,25,23,0.08);
    }

    .ah-toggle-icon {
      position: relative;
      width: 20px;
      height: 14px;
    }

    .ah-toggle-line {
      position: absolute;
      left: 0;
      width: 100%;
      height: 2px;
      background: var(--ah-ink);
      border-radius: 1px;
      transition: transform 0.3s ease, opacity 0.3s ease;
    }

    .ah-toggle-line:nth-child(1) { top: 0; }
    .ah-toggle-line:nth-child(2) { top: 6px; width: 60%; }
    .ah-toggle-line:nth-child(3) { top: 12px; }

    /* Toggle animation when open */
    .ah-toggle.is-active .ah-toggle-line:nth-child(1) {
      transform: translateY(6px) rotate(45deg);
    }
    .ah-toggle.is-active .ah-toggle-line:nth-child(2) {
      opacity: 0;
      transform: translateX(-10px);
    }
    .ah-toggle.is-active .ah-toggle-line:nth-child(3) {
      transform: translateY(-6px) rotate(-45deg);
    }

    /* ── Overlay ── */
    .ah-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 9998;
      background: rgba(28,25,23,0);
      visibility: hidden;
      transition: background 0.35s ease, visibility 0s 0.35s;
      -webkit-tap-highlight-color: transparent;
    }

    .ah-overlay.is-open {
      visibility: visible;
      background: rgba(28,25,23,0.5);
      transition: background 0.35s ease, visibility 0s 0s;
    }

    /* ── Mobile drawer ── */
    .ah-drawer {
      position: fixed;
      z-index: 10000;
      top: 0;
      right: 0;
      height: 100%;
      height: 100dvh; /* Dynamic viewport height for mobile */
      width: min(90%, 320px);
      background: var(--ah-cream);
      border-left: 1px solid var(--ah-border);
      display: flex;
      flex-direction: column;
      font-family: 'DM Sans', sans-serif;
      overflow-y: auto;
      overflow-x: hidden;
      overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;
      
      /* Hardware accelerated transform */
      -webkit-transform: translate3d(105%, 0, 0);
      transform: translate3d(105%, 0, 0);
      transition: transform 0.4s cubic-bezier(0.32, 0.72, 0, 1);
      will-change: transform;
    }

    .ah-drawer.is-open {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }

    .ah-drawer-head {
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--ah-border);
      flex-shrink: 0;
      min-height: 60px;
    }

    .ah-drawer-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 20px;
      font-weight: 300;
      letter-spacing: 0.03em;
      color: var(--ah-ink);
    }

    .ah-drawer-close {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: 1px solid var(--ah-border);
      border-radius: 8px;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
      transition: background 0.15s ease;
    }

    .ah-drawer-close:active {
      background: rgba(28,25,23,0.08);
    }

    .ah-drawer-close svg {
      color: var(--ah-ink);
    }

    .ah-drawer-nav {
      flex: 1;
      padding: 24px 20px;
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .ah-drawer-link {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 0;
      border-bottom: 1px solid var(--ah-border);
      font-size: 14px;
      font-weight: 400;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--ah-ink);
      text-decoration: none;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
      transition: color 0.2s ease, padding-left 0.2s ease;
    }

    .ah-drawer-link:first-child {
      border-top: 1px solid var(--ah-border);
    }

    .ah-drawer-link:active {
      color: var(--ah-olive);
      padding-left: 8px;
    }

    .ah-drawer-link.is-current {
      color: var(--ah-olive);
      font-weight: 500;
    }

    .ah-drawer-link svg {
      opacity: 0.3;
      transition: opacity 0.2s, transform 0.2s;
      flex-shrink: 0;
    }

    .ah-drawer-link:active svg {
      opacity: 0.7;
      transform: translateX(4px);
    }

    .ah-drawer-footer {
      padding: 20px;
      border-top: 1px solid var(--ah-border);
      display: flex;
      flex-direction: column;
      gap: 16px;
      flex-shrink: 0;
    }

    .ah-drawer-cta {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      background: var(--ah-ink);
      color: var(--ah-cream);
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      text-decoration: none;
      border-radius: 4px;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
      transition: background 0.2s ease;
    }

    .ah-drawer-cta:active {
      background: var(--ah-olive);
    }

    .ah-drawer-tagline {
      font-size: 10px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--ah-muted);
      text-align: center;
      line-height: 1.6;
    }

    /* ── Safe area for notched devices ── */
    @supports (padding-bottom: env(safe-area-inset-bottom)) {
      .ah-drawer-footer {
        padding-bottom: calc(20px + env(safe-area-inset-bottom));
      }
    }

    /* ── Desktop: show regular nav, hide mobile elements ── */
    @media (min-width: 768px) {
      .ah-header-inner {
        max-width: 1200px;
        padding: 0 28px;
        height: 68px;
      }

      .ah-brand-name {
        font-size: 20px;
      }

      .ah-brand-sub {
        font-size: 10px;
        letter-spacing: 0.16em;
      }

      .ah-toggle {
        display: none !important;
      }

      .ah-nav-desktop {
        display: flex !important;
        align-items: center;
        gap: 0;
      }

      .ah-actions-desktop {
        display: flex !important;
        align-items: center;
        gap: 12px;
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

      .ah-nav-link.is-current {
        color: var(--ah-olive);
        font-weight: 500;
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
    }

    /* ── Mobile: hide desktop nav ── */
    @media (max-width: 767px) {
      .ah-nav-desktop,
      .ah-actions-desktop {
        display: none !important;
      }
    }
  `;

  // Scroll position storage
  let scrollPosition = 0;

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
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
    const subtitle = body.getAttribute("data-header-subtitle") || "Creative boutique homestay";
    const ctaText = body.getAttribute("data-header-cta-text") || "Book now";
    const ctaHref = body.getAttribute("data-header-cta-href") || "bookingDesktop.html";

    // Determine current page for active state
    const currentPage = location.pathname.split("/").pop() || "../mobile/indexMobile.html";
    const isActive = (page) => currentPage === page || currentPage.includes(page.replace('.html', ''));

    mount.innerHTML = `
      <header class="ah-header" role="banner">
        <div class="ah-header-inner">

          <!-- Brand -->
          <a href="../mobile/indexMobile.html" class="ah-brand" aria-label="Another House — home">
            <img src="../assets/img/logo2.png" class="ah-brand-logo" alt="" aria-hidden="true" />
            <div class="ah-brand-text">
              <div class="ah-brand-name">Another House</div>
              <div class="ah-brand-sub">${escapeHtml(subtitle)}</div>
            </div>
          </a>

          <!-- Desktop nav (hidden on mobile) -->
          <nav class="ah-nav-desktop" aria-label="Main navigation">
            <a href="index.html" class="ah-nav-link ${isActive('../assets/mobile/indexMobile.html') ? 'is-current' : ''}">Home</a>
            <a href="rooms.html" class="ah-nav-link ${isActive('../assets/mobile/roomsMobile.html') ? 'is-current' : ''}">Rooms</a>
            <a href="about.html" class="ah-nav-link ${isActive('../assets/mobile/aboutMobile.html') ? 'is-current' : ''}">About</a>
            <a href="contact.html" class="ah-nav-link ${isActive('../assets/mobile/contactMobile.html') ? 'is-current' : ''}">Contact</a>
          </nav>

          <!-- Desktop CTA (hidden on mobile) -->
          <div class="ah-actions-desktop">
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
            type="button"
          >
            <div class="ah-toggle-icon">
              <span class="ah-toggle-line"></span>
              <span class="ah-toggle-line"></span>
              <span class="ah-toggle-line"></span>
            </div>
          </button>
        </div>

        <!-- Overlay -->
        <div class="ah-overlay" id="ahOverlay" aria-hidden="true"></div>

        <!-- Mobile drawer -->
        <nav
          class="ah-drawer"
          id="ahDrawer"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div class="ah-drawer-head">
            <div class="ah-drawer-title">Menu</div>
            <button class="ah-drawer-close" id="ahDrawerClose" aria-label="Close menu" type="button">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M6 6l12 12M18 6L6 18"/>
              </svg>
            </button>
          </div>

          <div class="ah-drawer-nav">
            <a href="../mobile/indexMobile.html" class="ah-drawer-link ${isActive('../mobile/indexMobile.html') ? 'is-current' : ''}">
              Home
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a href="../mobile/roomsMobile.html" class="ah-drawer-link ${isActive('../mobile/roomsMobile.html') ? 'is-current' : ''}">
              Rooms
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
                <a href="../mobile/aboutMobile.html" class="ah-drawer-link ${isActive('../mobile/aboutMobile.html') ? 'is-current' : ''}">
                About
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
                <a href="../mobile/contactMobile.html" class="ah-drawer-link ${isActive('../mobile/contactMobile.html') ? 'is-current' : ''}">
              Contact
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>

          <div class="ah-drawer-footer">
            <a href="${escapeHtml(ctaHref)}" class="ah-drawer-cta">${escapeHtml(ctaText)}</a>
            <div class="ah-drawer-tagline">Boutique mood · Minimal luxury · Unique concepts</div>
          </div>
        </nav>
      </header>
    `;

    /* ── JS interactions ── */
    const toggle = document.getElementById("ahNavToggle");
    const closeBtn = document.getElementById("ahDrawerClose");
    const overlay = document.getElementById("ahOverlay");
    const drawer = document.getElementById("ahDrawer");

    function openMenu() {
      // Store scroll position before locking
      scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      
      drawer.classList.add("is-open");
      overlay.classList.add("is-open");
      toggle.classList.add("is-active");
      toggle.setAttribute("aria-expanded", "true");
      
      // Lock body scroll (iOS Safari fix)
      document.body.classList.add("ah-menu-open");
      document.body.style.top = `-${scrollPosition}px`;
    }

    function closeMenu() {
      drawer.classList.remove("is-open");
      overlay.classList.remove("is-open");
      toggle.classList.remove("is-active");
      toggle.setAttribute("aria-expanded", "false");
      
      // Unlock body scroll
      document.body.classList.remove("ah-menu-open");
      document.body.style.top = "";
      
      // Restore scroll position
      window.scrollTo(0, scrollPosition);
    }

    // Touch-friendly event handling
    if (toggle) {
      toggle.addEventListener("click", openMenu);
      toggle.addEventListener("touchend", function(e) {
        e.preventDefault();
        openMenu();
      }, { passive: false });
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", closeMenu);
      closeBtn.addEventListener("touchend", function(e) {
        e.preventDefault();
        closeMenu();
      }, { passive: false });
    }

    if (overlay) {
      overlay.addEventListener("click", closeMenu);
      overlay.addEventListener("touchend", function(e) {
        e.preventDefault();
        closeMenu();
      }, { passive: false });
    }

    // Close on Escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.classList.contains("is-open")) {
        closeMenu();
      }
    });

    // Prevent drawer scroll from affecting body
    if (drawer) {
      drawer.addEventListener("touchmove", function(e) {
        e.stopPropagation();
      }, { passive: true });
    }

    // Close menu when clicking nav links
    const drawerLinks = drawer.querySelectorAll(".ah-drawer-link, .ah-drawer-cta");
    drawerLinks.forEach(function(link) {
      link.addEventListener("click", function() {
        // Small delay to allow the click to register
        setTimeout(closeMenu, 100);
      });
    });
  }

  // Initialize on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderHeader);
  } else {
    renderHeader();
  }

  // Expose for manual re-render if needed
  window.AH_renderHeader = renderHeader;
})();
