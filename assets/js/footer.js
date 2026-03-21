// Another House — redesigned footer injector
// Usage: add `<div id="siteFooter"></div>` before closing </body>,
// then include this script after `assets/js/header.js`.

(function () {

    var STYLES = `
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
  
      #siteFooter * { box-sizing: border-box; }
  
      #siteFooter {
        --ah-cream:   #F4EFE6;
        --ah-ink:     #191614;
        --ah-ink60:   rgba(25,22,20,.6);
        --ah-ink30:   rgba(25,22,20,.3);
        --ah-ink10:   rgba(25,22,20,.1);
        --ah-gold:    #C4944A;
        --ah-olive:   #5A6545;
      }
  
      .ah-footer {
        background: var(--ah-ink);
        color: var(--ah-cream);
        font-family: 'DM Sans', sans-serif;
        font-weight: 300;
        -webkit-font-smoothing: antialiased;
      }
  
      /* ── Top strip ── */
      .ah-footer-top {
        border-bottom: 1px solid rgba(244,239,230,.06);
        padding: 64px 40px 56px;
        max-width: 1280px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 2fr 1fr 1fr;
        gap: 48px;
      }
      @media (max-width: 768px) {
        .ah-footer-top { grid-template-columns: 1fr; gap: 36px; padding: 48px 20px 40px; }
      }
  
      /* Brand column */
      .ah-footer-brand {}
  
      .ah-footer-brand-name {
        font-family: 'Cormorant Garamond', serif;
        font-size: 26px; font-weight: 300;
        letter-spacing: .04em;
        color: var(--ah-cream);
        line-height: 1;
        margin-bottom: 14px;
      }
  
      .ah-footer-brand-desc {
        font-size: 13px;
        color: rgba(244,239,230,.4);
        line-height: 1.75;
        max-width: 260px;
        margin-bottom: 28px;
      }
  
      .ah-footer-tagline {
        display: flex; align-items: center; gap: 10px;
      }
      .ah-footer-tagline-line {
        display: inline-block; width: 24px; height: 1px;
        background: var(--ah-gold); flex-shrink: 0;
      }
      .ah-footer-tagline-text {
        font-size: 9px; letter-spacing: .2em; text-transform: uppercase;
        color: rgba(244,239,230,.25);
      }
  
      /* Nav columns */
      .ah-footer-col-title {
        font-size: 10px; letter-spacing: .2em; text-transform: uppercase;
        color: rgba(244,239,230,.3);
        margin-bottom: 20px;
      }
  
      .ah-footer-links {
        display: flex; flex-direction: column; gap: 12px;
      }
  
      .ah-footer-link {
        font-size: 14px;
        color: rgba(244,239,230,.5);
        text-decoration: none;
        transition: color .2s;
        display: inline-flex; align-items: center; gap: 8px;
      }
      .ah-footer-link:hover { color: var(--ah-gold); }
  
      .ah-footer-link-highlight {
        font-size: 14px; font-weight: 500;
        color: rgba(244,239,230,.7);
        text-decoration: none;
        transition: color .2s;
      }
      .ah-footer-link-highlight:hover { color: var(--ah-gold); }
  
      /* ── Bottom bar ── */
      .ah-footer-bottom {
        border-top: 1px solid rgba(244,239,230,.06);
        padding: 0 40px;
        max-width: 1280px; margin: 0 auto;
      }
      @media (max-width: 768px) { .ah-footer-bottom { padding: 0 20px; } }
  
      .ah-footer-bottom-inner {
        height: 56px;
        display: flex; align-items: center; justify-content: space-between;
        gap: 16px; flex-wrap: wrap;
      }
  
      .ah-footer-copy {
        font-size: 11px; letter-spacing: .1em; text-transform: uppercase;
        color: rgba(244,239,230,.2);
      }
  
      .ah-footer-socials {
        display: flex; align-items: center; gap: 12px;
      }
  
      .ah-footer-social {
        width: 32px; height: 32px;
        display: flex; align-items: center; justify-content: center;
        border: 1px solid rgba(244,239,230,.1);
        border-radius: 2px;
        color: rgba(244,239,230,.3);
        text-decoration: none;
        transition: color .2s, border-color .2s;
      }
      .ah-footer-social:hover { color: var(--ah-gold); border-color: var(--ah-gold); }
  
      /* Marquee divider above footer */
      .ah-footer-marquee {
        background: rgba(244,239,230,.03);
        border-top: 1px solid rgba(244,239,230,.06);
        border-bottom: 1px solid rgba(244,239,230,.06);
        padding: 14px 0;
        overflow: hidden; white-space: nowrap;
      }
      .ah-footer-marquee-inner {
        display: inline-flex; gap: 0;
        animation: ahMarquee 28s linear infinite;
      }
      .ah-footer-marquee-inner:hover { animation-play-state: paused; }
      @keyframes ahMarquee {
        from { transform: translateX(0); }
        to   { transform: translateX(-50%); }
      }
      .ah-footer-marquee-item {
        display: inline-flex; align-items: center; gap: 24px;
        padding: 0 24px;
        font-size: 10px; letter-spacing: .2em; text-transform: uppercase;
        color: rgba(244,239,230,.18);
        font-family: 'DM Sans', sans-serif; font-weight: 400;
      }
      .ah-footer-marquee-dot {
        width: 3px; height: 3px; border-radius: 50%;
        background: var(--ah-gold); opacity: .6; flex-shrink: 0;
      }
    `;
  
    function injectStyles() {
      if (document.getElementById("ah-footer-styles")) return;
      var style = document.createElement("style");
      style.id = "ah-footer-styles";
      style.textContent = STYLES;
      document.head.appendChild(style);
    }
  
    var MARQUEE_ITEMS = [
      "Romantic", "Sky", "Cinema", "Nature", "Minimal",
      "Boutique mood", "Minimal luxury", "Unique concepts", "Another House"
    ];
  
    function buildMarquee() {
      var doubled = MARQUEE_ITEMS.concat(MARQUEE_ITEMS); // seamless loop
      return doubled.map(function(item) {
        return '<span class="ah-footer-marquee-item"><span class="ah-footer-marquee-dot"></span>' + item + '</span>';
      }).join("");
    }
  
    function renderFooter() {
      var mount = document.getElementById("siteFooter");
      if (!mount) return;
  
      injectStyles();
  
      mount.innerHTML = `
        <footer class="ah-footer" role="contentinfo">
  
          <!-- Marquee strip -->
          <div class="ah-footer-marquee" aria-hidden="true">
            <div class="ah-footer-marquee-inner">${buildMarquee()}</div>
          </div>
  
          <!-- Main grid -->
          <div class="ah-footer-top">
  
            <!-- Brand -->
            <div class="ah-footer-brand">
              <div class="ah-footer-brand-name">Another House</div>
              <p class="ah-footer-brand-desc">A creative boutique homestay with unique themed rooms. Minimal luxury, unique concepts.</p>
              <div class="ah-footer-tagline">
                <span class="ah-footer-tagline-line"></span>
                <span class="ah-footer-tagline-text">Boutique mood &nbsp;·&nbsp; Minimal luxury &nbsp;·&nbsp; Unique concepts</span>
              </div>
            </div>
  
            <!-- Navigate -->
            <div>
              <div class="ah-footer-col-title">Navigate</div>
              <div class="ah-footer-links">
                <a href="index.html"   class="ah-footer-link">Home</a>
                <a href="rooms.html"   class="ah-footer-link">Rooms</a>
                <a href="about.html"   class="ah-footer-link">About</a>
                <a href="contact.html" class="ah-footer-link">Contact</a>
              </div>
            </div>
  
            <!-- Book -->
            <div>
              <div class="ah-footer-col-title">Stay</div>
              <div class="ah-footer-links">
                <a href="bookingDesktop.html" class="ah-footer-link-highlight">
                  Book a room
                  <svg width="12" height="9" viewBox="0 0 12 9" fill="none" aria-hidden="true">
                    <path d="M1 4.5h10M7 1l3.5 3.5L7 8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </a>
                <a href="contact.html" class="ah-footer-link">Ask a question</a>
                <a href="rooms.html"   class="ah-footer-link">View all rooms</a>
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
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="2" y="2" width="20" height="20" rx="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r=".5" fill="currentColor"/>
                  </svg>
                </a>
                <!-- Facebook -->
                <a href="#" class="ah-footer-social" aria-label="Facebook">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
                <!-- TikTok -->
                <a href="#" class="ah-footer-social" aria-label="TikTok">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
  
        </footer>
      `;
  
      var yearEl = document.getElementById("ahFooterYear");
      if (yearEl) yearEl.textContent = String(new Date().getFullYear());
    }
  
    renderFooter();
    window.AH_renderFooter = renderFooter;
  
  })();