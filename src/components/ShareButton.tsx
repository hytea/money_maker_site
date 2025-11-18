import { useState } from 'react';
import { Share2, Facebook, Twitter, Link2, Check, History } from 'lucide-react';
import { Button } from './ui/button';
import { createSharedResult, generateShareUrl, incrementShareCount } from '../lib/sharedResults';
import { addToHistory } from '../lib/calculationHistory';

interface ShareButtonProps {
  calculatorType: string;
  title: string;
  description: string;
  inputs: Record<string, any>;
  results: Record<string, any>;
  className?: string;
}

export function ShareButton({
  calculatorType,
  title,
  description,
  inputs,
  results,
  className = '',
}: ShareButtonProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };

  const handleSaveToHistory = () => {
    addToHistory(calculatorType, inputs, results, title);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const createShareLink = (): string => {
    const shareId = createSharedResult(calculatorType, title, inputs, results);
    return generateShareUrl(shareId);
  };

  const handleCopyLink = async () => {
    const shareUrl = createShareLink();
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleShareFacebook = () => {
    const shareUrl = createShareLink();
    incrementShareCount(shareUrl.split('/').pop() || '');
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const handleShareTwitter = () => {
    const shareUrl = createShareLink();
    incrementShareCount(shareUrl.split('/').pop() || '');
    const text = `${title} - ${description}`;
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const handleShareNative = async () => {
    const shareUrl = createShareLink();
    incrementShareCount(shareUrl.split('/').pop() || '');

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex gap-2">
        <Button
          onClick={handleSaveToHistory}
          variant="outline"
          className="flex-1"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <History className="w-4 h-4 mr-2" />
              Save
            </>
          )}
        </Button>

        <Button
          onClick={handleShare}
          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Result
        </Button>
      </div>

      {showShareMenu && (
        <div className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 z-50 min-w-[280px]">
          <p className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">
            Share your calculation
          </p>

          <div className="space-y-2">
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="w-full justify-start"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Link Copied!
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>

            <Button
              onClick={handleShareFacebook}
              variant="outline"
              className="w-full justify-start text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <Facebook className="w-4 h-4 mr-2" />
              Share on Facebook
            </Button>

            <Button
              onClick={handleShareTwitter}
              variant="outline"
              className="w-full justify-start text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20"
            >
              <Twitter className="w-4 h-4 mr-2" />
              Share on Twitter
            </Button>

            {'share' in navigator && (
              <Button
                onClick={handleShareNative}
                variant="outline"
                className="w-full justify-start"
              >
                <Share2 className="w-4 h-4 mr-2" />
                More Options
              </Button>
            )}
          </div>

          <button
            onClick={() => setShowShareMenu(false)}
            className="mt-3 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 w-full text-center"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
