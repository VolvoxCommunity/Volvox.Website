"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Cookie, Gear } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCookieConsent } from "@/components/providers/cookie-consent-provider";
import { cn } from "@/lib/utils";

interface CookieToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

/**
 * Toggle switch for individual cookie category preferences.
 */
function CookieToggle({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: CookieToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-border last:border-0">
      <div className="flex-1">
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={`Toggle ${label}`}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          "relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          checked ? "bg-primary" : "bg-input"
        )}
      >
        <span
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-md ring-0 transition-transform duration-200 ease-in-out",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
}

/**
 * Cookie consent banner displayed at the bottom of the page.
 * Shows on first visit and allows users to accept/decline cookies.
 *
 * @returns Cookie consent banner component
 */
export function CookieConsentBanner() {
  const {
    consent,
    showBanner,
    acceptAll,
    declineAll,
    updateConsent,
    isSettingsOpen,
    openSettings,
    closeSettings,
  } = useCookieConsent();

  // Local state for settings modal toggles
  const [localAnalytics, setLocalAnalytics] = useState(consent.analytics);
  const [localAdvertising, setLocalAdvertising] = useState(consent.advertising);
  const [localPerformance, setLocalPerformance] = useState(consent.performance);

  // Reset local state when modal opens
  const handleOpenSettings = () => {
    setLocalAnalytics(consent.analytics);
    setLocalAdvertising(consent.advertising);
    setLocalPerformance(consent.performance);
    openSettings();
  };

  // Save custom preferences
  const handleSavePreferences = () => {
    updateConsent({
      analytics: localAnalytics,
      advertising: localAdvertising,
      performance: localPerformance,
    });
  };

  // Accept all - update local state first for visual feedback, then save
  const handleAcceptAll = () => {
    setLocalAnalytics(true);
    setLocalAdvertising(true);
    setLocalPerformance(true);
    acceptAll();
  };

  // Decline all - update local state first for visual feedback, then save
  const handleDeclineAll = () => {
    setLocalAnalytics(false);
    setLocalAdvertising(false);
    setLocalPerformance(false);
    declineAll();
  };

  return (
    <>
      {/* Cookie Consent Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
          >
            <div className="mx-auto max-w-4xl">
              <div
                className="rounded-xl border bg-background/95 backdrop-blur-sm shadow-lg p-4 md:p-6"
                data-testid="cookie-consent-banner"
              >
                <div className="flex items-start gap-4">
                  <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Cookie className="h-5 w-5 text-primary" weight="duotone" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          Cookie Preferences
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          We use cookies to enhance your browsing experience,
                          serve personalized ads or content, and analyze our
                          traffic. By clicking &ldquo;Accept All&rdquo;, you
                          consent to our use of cookies. Read our{" "}
                          <Link
                            href="/privacy"
                            className="text-primary hover:underline"
                          >
                            Privacy Policy
                          </Link>{" "}
                          for more information.
                        </p>
                      </div>
                      <button
                        onClick={declineAll}
                        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1 -m-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-sm"
                        aria-label="Decline all cookies"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleOpenSettings}
                        className="gap-2"
                      >
                        <Gear className="h-4 w-4" />
                        Customize
                      </Button>
                      <Button variant="outline" size="sm" onClick={declineAll}>
                        Decline All
                      </Button>
                      <Button size="sm" onClick={acceptAll}>
                        Accept All
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cookie Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={closeSettings}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5 text-primary" weight="duotone" />
              Cookie Settings
            </DialogTitle>
            <DialogDescription>
              Manage your cookie preferences. Essential cookies cannot be
              disabled as they are required for the website to function.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-1">
            <CookieToggle
              label="Essential Cookies"
              description="Required for basic website functionality. These cannot be disabled."
              checked={true}
              onChange={() => {}}
              disabled
            />
            <CookieToggle
              label="Analytics Cookies"
              description="Help us understand how visitors interact with our website using Google Analytics and Vercel Analytics."
              checked={localAnalytics}
              onChange={setLocalAnalytics}
            />
            <CookieToggle
              label="Advertising Cookies"
              description="Used to deliver relevant advertisements and track the effectiveness of our advertising campaigns."
              checked={localAdvertising}
              onChange={setLocalAdvertising}
            />
            <CookieToggle
              label="Performance Cookies"
              description="Help us monitor and improve website performance through error tracking (Sentry)."
              checked={localPerformance}
              onChange={setLocalPerformance}
            />
          </div>
          <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <Button variant="outline" onClick={handleDeclineAll}>
              Decline All
            </Button>
            <Button variant="outline" onClick={handleAcceptAll}>
              Accept All
            </Button>
            <Button onClick={handleSavePreferences}>Save Preferences</Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground text-center">
            For more information, read our{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}

/**
 * Button to open cookie settings from the footer.
 * Uses the same context as the banner for consistent state.
 *
 * @returns Cookie settings button component
 */
export function CookieSettingsButton() {
  const { openSettings } = useCookieConsent();

  return (
    <button
      onClick={openSettings}
      className="hover:text-foreground transition-colors underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-sm"
    >
      Cookie Settings
    </button>
  );
}
