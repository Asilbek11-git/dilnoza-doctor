import React from 'react';
import { Award, Calendar, ChevronRight, ShieldCheck, HeartPulse, CheckCircle2 } from 'lucide-react';
import { Doctor, Language } from '../types.ts';
import { translations } from '../i18n/translations.ts';

interface HeroProps {
  doctor: Doctor;
  lang: Language;
  onOpenAppointment: () => void;
}

export const Hero: React.FC<HeroProps> = ({ doctor, lang, onOpenAppointment }) => {
  const t = translations[lang];

  return (
    <section id="home" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800/80">
      {/* Decorative Background Glows */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Experience Pill */}
            <div className="inline-flex items-center gap-2 bg-teal-950/80 border border-teal-500/30 px-3.5 py-1.5 rounded-full shadow-xs">
              <Award className="w-4 h-4 text-teal-400" />
              <span className="text-xs sm:text-sm font-semibold text-teal-300 tracking-wide">
                {t.hero.badge}
              </span>
            </div>

            {/* Doctor Name & Heading */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-none">
                {doctor?.full_name || t.hero.title}
              </h1>
              <p className="text-xl sm:text-2xl font-bold text-teal-400">
                {t.hero.subtitle}
              </p>
            </div>

            {/* Subtitle / Philosophy */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              {t.hero.description}
            </p>

            {/* Trust Highlights Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Dalillarga asoslangan steril tibbiyot</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Har bir bemorga individual g'amxo'rlik</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{doctor?.clinic_name || t.hero.clinicBadge} rasmiy muolaja xonasi</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>2006 yildan buyon uzluksiz tajriba</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={onOpenAppointment}
                className="flex items-center gap-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-base font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-teal-950/60 hover:shadow-teal-950/80 active:scale-95 transition-all border border-teal-400/30"
                id="hero-btn-book"
              >
                <Calendar className="w-5 h-5" />
                <span>{t.hero.bookBtn}</span>
              </button>

              <a
                href="#about"
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-700 text-base font-semibold px-6 py-3.5 rounded-xl shadow-xs hover:border-slate-600 transition-all"
                id="hero-btn-about"
              >
                <span>{t.hero.aboutBtn}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
            </div>

            {/* Clinic & Rating Snippet */}
            <div className="flex items-center gap-4 pt-4 border-t border-slate-800 text-xs sm:text-sm text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>{doctor?.clinic_name || 'Ambulatoriya'}</span>
              </div>
              <span className="text-slate-700">•</span>
              <div className="flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-teal-400" />
                <span>{doctor?.work_hours || 'Dush–Shanba: 09:00–18:00'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Doctor Portrait with Floating Badges */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Decorative Frame Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-500 to-emerald-500 rounded-3xl rotate-2 scale-102 opacity-20 blur-sm" />
              
              {/* Doctor Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-700 bg-slate-900 aspect-[3/4]">
                <img
                  src={doctor?.photo || '/src/assets/images/dr_dilnoza_exact_1786980527526.jpg'}
                  alt="Dr. Dilnoza Yusupova"
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Floating Badge 1: 20+ Years */}
              <div className="absolute -bottom-4 -left-4 bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-teal-950/80 border border-teal-500/30 flex items-center justify-center text-teal-400 font-black text-xl">
                  20+
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-400">{t.stats.experience}</div>
                  <div className="text-sm font-bold text-white">2006–2026</div>
                </div>
              </div>

              {/* Floating Badge 2: Certified Physician */}
              <div className="absolute -top-3 -right-3 bg-slate-900/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-400" />
                <span className="text-xs font-bold text-slate-200">Muolaja Shifokori</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
