import React from 'react';
import { Phone, Mail, MapPin, Clock, AlertTriangle, ExternalLink, Navigation } from 'lucide-react';
import { Doctor, Language } from '../types.ts';
import { translations } from '../i18n/translations.ts';

interface ContactSectionProps {
  doctor: Doctor;
  lang: Language;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ doctor, lang }) => {
  const t = translations[lang];

  return (
    <section id="contact" className="py-20 bg-slate-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-400 bg-teal-950/80 px-3 py-1 rounded-full border border-teal-500/30">
            {t.contact.title}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.contact.subtitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Info Cards */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            
            {/* Contact Details List */}
            <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-md space-y-5">
              <div>
                <h3 className="text-xl font-bold text-white">{doctor?.full_name || t.contact.doctorName}</h3>
                <p className="text-xs font-semibold text-teal-400">{doctor?.specialty || t.contact.specialty}</p>
              </div>

              <div className="space-y-4 pt-2">
                {/* Phone */}
                <a
                  href={`tel:${(doctor?.phone || '+998916559499').replace(/\s+/g, '')}`}
                  className="flex items-start gap-3 text-slate-300 hover:text-teal-400 group transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-teal-950/80 border border-teal-500/30 text-teal-400 flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block">{t.contact.phoneTitle}</span>
                    <span className="text-sm font-bold text-white">{doctor?.phone || '+998 91 655 94 99'}</span>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${doctor?.email || 'dr.dilnoza@salomat.uz'}`}
                  className="flex items-start gap-3 text-slate-300 hover:text-teal-400 group transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-teal-950/80 border border-teal-500/30 text-teal-400 flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block">{t.contact.emailTitle}</span>
                    <span className="text-sm font-bold text-white">{doctor?.email || 'dr.dilnoza@salomat.uz'}</span>
                  </div>
                </a>

                {/* Address */}
                <div className="flex items-start gap-3 text-slate-300">
                  <div className="w-10 h-10 rounded-xl bg-teal-950/80 border border-teal-500/30 text-teal-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block">{t.contact.addressTitle}</span>
                    <span className="text-sm font-semibold text-slate-200">{doctor?.address || t.contact.addressValue}</span>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3 text-slate-300">
                  <div className="w-10 h-10 rounded-xl bg-teal-950/80 border border-teal-500/30 text-teal-400 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block">{t.contact.hoursTitle}</span>
                    <span className="text-sm font-semibold text-slate-200">{doctor?.work_hours || t.contact.hoursValue}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Notice Box */}
            <div className="bg-amber-950/40 p-4 rounded-2xl border border-amber-800/60 text-amber-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs font-medium leading-relaxed">
                {t.contact.emergencyNote}
              </p>
            </div>

          </div>

          {/* Right Map Visual */}
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-slate-800 shadow-md bg-slate-900 relative min-h-[340px] flex flex-col">
            
            {/* Interactive Map Visual */}
            <div className="relative flex-1 bg-slate-950 overflow-hidden flex items-center justify-center">
              {/* Map grid aesthetic */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px]" />
              
              <div className="relative text-center p-6 space-y-3 z-10 max-w-sm">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-teal-950/80 border border-teal-400/30">
                  <Navigation className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">{doctor?.clinic_name || 'Ambulatoriya'}</h4>
                  <p className="text-xs text-slate-400 mt-1">{doctor?.address || 'Farg‘ona viloyati, Toshloq tumani, Navbahor Chaman ko‘chasi 17-uy'}</p>
                </div>
                <div className="pt-2">
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-teal-400 text-xs font-bold px-4 py-2 rounded-xl shadow-xs border border-slate-700 transition-colors"
                  >
                    <span>Google Xaritada ko‘rish</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Clinic Reception Desk Bar */}
            <div className="bg-slate-900 p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Qabulxonaga yetib kelish:</span>
              <span>Mo'ljal: Navbahor qishlog‘i, Chaman ko‘chasi 17-uy</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
