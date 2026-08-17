import React, { useState } from 'react';
import {
  Stethoscope,
  ShieldCheck,
  FileText,
  Activity,
  HeartPulse,
  Apple,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Banknote,
  X
} from 'lucide-react';
import { Service, Language } from '../types.ts';
import { translations } from '../i18n/translations.ts';

interface ServicesSectionProps {
  services: Service[];
  lang: Language;
  onSelectService: (service: Service) => void;
}

const iconMap: Record<string, any> = {
  Stethoscope,
  ShieldCheck,
  FileText,
  Activity,
  HeartPulse,
  Apple
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  lang,
  onSelectService
}) => {
  const t = translations[lang];
  const [selectedModalService, setSelectedModalService] = useState<Service | null>(null);

  const getIcon = (name: string) => {
    return iconMap[name] || Stethoscope;
  };

  return (
    <section id="services" className="py-20 bg-slate-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-400 bg-teal-950/80 px-3 py-1 rounded-full border border-teal-500/30">
            {t.services.title}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.services.subtitle}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Steril sharoitda, malakali muolaja shifokori nazorati ostida amalga oshiriladigan barcha turdagi tibbiy muolajalar va davolash kurslari.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = getIcon(service.icon);
            return (
              <div
                key={service.id}
                id={`service-card-${service.id}`}
                className="group relative bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-md hover:shadow-2xl hover:border-teal-500/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Icon, Duration & Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-950/80 text-teal-400 border border-teal-500/30 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300 shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 bg-slate-800/90 px-2.5 py-1 rounded-lg border border-slate-700">
                        <Clock className="w-3.5 h-3.5 text-teal-400" />
                        <span>{service.duration_minutes} daq</span>
                      </div>
                    </div>
                  </div>

                  {/* Title & Short Desc */}
                  <h3 className="text-lg font-bold text-white group-hover:text-teal-400 transition-colors mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
                    {service.short_description}
                  </p>

                  {/* Price Tag */}
                  {service.price && (
                    <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800/40">
                      <Banknote className="w-4 h-4" />
                      <span>{service.price_formatted || `${service.price.toLocaleString()} so'm`}</span>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-6 mt-4 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedModalService(service)}
                    className="text-xs font-semibold text-slate-400 hover:text-teal-400 transition-colors flex items-center gap-1"
                  >
                    <span>{t.services.viewDetails}</span>
                  </button>

                  <button
                    onClick={() => onSelectService(service)}
                    className="flex items-center gap-1.5 text-xs font-bold text-teal-300 hover:text-white bg-teal-950 hover:bg-teal-700 px-3.5 py-1.5 rounded-lg border border-teal-500/40 transition-colors shadow-sm"
                  >
                    <span>Muolajaga yozilish</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Service Detail Modal */}
      {selectedModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-teal-950/80 border border-teal-500/30 text-teal-400 flex items-center justify-center">
                  {React.createElement(getIcon(selectedModalService.icon), { className: "w-6 h-6" })}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedModalService.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-teal-400" />
                      <span>Davomiyligi: ~{selectedModalService.duration_minutes} daqiqa</span>
                    </span>
                    {selectedModalService.price && (
                      <span className="text-emerald-400 font-bold">
                        {selectedModalService.price_formatted || `${selectedModalService.price.toLocaleString()} so'm`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedModalService(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-teal-300 text-xs font-medium">
                {selectedModalService.short_description}
              </div>
              <p className="text-slate-300">
                {selectedModalService.description || selectedModalService.short_description}
              </p>
              
              <div className="space-y-1.5 pt-2">
                <div className="text-xs font-bold text-white">Muolaja qoidalari va xususiyatlari:</div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>Mutlaq steril va bir martalik sarflov materiallar</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>Dori yuborish jarayonida qon bosimi va puls monitoringi</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>Shifokor tavsiyalari va xavfsiz muolaja amaliyoti</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setSelectedModalService(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 rounded-xl"
              >
                Yopish
              </button>
              <button
                onClick={() => {
                  const s = selectedModalService;
                  setSelectedModalService(null);
                  onSelectService(s);
                }}
                className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 rounded-xl shadow-md"
              >
                Ushbu muolajaga yozilish
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
