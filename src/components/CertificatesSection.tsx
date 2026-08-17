import React, { useState } from 'react';
import { Award, ZoomIn, Calendar, Building, X, ExternalLink } from 'lucide-react';
import { Certificate, Language } from '../types.ts';
import { translations } from '../i18n/translations.ts';

interface CertificatesSectionProps {
  certificates: Certificate[];
  lang: Language;
}

export const CertificatesSection: React.FC<CertificatesSectionProps> = ({ certificates, lang }) => {
  const t = translations[lang];
  const [activeCertificate, setActiveCertificate] = useState<Certificate | null>(null);

  return (
    <section id="certificates" className="py-20 bg-slate-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-400 bg-teal-950/80 px-3 py-1 rounded-full border border-teal-500/30">
            {t.certificates.title}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.certificates.subtitle}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Uzluksiz malaka oshirish kurslari, xalqaro tibbiy konferensiyalar va davlat akkreditatsiya sertifikatlari.
          </p>
        </div>

        {/* Certificate Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              onClick={() => setActiveCertificate(cert)}
              className="group bg-slate-900/90 hover:bg-slate-850 rounded-2xl overflow-hidden border border-slate-800 shadow-md hover:shadow-2xl hover:border-teal-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              {/* Image Preview Container */}
              <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white">
                  <ZoomIn className="w-6 h-6 text-teal-400" />
                  <span className="text-xs font-semibold">{t.certificates.zoomHint}</span>
                </div>
                <div className="absolute top-2.5 right-2.5 bg-slate-900/90 backdrop-blur-xs text-teal-400 text-xs font-extrabold px-2 py-0.5 rounded-md border border-slate-700">
                  {cert.year}
                </div>
              </div>

              {/* Certificate Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-teal-400 transition-colors line-clamp-2">
                    {cert.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {cert.organization}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between text-xs text-teal-400 font-semibold">
                  <span>Kattalashtirib ko‘rish</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer Footer Note */}
        <div className="mt-8 text-center text-xs text-slate-500">
          ℹ️ {t.certificates.disclaimer}
        </div>

      </div>

      {/* Lightbox Zoom Modal */}
      {activeCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-slate-900 rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-800 overflow-hidden space-y-4">
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">{activeCertificate.title}</h3>
                <p className="text-xs text-slate-400">{activeCertificate.organization} — {activeCertificate.year}</p>
              </div>
              <button
                onClick={() => setActiveCertificate(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-hidden rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800">
              <img
                src={activeCertificate.image}
                alt={activeCertificate.title}
                className="max-h-[58vh] w-auto object-contain rounded-lg shadow-xs"
                referrerPolicy="no-referrer"
              />
            </div>

            {activeCertificate.description && (
              <p className="text-xs sm:text-sm text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                {activeCertificate.description}
              </p>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveCertificate(null)}
                className="px-5 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-xl"
              >
                Yopish
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
