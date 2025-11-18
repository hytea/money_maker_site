import { useEffect } from 'react';

// Extend Window interface for AdSense
declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdSenseProps {
  slot: string;
  format?: string;
  responsive?: boolean;
  className?: string;
}

export function AdSense({ slot, format = 'auto', responsive = true, className = '' }: AdSenseProps) {
  const publisherId = import.meta.env.VITE_ADSENSE_PUBLISHER_ID;

  useEffect(() => {
    try {
      if (window.adsbygoogle && import.meta.env.MODE === 'production') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  // Don't render ad if publisher ID is not configured
  if (!publisherId || publisherId === 'ca-pub-XXXXXXXXXXXXXXXX') {
    return <AdPlaceholder label="AdSense Not Configured" className={className} />;
  }

  return (
    <div className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  );
}

// Placeholder component for development
export function AdPlaceholder({ label = 'Advertisement', className = '' }: { label?: string, className?: string }) {
  return (
    <div className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center ${className}`}>
      <p className="text-gray-500 font-medium">{label}</p>
      <p className="text-xs text-gray-400 mt-2">300x250 or responsive</p>
    </div>
  );
}
