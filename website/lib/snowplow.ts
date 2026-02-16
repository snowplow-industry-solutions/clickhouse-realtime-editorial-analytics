import { newTracker, trackPageView, enableActivityTracking, setUserId, addPlugin } from '@snowplow/browser-tracker';
import { LinkClickTrackingPlugin, enableLinkClickTracking } from '@snowplow/browser-plugin-link-click-tracking';
import { 
  EnhancedConsentPlugin,
  trackConsentAllow, 
  trackConsentDeny, 
  trackConsentSelected, 
  trackConsentWithdrawn,
  trackCmpVisible 
} from '@snowplow/browser-plugin-enhanced-consent';
import { SnowplowMediaPlugin } from '@snowplow/browser-plugin-media';
import {
  startMediaTracking,
  trackMediaPlay,
  trackMediaPause,
  trackMediaEnd,
  trackMediaSeekStart,
  trackMediaSeekEnd,
  trackMediaVolumeChange,
  trackMediaFullscreenChange
} from '@snowplow/browser-plugin-media';

  // Initialize Snowplow tracker
export function initializeSnowplow() {
  newTracker('sp1', 'http://localhost:9090', {
    appId: 'realtime-editorial-analytics-app',
    appVersion: '0.1.0',
    cookieSameSite: 'Lax',
    eventMethod: 'post',
    bufferSize: 1,
    contexts: {
      webPage: true
    },
    plugins: [LinkClickTrackingPlugin(), EnhancedConsentPlugin(), SnowplowMediaPlugin()],
    crossDomainLinker: function (linkElement) {
      // Enable cross-domain linking for snowplow.io domain
      // This adds a _sp parameter to outbound links containing the domain user ID and timestamp
      // The enrichment process will populate refr_domain_userid and refr_dvce_tstamp fields
      return linkElement.hostname === 'snowplow.io';
    }
  });

    const CustomPlugin = {
      plugin: {
          beforeTrack: (payloadBuilder) => {
              let pageTitle = document.title;
              if (window.location.pathname.startsWith('/articles/')) {
                const h1 = document.querySelector('h1');
                if (h1?.textContent) {
                  pageTitle = h1.textContent;
                }
              }
              payloadBuilder.add('page', pageTitle);
              payloadBuilder.build();
          },
      }
  };

  //Add the plugin to the tracker
  addPlugin(CustomPlugin);


  // Enable activity tracking (page pings)
  enableActivityTracking({
    minimumVisitLength: 1,
    heartbeatDelay: 5
  });

  // Enable link click tracking with recommended settings
  enableLinkClickTracking({
    trackContent: true, // Capture link text content
    options: {
      // Optional: Add any filtering criteria here if needed
      // denylist: ['no-track'], // Exclude links with 'no-track' class
      // allowlist: ['track-me'], // Only track links with 'track-me' class
    }
  });

  // Restore user ID from localStorage if available
  restoreUserFromStorage();

  console.log('Snowplow tracker initialized');
}

// Restore user ID from localStorage
function restoreUserFromStorage() {
  if (typeof window !== 'undefined') {
    const savedUser = localStorage.getItem("demo-user");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        if (userData.email) {
          setUserId(userData.email);
          console.log('User ID restored from storage:', userData.email);
        }
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("demo-user");
      }
    }
  }
}

// Track page view
export function trackPageViewEvent() {
  // Ensure user ID is restored before tracking
  restoreUserFromStorage();
  trackPageView();
  
  // Clean up _sp parameter from URL after page view is tracked
  // This prevents the parameter from being shared when users copy the URL
  if (typeof window !== 'undefined' && /[?&]_sp=/.test(window.location.href)) {
    const cleanUrl = window.location.href.replace(/&?_sp=[^&]+/, '');
    history.replaceState(history.state, "", cleanUrl);
    console.log('Cleaned _sp parameter from URL');
  }
  
  console.log('Page view tracked');
}

// Set user ID for tracking
export function setUserForTracking(email: string) {
  setUserId(email);
  console.log('User ID set for tracking:', email);
}

// Clear user ID (for logout)
export function clearUserForTracking() {
  setUserId(null);
  console.log('User ID cleared for tracking');
}

// Enable cross-domain linking for dynamically added links
export function enableCrossDomainLinking() {
  if (typeof window !== 'undefined' && (window as any).snowplow) {
    (window as any).snowplow('crossDomainLinker', function (linkElement: HTMLAnchorElement) {
      // Enable cross-domain linking for snowplow.io domain
      return linkElement.hostname === 'snowplow.io';
    });
    console.log('Cross-domain linking enabled for dynamic links');
  }
}

// Initialize tracker only (no page view tracking)
export function initializeSnowplowOnly() {
  initializeSnowplow();
}

// Enhanced Consent Plugin tracking functions
/**
 * Track consent allow event
 */
export function trackConsentAllowEvent(consentScopes: string[]) {
  trackConsentAllow({
    consentScopes,
    basisForProcessing: "consent",
    consentUrl: window.location.origin + "/privacy-policy",
    consentVersion: "1.0",
    domainsApplied: [window.location.hostname],
    gdprApplies: true
  });
}

/**
 * Track consent deny event
 */
export function trackConsentDenyEvent(consentScopes: string[]) {
  trackConsentDeny({
    consentScopes,
    basisForProcessing: "consent",
    consentUrl: window.location.origin + "/privacy-policy",
    consentVersion: "1.0",
    domainsApplied: [window.location.hostname],
    gdprApplies: true
  });
}

/**
 * Track consent selected event (for custom preferences)
 */
export function trackConsentSelectedEvent(consentScopes: string[]) {
  trackConsentSelected({
    consentScopes,
    basisForProcessing: "consent",
    consentUrl: window.location.origin + "/privacy-policy",
    consentVersion: "1.0",
    domainsApplied: [window.location.hostname],
    gdprApplies: true
  });
}

/**
 * Track consent withdrawn event
 */
export function trackConsentWithdrawnEvent(consentScopes: string[]) {
  trackConsentWithdrawn({
    consentScopes,
    basisForProcessing: "consent",
    consentUrl: window.location.origin + "/privacy-policy",
    consentVersion: "1.0",
    domainsApplied: [window.location.hostname],
    gdprApplies: true
  });
}

/**
 * Track CMP visible event
 */
export function trackCmpVisibleEvent() {
  trackCmpVisible({
    elapsedTime: performance.now(),
  });
}

// Media Tracking functions
/**
 * Initialize media tracking for a video
 */
export function initializeVideoTracking(videoId: string) {
  startMediaTracking({
    id: videoId,
    boundaries: [25, 50, 75, 100]
  });
  console.log('Video tracking initialized:', videoId);
}

/**
 * Track video popup open event
 */
export function trackVideoPopupOpenEvent(videoUrl: string, videoId: string) {
  // Initialize tracking first
  initializeVideoTracking(videoId);
  
  // Track play event
  trackMediaPlay({
    id: videoId
  });
  console.log('Video popup open tracked:', videoId);
}

/**
 * Track video popup close event
 */
export function trackVideoPopupCloseEvent(videoId: string) {
  trackMediaEnd({
    id: videoId
  });
  console.log('Video popup close tracked:', videoId);
}

export function trackVideoPopupPauseEvent(videoId: string) {
  trackMediaPause({ id: videoId });
  console.log('Video popup pause tracked:', videoId);
}

export function trackVideoPopupSeekStartEvent(videoId: string) {
  trackMediaSeekStart({ id: videoId });
  console.log('Video popup seek start tracked:', videoId);
}

export function trackVideoPopupSeekEndEvent(videoId: string) {
  trackMediaSeekEnd({ id: videoId });
  console.log('Video popup seek end tracked:', videoId);
}

export function trackVideoPopupVolumeChangeEvent(videoId: string, newVolume: number) {
  trackMediaVolumeChange({ id: videoId, newVolume });
  console.log('Video popup volume change tracked:', videoId, newVolume);
}

export function trackVideoPopupFullscreenChangeEvent(videoId: string, fullscreen: boolean) {
  trackMediaFullscreenChange({ id: videoId, fullscreen });
  console.log('Video popup fullscreen change tracked:', videoId, fullscreen);
}