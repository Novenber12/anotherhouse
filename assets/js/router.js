// Another House — Responsive Router
// Detects screen size and loads appropriate version (desktop/mobile)
// Place this script in <head> for immediate redirect before page renders

(function() {
  'use strict';

  const MOBILE_BREAKPOINT = 768;
  const PAGE_MAP = {
    'index': { desktop: 'desktop/indexDesktop.html', mobile: 'mobile/indexMobile.html' },
    'about': { desktop: 'desktop/aboutDesktop.html', mobile: 'mobile/aboutMobile.html' },
    'rooms': { desktop: 'desktop/roomsDesktop.html', mobile: 'mobile/roomsMobile.html' },
    'booking': { desktop: 'desktop/bookingDesktop.html', mobile: 'mobile/bookingMobile.html' },
    'contact': { desktop: 'desktop/contactDesktop.html', mobile: 'mobile/contactMobile.html' },
    'roomDetail': { desktop: 'desktop/roomDetailDesktop.html', mobile: 'mobile/roomDetailMobile.html' },
    'news': { desktop: 'desktop/newsDesktop.html', mobile: 'mobile/newsMobile.html' },
    'newDetail': { desktop: 'desktop/newDetailDesktop.html', mobile: 'mobile/newDetailMobile.html' }
  };

  function getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop().replace('.html', '') || 'index';
    return filename;
  }

  function isMobile() {
    // Check both window width and user agent for better detection
    return window.innerWidth < MOBILE_BREAKPOINT || 
           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  function getTargetUrl(page, mobile) {
    const mapping = PAGE_MAP[page];
    if (!mapping) return null;
    
    // Preserve query string and hash
    const queryString = window.location.search;
    const hash = window.location.hash;
    const targetPath = mobile ? mapping.mobile : mapping.desktop;
    return targetPath + queryString + hash;
  }

  function redirect() {
    const page = getCurrentPage();
    
    // Skip if already on desktop/mobile version
    if (window.location.pathname.includes('/desktop/') || 
        window.location.pathname.includes('/mobile/')) {
      return;
    }

    const mobile = isMobile();
    const targetUrl = getTargetUrl(page, mobile);
    
    if (targetUrl) {
      window.location.replace(targetUrl);
    }
  }

  // Execute redirect immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', redirect);
  } else {
    redirect();
  }
})();
