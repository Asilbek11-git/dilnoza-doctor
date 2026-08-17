import React, { useState, useEffect } from 'react';
import { Stethoscope, Globe, Menu, X, Calendar, Lock, BookOpen } from 'lucide-react';
import { Language } from '../types.ts';
import { translations } from '../i18n/translations.ts';

interface NavbarProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenAppointment: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onLanguageChange,
  onOpenAppointment,
  onOpenAdmin
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: t.nav.home },
    { href: '#about', label: t.nav.about },
    { href: '#services', label: t.nav.services },
    { href: '#experience', label: t.nav.experience },
    { href: '#certificates', label: t.nav.certificates },
    { href: '#articles', label: t.nav.articles },
    { href: '#faq', label: t.nav.faq },
    { href: '#contact', label: t.nav.contact }
  ];

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/90 backdrop-blur-md shadow-lg shadow-black/30 py-3 border-b border-slate-800/80'
          : 'bg-slate-950/70 backdrop-blur-sm py-4 border-b border-slate-800/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Doctor Brand */}
          <a href="#home" className="flex items-center gap-3 group" id="nav-brand-logo">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight block leading-tight">
                Dilnoza Doctor
              </span>
              <span className="text-xs font-medium text-teal-400 block">
                {lang === 'uz' ? 'Muolaja shifokori' : lang === 'ru' ? 'Врач процедурного кабинета' : 'Medical Procedures Specialist'}
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-teal-400 hover:bg-slate-900/80 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Group: Language Switcher, Admin Button, CTA */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-900/90 p-1 rounded-lg border border-slate-800" id="lang-switcher">
              <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
              {(['uz', 'ru', 'en'] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => onLanguageChange(l)}
                  className={`px-2 py-0.5 text-xs font-semibold rounded uppercase transition-all ${
                    lang === l
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  id={`btn-lang-${l}`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* API Docs Button */}
            <a
              href="/api/docs/"
              target="_blank"
              rel="noreferrer"
              title="OpenAPI / Swagger Docs"
              className="p-2 text-slate-400 hover:text-teal-400 hover:bg-slate-900 rounded-lg transition-colors border border-slate-800"
              id="nav-btn-apidocs"
            >
              <BookOpen className="w-4 h-4" />
            </a>

            {/* Admin Portal Button */}
            <button
              onClick={onOpenAdmin}
              title="Admin Panel"
              className="p-2 text-slate-400 hover:text-teal-400 hover:bg-slate-900 rounded-lg transition-colors border border-slate-800"
              id="nav-btn-admin"
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Primary Appointment Booking CTA */}
            <button
              onClick={onOpenAppointment}
              className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-md shadow-teal-950/50 active:scale-95 transition-all border border-teal-500/30"
              id="nav-btn-book-appointment"
            >
              <Calendar className="w-4 h-4" />
              <span>{t.nav.bookAppointment}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenAppointment}
              className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold px-3 py-2 rounded-lg"
              id="mobile-btn-book"
            >
              {t.nav.bookAppointment}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white bg-slate-900 rounded-lg border border-slate-800"
              id="btn-toggle-mobile-menu"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-slate-950 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 shadow-2xl">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-900 hover:text-teal-400 rounded-lg"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
              {(['uz', 'ru', 'en'] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    onLanguageChange(l);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-2.5 py-1 text-xs font-bold rounded uppercase ${
                    lang === l ? 'bg-teal-600 text-white' : 'text-slate-400'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <a
                href="/api/docs/"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium text-slate-300 flex items-center gap-1 px-2.5 py-1 bg-slate-900 rounded-lg border border-slate-800"
              >
                <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                <span>Swagger</span>
              </a>
              <button
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="text-xs font-medium text-slate-300 flex items-center gap-1 px-2.5 py-1 bg-slate-900 rounded-lg border border-slate-800"
              >
                <Lock className="w-3.5 h-3.5 text-teal-400" />
                <span>Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
