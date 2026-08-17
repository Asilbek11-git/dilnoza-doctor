import React, { useState } from 'react';
import { Doctor, Language } from '../types.ts';
import { translations } from '../i18n/translations.ts';
import { ShieldCheck, CheckCircle, Hospital, Calendar, Phone, Mail, MapPin, X } from 'lucide-react';

interface AboutDoctorProps {
  doctor: Doctor;
  lang: Language;
  onOpenAppointment: () => void;
}

export const AboutDoctor: React.FC<AboutDoctorProps> = ({ doctor, lang, onOpenAppointment }) => {
  const t = translations[lang];
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  return (
    <section id="about" className="py-20 bg-slate-900/60 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Clinic Image / Certificate Badge */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-700 bg-slate-900 aspect-[4/3]">
              <img
                src="/src/assets/images/clinic_office_1786977202473.jpg"
                alt="Clinic Office"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-6">
                <div className="text-white">
                  <div className="text-xs uppercase tracking-wider font-semibold text-teal-400">
                    Klinik Muolaja Xonasi
                  </div>
                  <div className="text-lg font-bold">
                    {doctor?.clinic_name || 'Ambulatoriya'}
                  </div>
                  <div className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-400" />
                    <span>{doctor?.address || 'Farg‘ona viloyati, Toshloq tumani, Navbahor Chaman ko‘chasi 17-uy'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Doctor Info Card */}
            <div className="mt-4 bg-slate-900/90 p-4 rounded-xl border border-slate-800 shadow-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-950/80 border border-teal-500/30 flex items-center justify-center text-teal-400">
                  <Hospital className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400">Mutaxassislik</div>
                  <div className="text-sm font-bold text-white">{doctor?.specialty || 'Muolaja shifokori'}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-slate-400">Tug‘ilgan yili</div>
                <div className="text-sm font-bold text-white">{doctor?.birth_year || 1986}</div>
              </div>
            </div>
          </div>

          {/* Right Column: Bio & Qualifications */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-teal-400 bg-teal-950/80 px-3 py-1 rounded-full border border-teal-500/30">
                {t.about.badge}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
                {t.about.title}
              </h2>
            </div>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-medium">
              {doctor?.bio || t.about.text1}
            </p>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              {t.about.text2}
            </p>

            {/* Principles Checklist */}
            <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 shadow-md space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>{t.about.principlesTitle}</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-300">
                {t.about.principles.map((p, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setDetailModalOpen(true)}
                className="bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-colors"
                id="btn-about-details"
              >
                {t.about.moreBtn}
              </button>

              <button
                onClick={onOpenAppointment}
                className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-teal-950/60 active:scale-95 transition-all flex items-center gap-2 border border-teal-500/30"
                id="btn-about-book"
              >
                <Calendar className="w-4 h-4" />
                <span>{t.about.bookBtn}</span>
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Detailed Info Modal */}
      {detailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-800 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">Dr. Dilnoza Yusupova</h3>
                <p className="text-xs text-teal-400 font-medium">Muolaja shifokori haqida to‘liq ma’lumot</p>
              </div>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
              <div>
                <h4 className="font-bold text-white mb-1">Klinik tajriba va faoliyat</h4>
                <p className="text-slate-300">
                  2006 yildan buyon tibbiyot sohasida amaliy faoliyat yuritib kelmoqda. 20 yildan ortiq davr mobaynida yetakchi statsionar va ambulator klinikalarda minglab bemorlarga professional tibbiy muolajalar, infuzion terapiya (kapelnitsa), v/i va m/o in'yeksiyalarni xavfsiz va og'riqsiz o'tkazib kelmoqda.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white mb-1">Asosiy tibbiy muolajalar:</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-400 pl-2">
                  <li>Vena ichiga tomchilab dori yuborish (Kapelnitsa) va infuzion terapiya</li>
                  <li>Barcha turdagi in'yeksiyalar (V/I va M/O ukol qilish)</li>
                  <li>Shifokor ko'rsatmasi bo'yicha davolash muolajalari monitoringi</li>
                  <li>Qon bosimi, puls va umumiy salomatlik ko'rsatkichlarini doimiy nazorat qilish</li>
                  <li>Antiseptik ishlov berish va steril bog'lov muolajalari</li>
                </ul>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <Phone className="w-4 h-4 text-teal-400" />
                  <span>{doctor?.phone || '+998 91 655 94 99'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <Mail className="w-4 h-4 text-teal-400" />
                  <span>{doctor?.email || 'doctor@salomat.uz'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <MapPin className="w-4 h-4 text-teal-400" />
                  <span>{doctor?.address || 'Farg‘ona viloyati, Toshloq tumani, Navbahor Chaman ko‘chasi 17-uy (Ambulatoriya)'}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setDetailModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800 rounded-xl"
              >
                Yopish
              </button>
              <button
                onClick={() => {
                  setDetailModalOpen(false);
                  onOpenAppointment();
                }}
                className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 rounded-xl shadow-md"
              >
                Qabulga yozilish
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
