import React from 'react';
import { Award, CalendarDays, Users, GraduationCap } from 'lucide-react';
import { Language } from '../types.ts';
import { translations } from '../i18n/translations.ts';

interface StatisticsProps {
  lang: Language;
}

export const Statistics: React.FC<StatisticsProps> = ({ lang }) => {
  const t = translations[lang];

  const stats = [
    {
      id: "stat-experience",
      icon: Award,
      value: "20+",
      label: t.stats.experience,
      sublabel: "2006 yildan amaliyot",
      isDemo: false
    },
    {
      id: "stat-start-year",
      icon: CalendarDays,
      value: "2006",
      label: t.stats.startYear,
      sublabel: "Uzluksiz tibbiy staj",
      isDemo: false
    },
    {
      id: "stat-consultations",
      icon: Users,
      value: "10,000+",
      label: t.stats.consultations,
      sublabel: "O'tkazilgan muolajalar",
      isDemo: true
    },
    {
      id: "stat-training",
      icon: GraduationCap,
      value: "15+",
      label: t.stats.training,
      sublabel: "Sertifikat va seminarlar",
      isDemo: true
    }
  ];

  return (
    <section className="relative z-10 -mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl shadow-black/60 border border-slate-800 p-6 sm:p-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className={`flex flex-col items-center text-center group ${
                  idx !== 0 ? 'pt-4 sm:pt-0 sm:pl-6 lg:pl-8' : ''
                }`}
                id={stat.id}
              >
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 text-teal-400 border border-slate-700 flex items-center justify-center mb-3 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                
                <div className="flex items-center gap-1.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {stat.value}
                  </span>
                  {stat.isDemo && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60" title="Ushbu ko'rsatkich demo ma'lumot bo'lib, admin orqali o'zgartiriladi">
                      DEMO
                    </span>
                  )}
                </div>

                <span className="text-sm font-bold text-slate-200 mt-1">
                  {stat.label}
                </span>
                <span className="text-xs text-slate-400 mt-0.5">
                  {stat.sublabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
