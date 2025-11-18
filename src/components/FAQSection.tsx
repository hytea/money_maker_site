import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { getFAQs, getFAQSchema } from '@/utils/faqs';
import { useEffect } from 'react';

interface FAQSectionProps {
  toolPath: string;
  limit?: number;
}

export function FAQSection({ toolPath, limit }: FAQSectionProps) {
  const allFAQs = getFAQs(toolPath);
  const faqs = limit ? allFAQs.slice(0, limit) : allFAQs;
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First question open by default

  useEffect(() => {
    // Add FAQ schema to page for SEO
    const schema = getFAQSchema(toolPath);
    if (!schema) return;

    const scriptId = 'faq-schema';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (script) {
      script.textContent = JSON.stringify(schema);
    } else {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [toolPath]);

  if (faqs.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 sm:mt-16">
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle className="h-5 w-5 text-primary-600" />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={faq.question}
              className="border-2 border-gray-200 rounded-lg overflow-hidden bg-white"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full px-5 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                {isOpen ? (
                  <ChevronUp className="h-5 w-5 text-primary-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-4 pt-1">
                  <p className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
