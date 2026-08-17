import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Calendar,
  User,
  Phone,
  Mail,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Send,
  Banknote,
  Bot,
  Info
} from 'lucide-react';
import { Service, Language, AppointmentFormData } from '../types.ts';
import { translations } from '../i18n/translations.ts';
import { api } from '../services/api.ts';

interface AppointmentSectionProps {
  services: Service[];
  lang: Language;
  preSelectedService?: Service | null;
  onAppointmentBooked?: () => void;
}

const TIME_SLOTS = [
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00"
];

export const AppointmentSection: React.FC<AppointmentSectionProps> = ({
  services,
  lang,
  preSelectedService,
  onAppointmentBooked
}) => {
  const t = translations[lang];

  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState<AppointmentFormData>({
    name: '',
    phone: '+998 ',
    email: '',
    service_id: services[0]?.id || 'srv-1',
    preferred_date: todayStr,
    preferred_time: '10:00 - 11:00',
    price: services[0]?.price || 40000,
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{
    id: string;
    name: string;
    date: string;
    time?: string;
    service_title: string;
    price?: number | string;
  } | null>(null);

  // Sync selected service price
  useEffect(() => {
    if (preSelectedService) {
      setFormData((prev) => ({
        ...prev,
        service_id: preSelectedService.id,
        price: preSelectedService.price || prev.price
      }));
    }
  }, [preSelectedService]);

  const handleServiceChange = (serviceId: string) => {
    const s = services.find(item => item.id === serviceId);
    setFormData(prev => ({
      ...prev,
      service_id: serviceId,
      price: s?.price || prev.price
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith('+998') && !val.startsWith('+')) {
      val = '+998 ' + val.replace(/[^\d]/g, '');
    }
    setFormData({ ...formData, phone: val });
    if (errors.phone) {
      setErrors({ ...errors, phone: '' });
    }
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (!formData.name || formData.name.trim().length < 2) {
      errs.name = 'Ismingizni to‘liq kiriting (kamida 2 ta belgi).';
    }

    const cleanPhone = formData.phone.replace(/[^\d+]/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      errs.phone = 'Telefon raqamini to‘liq va to‘g‘ri kiriting.';
    }

    if (formData.email && formData.email.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errs.email = 'Elektron pochta manzili noto‘g‘ri.';
      }
    }

    if (formData.preferred_date) {
      const selected = new Date(formData.preferred_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        errs.preferred_date = 'Sana o‘tib ketgan bo‘lishi mumkin emas.';
      }
    }

    if (!formData.preferred_time) {
      errs.preferred_time = 'Qulay muolaja vaqtini tanlang.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createAppointment(formData);
      
      // Trigger Confetti
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });

      setSuccessData({
        id: res.appointment.id,
        name: res.appointment.name,
        date: res.appointment.preferred_date,
        time: res.appointment.preferred_time,
        service_title: res.appointment.service_title,
        price: res.appointment.price
      });

      // Reset form
      setFormData({
        name: '',
        phone: '+998 ',
        email: '',
        service_id: services[0]?.id || 'srv-1',
        preferred_date: todayStr,
        preferred_time: '10:00 - 11:00',
        price: services[0]?.price || 40000,
        message: ''
      });

      if (onAppointmentBooked) {
        onAppointmentBooked();
      }
    } catch (err: any) {
      setErrors(err.errors || { general: err.message || 'Xatolik yuz berdi. Iltimos qaytadan urinib ko‘ring.' });
    } finally {
      setSubmitting(false);
    }
  };

  const currentSelectedService = services.find(s => s.id === formData.service_id) || services[0];

  return (
    <section id="appointment" className="py-20 bg-slate-950 border-t border-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-400 bg-teal-950/80 px-3 py-1 rounded-full border border-teal-500/30">
            {t.appointment.title}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.appointment.subtitle}
          </h2>
          
          {/* Telegram Live Bot Badge */}
          <div className="inline-flex items-center gap-2 bg-slate-900 border border-teal-500/30 px-4 py-2 rounded-xl text-xs text-slate-300 shadow-md">
            <Bot className="w-4 h-4 text-teal-400 animate-pulse" />
            <span>Dilnoza Yusupovaning Telegram botiga to'g'ridan-to'g'ri buyurtma va to'lov summasi bilan yuboriladi</span>
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl shadow-black/80 relative overflow-hidden">
          
          {/* Subtle Decorative Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl pointer-events-none -mr-16 -mt-16" />

          {successData ? (
            <div className="py-8 text-center space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-teal-950 border border-teal-500/40 text-teal-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-2xl font-extrabold text-white">
                  {t.appointment.successTitle}
                </h3>
                <p className="text-sm text-slate-300">
                  {t.appointment.successDesc}
                </p>
              </div>

              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 inline-block text-left text-xs space-y-2 max-w-md w-full">
                <div className="flex justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400">{t.appointment.bookingId}:</span>
                  <code className="font-mono font-bold text-teal-400">{successData.id}</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Bemor:</span>
                  <span className="font-bold text-white">{successData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Muolaja:</span>
                  <span className="font-semibold text-teal-300">{successData.service_title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Belgilangan sana va vaqt:</span>
                  <span className="font-bold text-white">{successData.date} ({successData.time || '10:00 - 11:00'})</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800 text-emerald-400 font-bold">
                  <span>To'lov summasi:</span>
                  <span>{typeof successData.price === 'number' ? `${successData.price.toLocaleString()} so'm` : successData.price}</span>
                </div>
              </div>

              <div>
                <button
                  onClick={() => setSuccessData(null)}
                  className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md"
                >
                  {t.appointment.closeBtn}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" id="appointment-booking-form">
              {errors.general && (
                <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errors.general}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-teal-400" />
                    <span>{t.appointment.nameLabel}</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: '' });
                    }}
                    placeholder={t.appointment.namePlaceholder}
                    className={`w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-950 text-white rounded-xl border ${
                      errors.name ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-teal-500'
                    } focus:outline-none focus:ring-2 placeholder-slate-500`}
                    id="input-appointment-name"
                  />
                  {errors.name && <p className="text-[11px] text-red-400">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-teal-400" />
                    <span>{t.appointment.phoneLabel}</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    placeholder={t.appointment.phonePlaceholder}
                    className={`w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-950 text-white rounded-xl border ${
                      errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-teal-500'
                    } focus:outline-none focus:ring-2 placeholder-slate-500`}
                    id="input-appointment-phone"
                  />
                  {errors.phone && <p className="text-[11px] text-red-400">{errors.phone}</p>}
                </div>

                {/* Service Selection */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-teal-400" />
                      <span>{t.appointment.serviceLabel}</span>
                    </span>
                    {currentSelectedService?.price && (
                      <span className="text-emerald-400 font-bold text-xs">
                        Narxi: {currentSelectedService.price_formatted || `${currentSelectedService.price.toLocaleString()} so'm`}
                      </span>
                    )}
                  </label>
                  <select
                    value={formData.service_id}
                    onChange={(e) => handleServiceChange(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-950 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    id="select-appointment-service"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                        {s.title} ({s.duration_minutes} daqiqa) — {s.price_formatted || (s.price ? `${s.price.toLocaleString()} so'm` : 'Kelishiladi')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preferred Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-teal-400" />
                    <span>{t.appointment.dateLabel}</span>
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    value={formData.preferred_date}
                    onChange={(e) => {
                      setFormData({ ...formData, preferred_date: e.target.value });
                      if (errors.preferred_date) setErrors({ ...errors, preferred_date: '' });
                    }}
                    className={`w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-950 text-white rounded-xl border ${
                      errors.preferred_date ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-teal-500'
                    } focus:outline-none focus:ring-2`}
                    id="input-appointment-date"
                  />
                  {errors.preferred_date && <p className="text-[11px] text-red-400">{errors.preferred_date}</p>}
                </div>

                {/* Preferred Time Slot */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-teal-400" />
                    <span>{t.appointment.timeLabel}</span>
                  </label>
                  <select
                    value={formData.preferred_time}
                    onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-950 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    id="select-appointment-time"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot} className="bg-slate-900 text-white">
                        {slot}
                      </option>
                    ))}
                  </select>
                  {errors.preferred_time && <p className="text-[11px] text-red-400">{errors.preferred_time}</p>}
                </div>

                {/* Price & Summary Preview Box */}
                <div className="md:col-span-2 bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">{t.appointment.priceLabel}</div>
                      <div className="text-base font-extrabold text-emerald-400">
                        {currentSelectedService?.price_formatted || (currentSelectedService?.price ? `${currentSelectedService.price.toLocaleString()} so'm` : 'Kelishiladi')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-slate-400 text-right">
                    <span>Xizmat davomiyligi: ~{currentSelectedService?.duration_minutes || 30} daqiqa</span>
                    <div className="text-[11px] text-teal-400">Telegram botga yuboriladigan summa</div>
                  </div>
                </div>

                {/* Email (Optional) */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-teal-400" />
                    <span>{t.appointment.emailLabel}</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    placeholder={t.appointment.emailPlaceholder}
                    className={`w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-950 text-white rounded-xl border ${
                      errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-teal-500'
                    } focus:outline-none focus:ring-2 placeholder-slate-500`}
                    id="input-appointment-email"
                  />
                  {errors.email && <p className="text-[11px] text-red-400">{errors.email}</p>}
                </div>

                {/* Message / Symptoms */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                    <span>{t.appointment.messageLabel}</span>
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={t.appointment.messagePlaceholder}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-950 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-slate-500"
                    id="input-appointment-message"
                  />
                </div>

              </div>

              {/* Submit Button & Trust Notice */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Ma’lumotlaringiz shifokor siriga muvofiq xavfsiz saqlanadi.</span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 disabled:opacity-60 text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg shadow-teal-950/80 active:scale-95 transition-all border border-teal-400/30"
                  id="btn-submit-appointment"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? t.appointment.submitting : t.appointment.submitBtn}</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </section>
  );
};
