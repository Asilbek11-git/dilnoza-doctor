import React from 'react';
import { Stethoscope, Lock, BookOpen, Heart } from 'lucide-react';
import { Language } from '../types.ts';
import { translations } from '../i18n/translations.ts';

interface FooterProps {
  lang: Language;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onOpenAdmin }) => {
  const t = translations[lang];

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-900/40">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <span className="text-lg font-bold text-white tracking-tight block">
                  Dilnoza Yusupova
                </span>
                <span className="text-xs text-teal-400 font-medium block">
                  {lang === 'uz' ? 'Muolaja shifokori | 20+ yillik tajriba' : lang === 'ru' ? 'Врач процедурного кабинета | 20+ лет опыта' : 'Medical Procedures Specialist | 20+ Years'}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              {t.footer.tagline}
            </p>

            <div className="text-xs text-slate-500">
              {t.footer.safetyNotice}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><a href="#home" className="hover:text-teal-400 transition-colors">{t.nav.home}</a></li>
              <li><a href="#about" className="hover:text-teal-400 transition-colors">{t.nav.about}</a></li>
              <li><a href="#services" className="hover:text-teal-400 transition-colors">{t.nav.services}</a></li>
              <li><a href="#experience" className="hover:text-teal-400 transition-colors">{t.nav.experience}</a></li>
            </ul>
          </div>

          {/* More Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Bo'limlar
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><a href="#certificates" className="hover:text-teal-400 transition-colors">{t.nav.certificates}</a></li>
              <li><a href="#articles" className="hover:text-teal-400 transition-colors">{t.nav.articles}</a></li>
              <li><a href="#faq" className="hover:text-teal-400 transition-colors">{t.nav.faq}</a></li>
              <li><a href="#contact" className="hover:text-teal-400 transition-colors">{t.nav.contact}</a></li>
            </ul>
          </div>

          {/* Dev & System Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Tizim va API
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a
                  href="/api/docs/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-teal-400 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Swagger OpenAPI Docs</span>
                </a>
              </li>
              <li>
                <a
                  href="/api/schema/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-teal-400 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>OpenAPI 3.0 Schema</span>
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1.5 text-teal-400 hover:text-teal-300 transition-colors"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Shifokor / Admin Paneli</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Rights */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 Dilnoza Yusupova. {t.footer.rights}
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Salomatlik va professional g'amxo'rlik bilan yaratilgan</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
