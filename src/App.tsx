import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import doctorPhoto from './assets/images/dr_dilnoza_exact_1786980527526.jpg';
import { Statistics } from './components/Statistics.tsx';
import { AboutDoctor } from './components/AboutDoctor.tsx';
import { ServicesSection } from './components/ServicesSection.tsx';
import { ExperienceTimeline } from './components/ExperienceTimeline.tsx';
import { CertificatesSection } from './components/CertificatesSection.tsx';
import { ArticlesSection } from './components/ArticlesSection.tsx';
import { FAQSection } from './components/FAQSection.tsx';
import { AppointmentSection } from './components/AppointmentSection.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { Footer } from './components/Footer.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import {
  Doctor,
  Service,
  Experience,
  Certificate,
  Article,
  FAQItem,
  Language
} from './types.ts';
import { api } from './services/api.ts';
import { Calendar, Stethoscope, ChevronUp } from 'lucide-react';

const DEFAULT_DOCTOR: Doctor = {
  id: "doc-1",
  full_name: "Dilnoza Yusupova",
  specialty: "Muolaja shifokori",
  birth_year: 1986,
  experience_years: 20,
  bio: "Dilnoza Yusupova — tibbiyot sohasida 20 yildan ortiq professional tajribaga ega shifokor. Uning faoliyatida bemorlarga professional tibbiy muolajalar o‘tkazish, tomchilab dori yuborish (kapelnitsa), v/i va m/o in'yeksiyalar (ukol), umumiy salomatlik holatini nazorat qilish va xavfsiz davolash standartlari muhim o‘rin tutadi.",
  photo: doctorPhoto,
  phone: "+998 91 655 94 99",
  email: "dr.dilnoza@salomat.uz",
  address: "Farg‘ona viloyati, Toshloq tumani, Navbahor Chaman ko‘chasi 17-uy (Ambulatoriya)",
  clinic_name: "Ambulatoriya",
  work_hours: "Dushanba – Shanba: 09:00 – 18:00",
  is_active: true,
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: new Date().toISOString()
};

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('dilnoza_doctor_lang');
    return (saved === 'uz' || saved === 'ru' || saved === 'en') ? saved : 'uz';
  });

  const [doctor, setDoctor] = useState<Doctor>(DEFAULT_DOCTOR);
  const [services, setServices] = useState<Service[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [faq, setFaq] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modals & triggers
  const [adminOpen, setAdminOpen] = useState<boolean>(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<Service | null>(null);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('dilnoza_doctor_lang', newLang);
  };

  const loadAllData = async () => {
    try {
      const [docRes, srvRes, expRes, certRes, artRes, faqRes] = await Promise.allSettled([
        api.getDoctor(),
        api.getServices(),
        api.getExperiences(),
        api.getCertificates(),
        api.getArticles(),
        api.getFAQ()
      ]);

      if (docRes.status === 'fulfilled' && docRes.value) {
        setDoctor(docRes.value);
      }
      if (srvRes.status === 'fulfilled' && Array.isArray(srvRes.value)) {
        setServices(srvRes.value);
      }
      if (expRes.status === 'fulfilled' && Array.isArray(expRes.value)) {
        setExperiences(expRes.value);
      }
      if (certRes.status === 'fulfilled' && Array.isArray(certRes.value)) {
        setCertificates(certRes.value);
      }
      if (artRes.status === 'fulfilled' && artRes.value?.results) {
        setArticles(artRes.value.results);
      }
      if (faqRes.status === 'fulfilled' && Array.isArray(faqRes.value)) {
        setFaq(faqRes.value);
      }
    } catch (err) {
      console.error('Error fetching initial app data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();

    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToAppointment = (service?: Service) => {
    if (service) {
      setSelectedServiceForBooking(service);
    }
    const elem = document.getElementById('appointment');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-teal-500 selection:text-white">
      
      {/* Sticky Header Navbar */}
      <Navbar
        lang={lang}
        onLanguageChange={handleLanguageChange}
        onOpenAppointment={() => scrollToAppointment()}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {/* Main Content Sections */}
      <main id="main-content">
        {/* 1. Hero Landing Section */}
        <Hero
          doctor={doctor}
          lang={lang}
          onOpenAppointment={() => scrollToAppointment()}
        />

        {/* 2. Key Statistical Metrics */}
        <Statistics lang={lang} />

        {/* 3. About Doctor & Clinical Philosophy */}
        <AboutDoctor
          doctor={doctor}
          lang={lang}
          onOpenAppointment={() => scrollToAppointment()}
        />

        {/* 4. Medical Services Section */}
        <ServicesSection
          services={services}
          lang={lang}
          onSelectService={(service) => scrollToAppointment(service)}
        />

        {/* 5. Experience Timeline */}
        <ExperienceTimeline
          experiences={experiences}
          lang={lang}
        />

        {/* 6. Medical Certificates & Diplomas */}
        <CertificatesSection
          certificates={certificates}
          lang={lang}
        />

        {/* 7. Health & Medical Articles / Blog */}
        <ArticlesSection
          articles={articles}
          lang={lang}
        />

        {/* 8. Frequently Asked Questions (FAQ) */}
        <FAQSection
          faq={faq}
          lang={lang}
        />

        {/* 9. Online Appointment Booking Form */}
        <AppointmentSection
          services={services}
          lang={lang}
          preSelectedService={selectedServiceForBooking}
          onAppointmentBooked={() => loadAllData()}
        />

        {/* 10. Contact Information & Map */}
        <ContactSection
          doctor={doctor}
          lang={lang}
        />
      </main>

      {/* Footer */}
      <Footer
        lang={lang}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {/* Floating Appointment Booking Button for Mobile & Quick Action */}
      <button
        onClick={() => scrollToAppointment()}
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-3 rounded-full shadow-2xl shadow-teal-950/80 border border-teal-400/30 active:scale-95 transition-all"
        id="floating-btn-book"
        aria-label="Qabulga yozilish"
      >
        <Calendar className="w-4 h-4" />
        <span className="hidden sm:inline">Qabulga yozilish</span>
      </button>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-30 p-3 bg-slate-900/90 backdrop-blur-md hover:bg-slate-800 text-slate-300 hover:text-white rounded-full shadow-lg border border-slate-700 transition-all active:scale-95"
          id="btn-scroll-top"
          aria-label="Yuqoriga qaytish"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      {/* Admin CMS Modal */}
      {adminOpen && (
        <AdminDashboard
          onClose={() => setAdminOpen(false)}
          onDataUpdated={() => loadAllData()}
        />
      )}

    </div>
  );
}
