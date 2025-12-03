"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  useState,
  type ReactNode,
} from "react";

/** Cookie consent preferences stored in localStorage */
export interface CookieConsent {
  /** Whether the user has made a consent decision */
  hasConsented: boolean;
  /** Essential cookies (always true, cannot be disabled) */
  essential: boolean;
  /** Analytics cookies (Google Analytics, Vercel Analytics) */
  analytics: boolean;
  /** Advertising/marketing cookies */
  advertising: boolean;
  /** Performance cookies (Sentry error tracking) */
  performance: boolean;
  /** Timestamp when consent was given/updated */
  timestamp: string | null;
}

/** Default consent state before user makes a choice */
const DEFAULT_CONSENT: CookieConsent = {
  hasConsented: false,
  essential: true, // Always enabled
  analytics: false,
  advertising: false,
  performance: false,
  timestamp: null,
};

/** LocalStorage key for storing cookie consent */
const COOKIE_CONSENT_KEY = "volvox-cookie-consent";

/**
 * Cached consent snapshot to prevent infinite loops with useSyncExternalStore.
 * useSyncExternalStore requires getSnapshot to return the same object reference
 * if the underlying data hasn't changed.
 */
let cachedConsentString: string | null = null;
let cachedConsent: CookieConsent = DEFAULT_CONSENT;

/**
 * Read consent from localStorage with caching.
 * Returns the same object reference if localStorage hasn't changed,
 * which is required by useSyncExternalStore to prevent infinite loops.
 */
function getStoredConsent(): CookieConsent {
  if (typeof window === "undefined") {
    return DEFAULT_CONSENT;
  }
  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    // Only parse and create a new object if the string value changed
    if (stored !== cachedConsentString) {
      cachedConsentString = stored;
      if (stored) {
        cachedConsent = JSON.parse(stored) as CookieConsent;
      } else {
        cachedConsent = DEFAULT_CONSENT;
      }
    }
    return cachedConsent;
  } catch {
    // If parsing fails, return cached or default
    return cachedConsent;
  }
}

/**
 * Save consent to localStorage
 */
function saveStoredConsent(consent: CookieConsent): void {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
  } catch {
    // Silently fail if localStorage is not available
  }
}

/**
 * Subscribe to storage events for cross-tab synchronization
 */
function subscribeToStorage(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

/**
 * Get snapshot for server rendering (returns default)
 */
function getServerSnapshot(): CookieConsent {
  return DEFAULT_CONSENT;
}

interface CookieConsentContextType {
  /** Current consent preferences */
  consent: CookieConsent;
  /** Whether the consent banner should be shown */
  showBanner: boolean;
  /** Accept all cookies */
  acceptAll: () => void;
  /** Decline all non-essential cookies */
  declineAll: () => void;
  /** Update specific consent preferences */
  updateConsent: (
    preferences: Partial<Omit<CookieConsent, "essential">>
  ) => void;
  /** Reset consent and show banner again */
  resetConsent: () => void;
  /** Open the cookie settings modal */
  openSettings: () => void;
  /** Close the cookie settings modal */
  closeSettings: () => void;
  /** Whether the settings modal is open */
  isSettingsOpen: boolean;
}

const CookieConsentContext = createContext<
  CookieConsentContextType | undefined
>(undefined);

interface CookieConsentProviderProps {
  children: ReactNode;
}

/**
 * Provides cookie consent state management throughout the application.
 * Handles persistence to localStorage and exposes methods to update consent.
 * Uses useSyncExternalStore for proper hydration and cross-tab synchronization.
 *
 * @param props - Provider props containing children
 * @returns Provider component wrapping children with cookie consent context
 */
export function CookieConsentProvider({
  children,
}: CookieConsentProviderProps) {
  // Use useSyncExternalStore for localStorage synchronization
  // This properly handles hydration mismatches and avoids setState in effects
  const consent = useSyncExternalStore(
    subscribeToStorage,
    getStoredConsent,
    getServerSnapshot
  );

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Derive showBanner from consent state
  const showBanner = !consent.hasConsented;

  const acceptAll = useCallback(() => {
    const newConsent: CookieConsent = {
      hasConsented: true,
      essential: true,
      analytics: true,
      advertising: true,
      performance: true,
      timestamp: new Date().toISOString(),
    };
    saveStoredConsent(newConsent);
    // Dispatch storage event to trigger re-render via useSyncExternalStore
    window.dispatchEvent(
      new StorageEvent("storage", { key: COOKIE_CONSENT_KEY })
    );
    setIsSettingsOpen(false);
  }, []);

  const declineAll = useCallback(() => {
    const newConsent: CookieConsent = {
      hasConsented: true,
      essential: true,
      analytics: false,
      advertising: false,
      performance: false,
      timestamp: new Date().toISOString(),
    };
    saveStoredConsent(newConsent);
    window.dispatchEvent(
      new StorageEvent("storage", { key: COOKIE_CONSENT_KEY })
    );
    setIsSettingsOpen(false);
  }, []);

  const updateConsent = useCallback(
    (preferences: Partial<Omit<CookieConsent, "essential">>) => {
      const currentConsent = getStoredConsent();
      const newConsent: CookieConsent = {
        ...currentConsent,
        ...preferences,
        essential: true, // Essential is always true
        hasConsented: true,
        timestamp: new Date().toISOString(),
      };
      saveStoredConsent(newConsent);
      window.dispatchEvent(
        new StorageEvent("storage", { key: COOKIE_CONSENT_KEY })
      );
      setIsSettingsOpen(false);
    },
    []
  );

  const resetConsent = useCallback(() => {
    try {
      localStorage.removeItem(COOKIE_CONSENT_KEY);
    } catch {
      // Silently fail
    }
    window.dispatchEvent(
      new StorageEvent("storage", { key: COOKIE_CONSENT_KEY })
    );
  }, []);

  const openSettings = useCallback(() => {
    setIsSettingsOpen(true);
  }, []);

  const closeSettings = useCallback(() => {
    setIsSettingsOpen(false);
  }, []);

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        showBanner,
        acceptAll,
        declineAll,
        updateConsent,
        resetConsent,
        openSettings,
        closeSettings,
        isSettingsOpen,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

/**
 * Hook to access cookie consent state and methods.
 *
 * @returns Cookie consent context value
 * @throws Error if used outside of CookieConsentProvider
 */
export function useCookieConsent(): CookieConsentContextType {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error(
      "useCookieConsent must be used within a CookieConsentProvider"
    );
  }
  return context;
}
