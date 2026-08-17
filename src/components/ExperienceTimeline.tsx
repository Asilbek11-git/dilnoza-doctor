import React from 'react';
import { Briefcase, Calendar, CheckCircle, Building } from 'lucide-react';
import { Experience, Language } from '../types.ts';
import { translations } from '../i18n/translations.ts';

interface ExperienceTimelineProps {
  experiences: Experience[];
  lang: Language;
}

export const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({ experiences, lang }) => {
  const t = translations[lang];

  return (
    <section id="experience" className="py-20 bg-slate-900/40 border-t border-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-400 bg-teal-950/80 px-3 py-1 rounded-full border border-teal-500/30">
            {t.experience.title}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.experience.subtitle}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Uzluksiz 20 yillik klinik amaliyot va tibbiyot muassasalarida to'plangan boy tajriba yo'li.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative border-l-2 border-teal-500/30 ml-4 sm:ml-32 space-y-12">
          {experiences.map((exp, index) => {
            const isLatest = index === 0;
            const yearRange = exp.end_year
              ? `${exp.start_year} – ${exp.end_year}`
              : `${exp.start_year} – ${t.experience.present}`;

            return (
              <div key={exp.id} className="relative pl-6 sm:pl-8 group">
                
                {/* Year Marker for Desktop (Left of line) */}
                <div className="hidden sm:block absolute -left-36 top-1 text-right w-28">
                  <span className={`text-sm font-extrabold block ${isLatest ? 'text-teal-400' : 'text-slate-400'}`}>
                    {yearRange}
                  </span>
                  {isLatest && (
                    <span className="text-[10px] uppercase font-bold text-teal-300 bg-teal-950 px-1.5 py-0.5 rounded border border-teal-500/30">
                      {t.experience.currentBadge}
                    </span>
                  )}
                </div>

                {/* Timeline Dot */}
                <div
                  className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-slate-900 transition-transform duration-300 group-hover:scale-125 ${
                    isLatest ? 'bg-teal-400 ring-4 ring-teal-950' : 'bg-teal-600'
                  }`}
                />

                {/* Experience Card */}
                <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-md hover:shadow-xl hover:border-slate-700 transition-all">
                  
                  {/* Mobile Year Badge */}
                  <div className="sm:hidden mb-2 inline-flex items-center gap-1.5 text-xs font-bold text-teal-300 bg-teal-950 px-2.5 py-1 rounded-lg border border-teal-500/30">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{yearRange}</span>
                    {isLatest && <span className="text-[10px] ml-1 bg-teal-600 text-white px-1.5 py-0.2 rounded">Joriy</span>}
                  </div>

                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {exp.position}
                      </h3>
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-teal-400 mt-0.5">
                        <Building className="w-4 h-4 text-teal-400" />
                        <span>{exp.organization}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed mt-3">
                    {exp.description}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
