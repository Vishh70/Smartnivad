"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

// Interface for the BeforeInstallPromptEvent which is not fully standardized yet
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user already dismissed it
    const hasDismissed = localStorage.getItem("pwa-install-dismissed");
    if (hasDismissed === "true") return;

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();

      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Show the banner
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsVisible(false);
    }

    // We can't use the prompt again
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg px-4 py-3 sm:hidden animate-in slide-in-from-bottom-full duration-300">
      <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0 overflow-hidden relative">
            <Image
              src="/icons/icon-192.png"
              alt="App Icon"
              fill
              className="object-contain p-1"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-sm truncate text-gray-900">
              Install SmartNivad
            </span>
            <span className="text-xs text-gray-500 truncate">
              Get the app for a faster experience
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleInstallClick}
            className="px-3 h-8 text-sm bg-gray-900 hover:bg-gray-800 text-white rounded-full font-medium transition-colors"
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
