import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { AdSense } from './AdSense';

interface InterstitialAdProps {
  onDismiss: () => void;
  show: boolean;
}

export function InterstitialAd({ onDismiss, show }: InterstitialAdProps) {
  const [countdown, setCountdown] = useState(3);
  const [canDismiss, setCanDismiss] = useState(false);

  useEffect(() => {
    if (!show) return;

    // Reset state when ad is shown
    setCountdown(3);
    setCanDismiss(false);

    // Countdown timer before user can dismiss
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanDismiss(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Prevent body scroll when interstitial is showing
    document.body.style.overflow = 'hidden';

    return () => {
      clearInterval(timer);
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white md:hidden">
      {/* Header with close button */}
      <div className="relative bg-gradient-to-r from-primary-600 to-accent-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Advertisement</p>
            <p className="text-xs opacity-90">
              {canDismiss ? 'Tap X to continue' : `Continue in ${countdown}s`}
            </p>
          </div>
          {canDismiss && (
            <button
              onClick={onDismiss}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              aria-label="Close advertisement"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Ad Content Area */}
      <div className="flex items-center justify-center p-4 h-[calc(100vh-80px)]">
        <div className="w-full max-w-md">
          {/* Google AdSense Interstitial Ad */}
          <div className="bg-white rounded-lg shadow-xl border-2 border-gray-200 overflow-hidden">
            <AdSense
              slot="5678901234"
              format="auto"
              responsive={true}
              className="min-h-[300px] flex items-center justify-center"
            />
          </div>

          {/* Continue prompt */}
          {canDismiss && (
            <div className="mt-6 text-center animate-fade-in">
              <button
                onClick={onDismiss}
                className="w-full max-w-xs mx-auto px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                Continue to Calculator
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer hint */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-center text-xs text-gray-500">
        <p>Ads help us keep these tools free for everyone</p>
      </div>
    </div>
  );
}

/**
 * Hook to manage interstitial ad display
 * Shows ad on mobile devices with frequency control
 */
export function useInterstitialAd() {
  const [showInterstitial, setShowInterstitial] = useState(false);

  const shouldShowAd = (): boolean => {
    // Only show on mobile devices
    if (window.innerWidth >= 768) return false;

    // Check if we should show the ad based on frequency
    const lastShown = localStorage.getItem('interstitial_last_shown');
    const showCount = parseInt(localStorage.getItem('interstitial_count') || '0');

    if (!lastShown) {
      // First time - show the ad
      return true;
    }

    const lastShownTime = parseInt(lastShown);
    const now = Date.now();
    const timeSinceLastShown = now - lastShownTime;

    // Show ad every 3rd calculator visit or after 5 minutes
    const FIVE_MINUTES = 5 * 60 * 1000;
    if (timeSinceLastShown > FIVE_MINUTES || showCount % 3 === 0) {
      return true;
    }

    return false;
  };

  const triggerInterstitial = () => {
    if (shouldShowAd()) {
      setShowInterstitial(true);

      // Update tracking
      localStorage.setItem('interstitial_last_shown', Date.now().toString());
      const currentCount = parseInt(localStorage.getItem('interstitial_count') || '0');
      localStorage.setItem('interstitial_count', (currentCount + 1).toString());
    }
  };

  const dismissInterstitial = () => {
    setShowInterstitial(false);
  };

  return {
    showInterstitial,
    triggerInterstitial,
    dismissInterstitial,
  };
}
