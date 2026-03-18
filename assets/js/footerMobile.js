// Another House — Mobile-optimized footer injector
// Usage: add `<div id="siteFooter"></div>` before closing </body>,
// then include this script after `assets/js/headerMobile.js`.
//
// Mobile optimizations:
// - Compact layout for small screens
// - Touch-friendly link sizes
// - Simplified grid structure
// - Better spacing for mobile

(function () {
  'use strict';

  const STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

    #siteFooter * { box-sizing: border-box; }

    #siteFooter {
      --ah-cream: #F4EFE6;
      --ah-ink: #191614;
      --ah-ink60: rgba(25,22,20,.6);
      --ah-ink30: rgba(25,22,20,.3);
      --ah-ink10: rgba(25,22,20,.1);
      --ah-gold: #C4944A;
      --ah-olive: #5A6545;
    }

    .ah-footer {
      background: var(--ah-ink);
      color: var(--ah-cream);
      font-family: 'DM Sans', sans-serif;
      font-weight: 300;
      -webkit-font-smoothing: antialiased;
    }

    /* ── Marquee strip ── */
    .ah-footer-marquee {
      background: rgba(244,239,230,.03);
      border-top: 1px solid rgba(244,239,230,.06);
      border-bottom: 1px solid rgba(244,239,230,.06);
      padding: 12px 0;
      overflow: hidden;
      white-space: nowrap;
    }

    .ah-footer-marquee-inner {
      display: inline-flex;
      gap: 0;
      animation: ahMarquee 24s linear infinite;
    }

    .ah-footer-marquee-inner:active {
      animation-play-state: paused;
    }

    @keyframes ahMarquee {
      from { transform: translateX(0); }
      to { transform: translateX(-50%); }
    }

    .ah-footer-marquee-item {
      display: inline-flex;
      align-items: center;
      gap: 16px;
      padding: 0 16px;
      font-size: 9px;
      letter-spacing: .18em;
      text-transform: uppercase;
      color: rgba(244,239,230,.18);
      font-family: 'DM Sans', sans-serif;
      font-weight: 400;
    }

    .ah-footer-marquee-dot {
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background: var(--ah-gold);
      opacity: .6;
      flex-shrink: 0;
    }

    /* ── Main footer content ── */
    .ah-footer-top {
      padding: 40px 20px 32px;
      border-bottom: 1px solid rgba(244,239,230,.06);
    }

    /* Brand section */
    .ah-footer-brand {
      margin-bottom: 32px;
    }

    .ah-footer-brand-name {
      font-family: 'Cormorant Garamond', serif;
      font-size: 22px;
      font-weight: 300;
      letter-spacing: .04em;
      color: var(--ah-cream);
      line-height: 1.1;
      margin-bottom: 10px;
    }

    .ah-footer-brand-desc {
      font-size: 12px;
      color: rgba(244,239,230,.4);
      line-height: 1.65;
      margin-bottom: 20px;
    }

    .ah-footer-tagline {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .ah-footer-tagline-line {
      display: inline-block;
      width: 20px;
      height: 1px;
      background: var(--ah-gold);
      flex-shrink: 0;
    }

    .ah-footer-tagline-text {
      font-size: 8px;
      letter-spacing: .16em;
      text-transform: uppercase;
      color: rgba(244,239,230,.25);
      line-height: 1.4;
    }

    /* Links grid */
    .ah-footer-links-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .ah-footer-col-title {
      font-size: 9px;
      letter-spacing: .16em;
      text-transform: uppercase;
      color: rgba(244,239,230,.3);
      margin-bottom: 14px;
    }

    .ah-footer-links {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .ah-footer-link {
      font-size: 13px;
      color: rgba(244,239,230,.55);
      text-decoration: none;
      transition: color .2s;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 0;
      -webkit-tap-highlight-color: transparent;
      min-height: 44px;
      align-items: center;
    }

    .ah-footer-link:active {
      color: var(--ah-gold);
    }

    .ah-footer-link-highlight {
      font-size: 13px;
      font-weight: 500;
      color: rgba(244,239,230,.7);
      text-decoration: none;
      transition: color .2s;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 4px 0;
      -webkit-tap-highlight-color: transparent;
      min-height: 44px;
      align-items: center;
    }

    .ah-footer-link-highlight:active {
      color: var(--ah-gold);
    }

    /* ── Bottom bar ── */
    .ah-footer-bottom {
      border-top: 1px solid rgba(244,239,230,.06);
      padding: 0 20px;
    }

    .ah-footer-bottom-inner {
      min-height: 56px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding: 20px 0;
    }

    .ah-footer-copy {
      font-size: 10px;
      letter-spacing: .1em;
      text-transform: uppercase;
      color: rgba(244,239,230,.2);
      text-align: center;
    }

    .ah-footer-socials {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .ah-footer-social {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(244,239,230,.1);
      border-radius: 4px;
      color: rgba(244,239,230,.3);
      text-decoration: none;
      transition: color .2s, border-color .2s, background .2s;
      -webkit-tap-highlight-color: transparent;
    }

    .ah-footer-social:active {
      color: var(--ah-gold);
      border-color: var(--ah-gold);
      background: rgba(196,148,74,.1);
    }
  `;

  function injectStyles() {
    if (document.getElementById('ah-footer-mobile-styles')) return;
    const style = document.createElement('style');
    style.id = 'ah-footer-mobile-styles';
    style.textContent = STYLES;
    document.head.appendChild(style);
  }

  const MARQUEE_ITEMS = [
    'Romantic', 'Sky', 'Cinema', 'Nature', 'Minimal',
    'Boutique mood', 'Minimal luxury', 'Unique concepts', 'Another House'
  ];

  function buildMarquee() {
    const doubled = MARQUEE_ITEMS.concat(MARQUEE_ITEMS);
    return doubled.map(item => {
      return `<span class="ah-footer-marquee-item"><span class="ah-footer-marquee-dot"></span>${item}</span>`;
    }).join('');
  }

  function getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop().replace('.html', '') || 'index';
    return filename;
  }

  function getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/mobile/')) {
      return '../';
    }
    return '';
  }

  function renderFooter() {
    const mount = document.getElementById('siteFooter');
    if (!mount) return;

    injectStyles();

    const basePath = getBasePath();
    const currentPage = getCurrentPage();

    mount.innerHTML = `
      <footer class="ah-footer" role="contentinfo">

        <!-- Marquee strip -->
        <div class="ah-footer-marquee" aria-hidden="true">
          <div class="ah-footer-marquee-inner">${buildMarquee()}</div>
        </div>

        <!-- Main content -->
        <div class="ah-footer-top">

          <!-- Brand -->
          <div class="ah-footer-brand">
            <div class="ah-footer-brand-name">Another House</div>
            <p class="ah-footer-brand-desc">A creative boutique homestay with unique themed rooms. Minimal luxury, unique concepts.</p>
            <div class="ah-footer-tagline">
              <span class="ah-footer-tagline-line"></span>
              <span class="ah-footer-tagline-text">Boutique mood · Minimal luxury · Unique concepts</span>
            </div>
          </div>

          <!-- Links grid -->
          <div class="ah-footer-links-grid">
            <!-- Navigate -->
            <div>
              <div class="ah-footer-col-title">Navigate</div>
              <div class="ah-footer-links">
                <a href="${basePath}index.html" class="ah-footer-link ${currentPage === 'index' ? 'ah-footer-link-active' : ''}">Home</a>
                <a href="${basePath}rooms.html" class="ah-footer-link ${currentPage === 'rooms' ? 'ah-footer-link-active' : ''}">Rooms</a>
                <a href="${basePath}about.html" class="ah-footer-link ${currentPage === 'about' ? 'ah-footer-link-active' : ''}">About</a>
                <a href="${basePath}contact.html" class="ah-footer-link ${currentPage === 'contact' ? 'ah-footer-link-active' : ''}">Contact</a>
              </div>
            </div>

            <!-- Stay -->
            <div>
              <div class="ah-footer-col-title">Stay</div>
              <div class="ah-footer-links">
                <a href="${basePath}booking.html" class="ah-footer-link-highlight">
                  Book a room
                  <svg width="12" height="9" viewBox="0 0 12 9" fill="none" aria-hidden="true">
                    <path d="M1 4.5h10M7 1l3.5 3.5L7 8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </a>
                <a href="${basePath}contact.html" class="ah-footer-link">Ask a question</a>
                <a href="${basePath}rooms.html" class="ah-footer-link">View all rooms</a>
              </div>
            </div>
          </div>

        </div>

        <!-- Bottom bar -->
        <div class="ah-footer-bottom">
          <div class="ah-footer-bottom-inner">
            <span class="ah-footer-copy">© <span id="ahFooterYear"></span> Another House</span>

            <div class="ah-footer-socials" aria-label="Social links">
              <!-- Instagram -->
              <a href="#" class="ah-footer-social" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r=".5" fill="currentColor"/>
                </svg>
              </a>
              <!-- Facebook -->
              <a href="#" class="ah-footer-social" aria-label="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <!-- TikTok -->
              <a href="#" class="ah-footer-social" aria-label="TikTok">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

      </footer>
    `;

    const yearEl = document.getElementById('ahFooterYear');
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }
  }

  // Auto-detect if we're in mobile folder and adjust paths
  renderFooter();
  window.AH_renderFooter = renderFooter;

})();
