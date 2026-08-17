import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';
import { FAQItem, Language } from '../types.ts';
import { translations } from '../i18n/translations.ts';

interface FAQSectionProps {
  faq: FAQItem[];
  lang: Language;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ faq, lang }) => {
  const t = translations[lang];
  const [openId, setOpenId] = useState<string | null>(faq[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const filtered = faq.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="faq" className="py-20 bg-slate-950 border-t border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-400 bg-teal-950/80 px-3 py-1 rounded-full border border-teal-500/30">
            {t.faq.title}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.faq.subtitle}
          </h2>
        </div>

        {/* Search within FAQ */}
        <div className="relative max-w-md mx-auto mb-8">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.faq.searchPlaceholder}
            className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-900 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs placeholder-slate-500"
          />
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filtered.length > 0 ? (
            filtered.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-800 overflow-hidden transition-all bg-slate-900/90 shadow-md"
                >
                  <button
                    onClick={() => toggle(item.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-850 transition-colors"
                  >
                    <span className="text-sm sm:text-base font-bold text-white flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-teal-400 shrink-0" />
                      <span>{item.question}</span>
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-teal-400' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 bg-slate-950/60">
                      <p>{item.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs">
              {t.faq.noResults}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
