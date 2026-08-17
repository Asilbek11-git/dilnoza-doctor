import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  LogOut,
  User,
  Calendar,
  Layers,
  Award,
  BookOpen,
  HelpCircle,
  Activity,
  Send,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  Check,
  ChevronRight,
  ExternalLink,
  Shield,
  FileText
} from 'lucide-react';
import {
  Doctor,
  Service,
  Experience,
  Certificate,
  Article,
  FAQItem,
  Appointment,
  AppointmentStatus,
  DashboardStats
} from '../types.ts';
import { api, setAuthToken, getAuthToken } from '../services/api.ts';

interface AdminDashboardProps {
  onClose: () => void;
  onDataUpdated: () => void;
}

type TabType = 'overview' | 'appointments' | 'doctor' | 'services' | 'experiences' | 'certificates' | 'articles' | 'faq' | 'telegram';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose, onDataUpdated }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState<boolean>(true);

  // Login Form State
  const [loginUsername, setLoginUsername] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('adminpassword123');
  const [loginError, setLoginError] = useState('');
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  // Data States
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [faq, setFaq] = useState<FAQItem[]>([]);

  // Filter States
  const [appointmentStatusFilter, setAppointmentStatusFilter] = useState<string>('ALL');
  const [appointmentSearch, setAppointmentSearch] = useState<string>('');

  // Modals / Forms
  const [editingItem, setEditingItem] = useState<{ type: string; data: any } | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string>('');

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  const showNotification = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  const checkAuthAndLoad = async () => {
    setLoading(true);
    const token = getAuthToken();
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      await api.verifyToken();
      setIsAuthenticated(true);
      await loadDashboardData();
    } catch (err) {
      setAuthToken(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginSubmitting(true);
    try {
      const res = await api.login(loginUsername, loginPassword);
      setAuthToken(res.access);
      setIsAuthenticated(true);
      await loadDashboardData();
      showNotification('Admin paneliga muvaffaqiyatli kirdingiz!');
    } catch (err: any) {
      setLoginError(err.message || 'Noto‘g‘ri login yoki parol');
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    setIsAuthenticated(false);
  };

  const loadDashboardData = async () => {
    try {
      const [statsData, aptData, docData, srvData, expData, certData, artData, faqData] = await Promise.all([
        api.getStats().catch(() => null),
        api.getAppointments({ status: appointmentStatusFilter, search: appointmentSearch }).catch(() => ({ results: [] })),
        api.getDoctor().catch(() => null),
        api.getServices(true).catch(() => []),
        api.getExperiences().catch(() => []),
        api.getCertificates().catch(() => []),
        api.getArticles({ all: true }).catch(() => ({ results: [] })),
        api.getFAQ(true).catch(() => [])
      ]);

      if (statsData) setStats(statsData);
      if (aptData?.results) setAppointments(aptData.results);
      if (docData) setDoctor(docData);
      if (srvData) setServices(srvData);
      if (expData) setExperiences(expData);
      if (certData) setCertificates(certData);
      if (artData?.results) setArticles(artData.results);
      if (faqData) setFaq(faqData);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  };

  // Appointment Status Changer
  const handleUpdateAppointmentStatus = async (id: string, status: AppointmentStatus) => {
    try {
      await api.updateAppointment(id, { status });
      showNotification(`Ariza holati o'zgartirildi: ${status}`);
      loadDashboardData();
      onDataUpdated();
    } catch (err: any) {
      alert(err.message || 'Xatolik yuz berdi');
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    if (!confirm('Ushbu arizani o‘chirishni tasdiqlaysizmi?')) return;
    try {
      await api.deleteAppointment(id);
      showNotification('Ariza muvaffaqiyatli o‘chirildi');
      loadDashboardData();
      onDataUpdated();
    } catch (err: any) {
      alert(err.message || 'Xatolik yuz berdi');
    }
  };

  // Doctor profile saver
  const handleSaveDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctor) return;
    try {
      await api.updateDoctor(doctor);
      showNotification('Shifokor ma’lumotlari muvaffaqiyatli yangilandi');
      onDataUpdated();
    } catch (err: any) {
      alert(err.message || 'Xatolik yuz berdi');
    }
  };

  // Save Service
  const handleSaveService = async (data: Partial<Service>, isEdit: boolean, originalSlug?: string) => {
    try {
      if (isEdit && originalSlug) {
        await api.updateService(originalSlug, data);
        showNotification('Xizmat muvaffaqiyatli yangilandi');
      } else {
        await api.createService(data);
        showNotification('Yangi xizmat qo‘shildi');
      }
      setEditingItem(null);
      loadDashboardData();
      onDataUpdated();
    } catch (err: any) {
      alert(err.message || 'Xatolik yuz berdi');
    }
  };

  const handleDeleteService = async (slug: string) => {
    if (!confirm('Xizmatni o‘chirishni tasdiqlaysizmi?')) return;
    try {
      await api.deleteService(slug);
      showNotification('Xizmat o‘chirildi');
      loadDashboardData();
      onDataUpdated();
    } catch (err: any) {
      alert(err.message || 'Xatolik yuz berdi');
    }
  };

  // Save Experience
  const handleSaveExperience = async (data: Partial<Experience>, isEdit: boolean, id?: string) => {
    try {
      if (isEdit && id) {
        await api.updateExperience(id, data);
        showNotification('Tajriba yangilandi');
      } else {
        await api.createExperience(data);
        showNotification('Yangi tajriba yozuvi qo‘shildi');
      }
      setEditingItem(null);
      loadDashboardData();
      onDataUpdated();
    } catch (err: any) {
      alert(err.message || 'Xatolik yuz berdi');
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm('O‘chirishni tasdiqlaysizmi?')) return;
    try {
      await api.deleteExperience(id);
      showNotification('Tajriba yozuvi o‘chirildi');
      loadDashboardData();
      onDataUpdated();
    } catch (err: any) {
      alert(err.message || 'Xatolik yuz berdi');
    }
  };

  // Save Certificate
  const handleSaveCertificate = async (data: Partial<Certificate>, isEdit: boolean, id?: string) => {
    try {
      if (isEdit && id) {
        await api.updateCertificate(id, data);
        showNotification('Sertifikat yangilandi');
      } else {
        await api.createCertificate(data);
        showNotification('Yangi sertifikat qo‘shildi');
      }
      setEditingItem(null);
      loadDashboardData();
      onDataUpdated();
    } catch (err: any) {
      alert(err.message || 'Xatolik yuz berdi');
    }
  };

  const handleDeleteCertificate = async (id: string) => {
    if (!confirm('Sertifikatni o‘chirishni tasdiqlaysizmi?')) return;
    try {
      await api.deleteCertificate(id);
      showNotification('Sertifikat o‘chirildi');
      loadDashboardData();
      onDataUpdated();
    } catch (err: any) {
      alert(err.message || 'Xatolik yuz berdi');
    }
  };

  // Save Article
  const handleSaveArticle = async (data: Partial<Article>, isEdit: boolean, originalSlug?: string) => {
    try {
      if (isEdit && originalSlug) {
        await api.updateArticle(originalSlug, data);
        showNotification('Maqola yangilandi');
      } else {
        await api.createArticle(data);
        showNotification('Yangi maqola e’lon qilindi');
      }
      setEditingItem(null);
      loadDashboardData();
      onDataUpdated();
    } catch (err: any) {
      alert(err.message || 'Xatolik yuz berdi');
    }
  };

  const handleDeleteArticle = async (slug: string) => {
    if (!confirm('Maqolani o‘chirishni tasdiqlaysizmi?')) return;
    try {
      await api.deleteArticle(slug);
      showNotification('Maqola o‘chirildi');
      loadDashboardData();
      onDataUpdated();
    } catch (err: any) {
      alert(err.message || 'Xatolik yuz berdi');
    }
  };

  // Save FAQ
  const handleSaveFAQ = async (data: Partial<FAQItem>, isEdit: boolean, id?: string) => {
    try {
      if (isEdit && id) {
        await api.updateFAQ(id, data);
        showNotification('FAQ savoli yangilandi');
      } else {
        await api.createFAQ(data);
        showNotification('Yangi FAQ qo‘shildi');
      }
      setEditingItem(null);
      loadDashboardData();
      onDataUpdated();
    } catch (err: any) {
      alert(err.message || 'Xatolik yuz berdi');
    }
  };

  const handleDeleteFAQ = async (id: string) => {
    if (!confirm('FAQ savolini o‘chirishni tasdiqlaysizmi?')) return;
    try {
      await api.deleteFAQ(id);
      showNotification('FAQ savoli o‘chirildi');
      loadDashboardData();
      onDataUpdated();
    } catch (err: any) {
      alert(err.message || 'Xatolik yuz berdi');
    }
  };

  // Test Telegram
  const handleTestTelegram = async () => {
    try {
      await api.testTelegram();
      showNotification('Telegram test xabarnomasi yuborildi!');
      loadDashboardData();
    } catch (err: any) {
      alert(err.message || 'Xatolik yuz berdi');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-6xl h-[92vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Dilnoza Doctor — Boshqaruv Paneli (Admin CMS)</h2>
              <p className="text-xs text-teal-400">Shifokor profili, arizalar, xizmatlar va kontent boshqaruvi</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Chiqish</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Global Action Notification Toast */}
        {actionSuccessMsg && (
          <div className="bg-teal-600 text-white text-xs font-semibold px-6 py-2 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{actionSuccessMsg}</span>
            </div>
            <button onClick={() => setActionSuccessMsg('')} className="text-white/80 hover:text-white">✕</button>
          </div>
        )}

        {/* Main Body */}
        {!isAuthenticated ? (
          /* Login View */
          <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 max-w-md w-full space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto shadow-inner">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Admin Tizimiga Kirish</h3>
                <p className="text-xs text-slate-500">
                  Faqat vakolatli administrator yoki shifokor uchun
                </p>
              </div>

              {loginError && (
                <div className="p-3 bg-red-50 text-red-700 rounded-xl border border-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Foydalanuvchi nomi (Login)</label>
                  <input
                    type="text"
                    required
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
                    placeholder="admin"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Maxfiy parol</label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
                    placeholder="••••••••"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                  <div><strong>Standart demo hisob:</strong></div>
                  <div>Login: <code className="text-teal-700 font-bold">admin</code></div>
                  <div>Parol: <code className="text-teal-700 font-bold">adminpassword123</code></div>
                </div>

                <button
                  type="submit"
                  disabled={loginSubmitting}
                  className="w-full bg-teal-700 hover:bg-teal-800 disabled:opacity-60 text-white font-bold text-xs py-3 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>{loginSubmitting ? 'Tekshirilmoqda...' : 'Tizimga kirish'}</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard Shell */
          <div className="flex-1 flex overflow-hidden">
            
            {/* Sidebar Navigation */}
            <aside className="w-60 bg-slate-50 border-r border-slate-200 p-4 flex flex-col justify-between shrink-0 overflow-y-auto">
              <div className="space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400 px-3 py-1">Bo'limlar</div>
                
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
                    activeTab === 'overview' ? 'bg-teal-700 text-white' : 'text-slate-700 hover:bg-slate-200/60'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  <span>Umumiy holat</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('appointments');
                    loadDashboardData();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
                    activeTab === 'appointments' ? 'bg-teal-700 text-white' : 'text-slate-700 hover:bg-slate-200/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4" />
                    <span>Qabul arizalari</span>
                  </div>
                  {appointments.filter(a => a.status === 'NEW').length > 0 && (
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {appointments.filter(a => a.status === 'NEW').length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('doctor')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
                    activeTab === 'doctor' ? 'bg-teal-700 text-white' : 'text-slate-700 hover:bg-slate-200/60'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Shifokor profili</span>
                </button>

                <button
                  onClick={() => setActiveTab('services')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
                    activeTab === 'services' ? 'bg-teal-700 text-white' : 'text-slate-700 hover:bg-slate-200/60'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Xizmatlar</span>
                </button>

                <button
                  onClick={() => setActiveTab('experiences')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
                    activeTab === 'experiences' ? 'bg-teal-700 text-white' : 'text-slate-700 hover:bg-slate-200/60'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  <span>Tajriba & Ish joylari</span>
                </button>

                <button
                  onClick={() => setActiveTab('certificates')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
                    activeTab === 'certificates' ? 'bg-teal-700 text-white' : 'text-slate-700 hover:bg-slate-200/60'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Sertifikatlar</span>
                </button>

                <button
                  onClick={() => setActiveTab('articles')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
                    activeTab === 'articles' ? 'bg-teal-700 text-white' : 'text-slate-700 hover:bg-slate-200/60'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Maqolalar</span>
                </button>

                <button
                  onClick={() => setActiveTab('faq')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
                    activeTab === 'faq' ? 'bg-teal-700 text-white' : 'text-slate-700 hover:bg-slate-200/60'
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>FAQ Savol-Javoblar</span>
                </button>

                <button
                  onClick={() => setActiveTab('telegram')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
                    activeTab === 'telegram' ? 'bg-teal-700 text-white' : 'text-slate-700 hover:bg-slate-200/60'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>Telegram bildirishnomalar</span>
                </button>
              </div>

              {/* Sidebar Footer Links */}
              <div className="pt-4 border-t border-slate-200 space-y-2 text-[11px]">
                <a
                  href="/api/docs/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-teal-700 font-semibold hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Swagger API Hujjatlari</span>
                </a>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 bg-white p-6 overflow-y-auto">
              
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Dashboard — Umumiy Ko‘rsatkichlar</h3>
                      <p className="text-xs text-slate-500">Tizim holati va statistik ma’lumotlar</p>
                    </div>
                    <button
                      onClick={loadDashboardData}
                      className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-teal-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Yangilash</span>
                    </button>
                  </div>

                  {/* Stat Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <span className="text-xs font-semibold text-slate-500">Jami qabul arizalari</span>
                      <div className="text-2xl font-extrabold text-slate-900 mt-1">{stats?.appointments.total || appointments.length}</div>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                      <span className="text-xs font-semibold text-amber-800">Yangi arizalar (Kutilmoqda)</span>
                      <div className="text-2xl font-extrabold text-amber-900 mt-1">{stats?.appointments.new || appointments.filter(a => a.status === 'NEW').length}</div>
                    </div>
                    <div className="bg-teal-50 p-4 rounded-xl border border-teal-200">
                      <span className="text-xs font-semibold text-teal-800">Faol tibbiy xizmatlar</span>
                      <div className="text-2xl font-extrabold text-teal-900 mt-1">{services.length}</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                      <span className="text-xs font-semibold text-blue-800">E’lon qilingan maqolalar</span>
                      <div className="text-2xl font-extrabold text-blue-900 mt-1">{articles.length}</div>
                    </div>
                  </div>

                  {/* Recent Appointments Preview */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-800">So‘nggi qabul arizalari</h4>
                      <button
                        onClick={() => setActiveTab('appointments')}
                        className="text-xs font-bold text-teal-700 hover:underline"
                      >
                        Barchasini ko‘rish →
                      </button>
                    </div>
                    <div className="divide-y divide-slate-100 text-xs">
                      {appointments.slice(0, 5).map((apt) => (
                        <div key={apt.id} className="p-3 flex items-center justify-between hover:bg-slate-50">
                          <div>
                            <span className="font-bold text-slate-900">{apt.name}</span>
                            <span className="text-slate-400 mx-2">•</span>
                            <span className="text-slate-600">{apt.phone}</span>
                            <span className="text-slate-400 mx-2">•</span>
                            <span className="text-teal-700 font-medium">{apt.service_title}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            apt.status === 'NEW' ? 'bg-amber-100 text-amber-800' :
                            apt.status === 'CONFIRMED' ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {apt.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: APPOINTMENTS */}
              {activeTab === 'appointments' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Qabul Arizalari Boshqaruvi</h3>
                      <p className="text-xs text-slate-500">Bemorlar yuborgan murojaatlar va ularning statusi</p>
                    </div>
                    <button
                      onClick={loadDashboardData}
                      className="flex items-center gap-1 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Yangilash</span>
                    </button>
                  </div>

                  {/* Filters */}
                  <div className="flex flex-wrap items-center gap-2 pb-2">
                    {['ALL', 'NEW', 'CONTACTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setAppointmentStatusFilter(st)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                          appointmentStatusFilter === st
                            ? 'bg-teal-700 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  {/* Appointments Table */}
                  <div className="border border-slate-200 rounded-xl overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                        <tr>
                          <th className="p-3">Bemor & Telefon</th>
                          <th className="p-3">Xizmat</th>
                          <th className="p-3">Sana</th>
                          <th className="p-3">Xabar</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Amallar</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {appointments
                          .filter((a) => appointmentStatusFilter === 'ALL' || a.status === appointmentStatusFilter)
                          .map((apt) => (
                            <tr key={apt.id} className="hover:bg-slate-50">
                              <td className="p-3">
                                <div className="font-bold text-slate-900">{apt.name}</div>
                                <div className="text-slate-500">{apt.phone}</div>
                                {apt.email && <div className="text-[11px] text-teal-700">{apt.email}</div>}
                              </td>
                              <td className="p-3 font-semibold text-slate-800">{apt.service_title}</td>
                              <td className="p-3 font-mono text-slate-600">{apt.preferred_date}</td>
                              <td className="p-3 max-w-xs truncate text-slate-600" title={apt.message}>
                                {apt.message || '—'}
                              </td>
                              <td className="p-3">
                                <select
                                  value={apt.status}
                                  onChange={(e) => handleUpdateAppointmentStatus(apt.id, e.target.value as AppointmentStatus)}
                                  className="text-xs font-bold px-2 py-1 rounded bg-slate-100 border border-slate-200"
                                >
                                  <option value="NEW">NEW (Yangi)</option>
                                  <option value="CONTACTED">CONTACTED (Bog'lanildi)</option>
                                  <option value="CONFIRMED">CONFIRMED (Tasdiqlandi)</option>
                                  <option value="COMPLETED">COMPLETED (Bajarildi)</option>
                                  <option value="CANCELLED">CANCELLED (Bekor qilindi)</option>
                                </select>
                              </td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={() => handleDeleteAppointment(apt.id)}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                                  title="O'chirish"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: DOCTOR PROFILE */}
              {activeTab === 'doctor' && doctor && (
                <form onSubmit={handleSaveDoctor} className="space-y-4 max-w-3xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Shifokor Asosiy Ma’lumotlari</h3>
                      <p className="text-xs text-slate-500">Saytda aks etadigan profil ma’lumotlarini tahrirlash</p>
                    </div>
                    <button
                      type="submit"
                      className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs"
                    >
                      Saqlash
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">F.I.SH (Shifokor ismi)</label>
                      <input
                        type="text"
                        value={doctor.full_name}
                        onChange={(e) => setDoctor({ ...doctor, full_name: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Mutaxassislik</label>
                      <input
                        type="text"
                        value={doctor.specialty}
                        onChange={(e) => setDoctor({ ...doctor, specialty: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Tug'ilgan yili</label>
                      <input
                        type="number"
                        value={doctor.birth_year}
                        onChange={(e) => setDoctor({ ...doctor, birth_year: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Tajriba (yil)</label>
                      <input
                        type="number"
                        value={doctor.experience_years}
                        onChange={(e) => setDoctor({ ...doctor, experience_years: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Klinika nomi</label>
                      <input
                        type="text"
                        value={doctor.clinic_name}
                        onChange={(e) => setDoctor({ ...doctor, clinic_name: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Telefon raqam</label>
                      <input
                        type="text"
                        value={doctor.phone}
                        onChange={(e) => setDoctor({ ...doctor, phone: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Elektron pochta (Email)</label>
                      <input
                        type="email"
                        value={doctor.email}
                        onChange={(e) => setDoctor({ ...doctor, email: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Ish vaqti</label>
                      <input
                        type="text"
                        value={doctor.work_hours}
                        onChange={(e) => setDoctor({ ...doctor, work_hours: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700">Manzil</label>
                      <input
                        type="text"
                        value={doctor.address}
                        onChange={(e) => setDoctor({ ...doctor, address: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700">Biografiya / Shifokor haqida matn</label>
                      <textarea
                        rows={4}
                        value={doctor.bio}
                        onChange={(e) => setDoctor({ ...doctor, bio: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                      />
                    </div>
                  </div>
                </form>
              )}

              {/* TAB 4: SERVICES */}
              {activeTab === 'services' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Tibbiy Xizmatlar Ro‘yxati</h3>
                      <p className="text-xs text-slate-500">Xizmatlarni qo‘shish, tahrirlash va faolligini boshqarish</p>
                    </div>
                    <button
                      onClick={() => setEditingItem({ type: 'service', data: { title: '', short_description: '', duration_minutes: 30, is_active: true } })}
                      className="flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Yangi xizmat</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((srv) => (
                      <div key={srv.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-slate-900">{srv.title}</span>
                            <span className="text-xs font-mono text-teal-700">{srv.duration_minutes} daqiqa</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-2">{srv.short_description}</p>
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-4 mt-2 border-t border-slate-200/60">
                          <button
                            onClick={() => setEditingItem({ type: 'service', data: srv })}
                            className="p-1.5 text-slate-600 hover:text-teal-700"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteService(srv.slug)}
                            className="p-1.5 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: EXPERIENCES */}
              {activeTab === 'experiences' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Ish Tajribasi Xronologiyasi</h3>
                      <p className="text-xs text-slate-500">2006 yildan boshlab faoliyat bosqichlari</p>
                    </div>
                    <button
                      onClick={() => setEditingItem({ type: 'experience', data: { organization: '', position: '', start_year: 2020, is_current: false } })}
                      className="flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Yangi tajriba</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                        <div>
                          <div className="font-bold text-sm text-slate-900">{exp.position}</div>
                          <div className="text-xs text-teal-700 font-medium">{exp.organization} ({exp.start_year} – {exp.end_year || 'Hozirgacha'})</div>
                          <p className="text-xs text-slate-600 mt-1">{exp.description}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => setEditingItem({ type: 'experience', data: exp })}
                            className="p-1.5 text-slate-600 hover:text-teal-700"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteExperience(exp.id)}
                            className="p-1.5 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: CERTIFICATES */}
              {activeTab === 'certificates' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Sertifikatlar & Diplomlar</h3>
                      <p className="text-xs text-slate-500">Malaka oshirish va akkreditatsiya hujjatlari</p>
                    </div>
                    <button
                      onClick={() => setEditingItem({ type: 'certificate', data: { title: '', organization: '', year: 2023, image: '' } })}
                      className="flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Yangi sertifikat</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {certificates.map((cert) => (
                      <div key={cert.id} className="p-3 rounded-xl border border-slate-200 bg-white space-y-2">
                        <div className="aspect-[4/3] rounded-lg bg-slate-100 overflow-hidden">
                          <img src={cert.image} alt={cert.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="font-bold text-xs text-slate-900 line-clamp-1">{cert.title}</div>
                        <div className="text-[11px] text-slate-500">{cert.organization} ({cert.year})</div>
                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                          <button onClick={() => setEditingItem({ type: 'certificate', data: cert })} className="p-1 text-slate-600 hover:text-teal-700">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDeleteCertificate(cert.id)} className="p-1 text-red-600 hover:text-red-700">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: ARTICLES */}
              {activeTab === 'articles' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Tibbiy Maqolalar Boshqaruvi</h3>
                      <p className="text-xs text-slate-500">Shifokor maslahatlari va salomatlik qo‘llanmalari</p>
                    </div>
                    <button
                      onClick={() => setEditingItem({ type: 'article', data: { title: '', category: 'Salomatlik', content: '', read_time_minutes: 4, is_published: true } })}
                      className="flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Yangi maqola</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {articles.map((art) => (
                      <div key={art.id} className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">{art.title}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">{art.category}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">{art.excerpt}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => setEditingItem({ type: 'article', data: art })}
                            className="p-1.5 text-slate-600 hover:text-teal-700"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(art.slug)}
                            className="p-1.5 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 8: FAQ */}
              {activeTab === 'faq' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Ko‘p Beriladigan Savollar (FAQ)</h3>
                      <p className="text-xs text-slate-500">Mijozlar uchun muhim savollarga javoblar</p>
                    </div>
                    <button
                      onClick={() => setEditingItem({ type: 'faq', data: { question: '', answer: '', category: 'Umumiy', order: faq.length + 1 } })}
                      className="flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Yangi savol</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {faq.map((item) => (
                      <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-white flex items-start justify-between">
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-slate-900">{item.question}</div>
                          <div className="text-xs text-slate-600 mt-1">{item.answer}</div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-4">
                          <button
                            onClick={() => setEditingItem({ type: 'faq', data: item })}
                            className="p-1.5 text-slate-600 hover:text-teal-700"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteFAQ(item.id)}
                            className="p-1.5 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 9: TELEGRAM */}
              {activeTab === 'telegram' && (
                <div className="space-y-6 max-w-3xl">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Telegram Bildirishnoma Tizimi</h3>
                    <p className="text-xs text-slate-500">Yangi qabul arizalari Telegram bot orqali shifokorga yetkaziladi</p>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Telegram integratsiya holati</span>
                        <span className="text-xs text-slate-500">Real vaqtda xabarlar logi</span>
                      </div>
                      <button
                        onClick={handleTestTelegram}
                        className="flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Sinov xabari yuborish</span>
                      </button>
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                      <div className="px-4 py-2 bg-slate-100 text-xs font-bold text-slate-700">So‘nggi xabarlar logi</div>
                      <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto text-xs font-mono">
                        {stats?.telegram_logs?.length ? (
                          stats.telegram_logs.map((log, idx) => (
                            <div key={idx} className="p-3 space-y-1">
                              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                                <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                                <span className={log.sent ? 'text-teal-600 font-bold' : 'text-red-500'}>
                                  {log.sent ? 'YUBORILDI' : 'XATOLIK'}
                                </span>
                              </div>
                              <pre className="text-[11px] text-slate-800 whitespace-pre-wrap font-sans bg-slate-50 p-2 rounded">
                                {log.messageFormatted}
                              </pre>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-slate-400">Loglar mavjud emas</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </main>
          </div>
        )}

      </div>

      {/* CRUD Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-base font-bold text-slate-900">
                {editingItem.type === 'service' ? 'Xizmatni tahrirlash' :
                 editingItem.type === 'experience' ? 'Tajribani tahrirlash' :
                 editingItem.type === 'certificate' ? 'Sertifikatni tahrirlash' :
                 editingItem.type === 'article' ? 'Maqolani tahrirlash' : 'FAQ savolini tahrirlash'}
              </h4>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            {/* Service Edit Form */}
            {editingItem.type === 'service' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveService(editingItem.data, !!editingItem.data.id, editingItem.data.slug);
                }}
                className="space-y-3"
              >
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Nomi</label>
                  <input
                    type="text"
                    required
                    value={editingItem.data.title || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Qisqa tavsif</label>
                  <textarea
                    required
                    rows={2}
                    value={editingItem.data.short_description || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, short_description: e.target.value } })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">To‘liq tavsif</label>
                  <textarea
                    rows={3}
                    value={editingItem.data.description || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, description: e.target.value } })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Davomiyligi (daqiqa)</label>
                  <input
                    type="number"
                    value={editingItem.data.duration_minutes || 30}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, duration_minutes: Number(e.target.value) } })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button type="button" onClick={() => setEditingItem(null)} className="px-4 py-2 text-xs font-semibold text-slate-600">Bekor qilish</button>
                  <button type="submit" className="px-5 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl">Saqlash</button>
                </div>
              </form>
            )}

            {/* Experience Edit Form */}
            {editingItem.type === 'experience' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveExperience(editingItem.data, !!editingItem.data.id, editingItem.data.id);
                }}
                className="space-y-3"
              >
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tashkilot nomi</label>
                  <input
                    type="text"
                    required
                    value={editingItem.data.organization || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, organization: e.target.value } })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Lavozim</label>
                  <input
                    type="text"
                    required
                    value={editingItem.data.position || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, position: e.target.value } })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Boshlanish yili</label>
                    <input
                      type="number"
                      required
                      value={editingItem.data.start_year || 2015}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, start_year: Number(e.target.value) } })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Tugash yili</label>
                    <input
                      type="number"
                      disabled={editingItem.data.is_current}
                      value={editingItem.data.end_year || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, end_year: Number(e.target.value) } })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 disabled:opacity-50"
                      placeholder="Hozirgacha"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_current"
                    checked={editingItem.data.is_current || false}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, is_current: e.target.checked } })}
                  />
                  <label htmlFor="is_current" className="text-xs text-slate-700">Hozirgi ish joyi</label>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tavsif</label>
                  <textarea
                    rows={3}
                    value={editingItem.data.description || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, description: e.target.value } })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button type="button" onClick={() => setEditingItem(null)} className="px-4 py-2 text-xs font-semibold text-slate-600">Bekor qilish</button>
                  <button type="submit" className="px-5 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl">Saqlash</button>
                </div>
              </form>
            )}

            {/* Certificate Edit Form */}
            {editingItem.type === 'certificate' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveCertificate(editingItem.data, !!editingItem.data.id, editingItem.data.id);
                }}
                className="space-y-3"
              >
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Sertifikat nomi</label>
                  <input
                    type="text"
                    required
                    value={editingItem.data.title || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tashkilot</label>
                  <input
                    type="text"
                    required
                    value={editingItem.data.organization || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, organization: e.target.value } })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Yil</label>
                  <input
                    type="number"
                    required
                    value={editingItem.data.year || 2023}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, year: Number(e.target.value) } })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Rasm URL</label>
                  <input
                    type="text"
                    value={editingItem.data.image || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, image: e.target.value } })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                    placeholder="https://..."
                  />
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button type="button" onClick={() => setEditingItem(null)} className="px-4 py-2 text-xs font-semibold text-slate-600">Bekor qilish</button>
                  <button type="submit" className="px-5 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl">Saqlash</button>
                </div>
              </form>
            )}

            {/* Article Edit Form */}
            {editingItem.type === 'article' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveArticle(editingItem.data, !!editingItem.data.id, editingItem.data.slug);
                }}
                className="space-y-3"
              >
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Sarlavha</label>
                  <input
                    type="text"
                    required
                    value={editingItem.data.title || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Kategoriya</label>
                  <input
                    type="text"
                    required
                    value={editingItem.data.category || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, category: e.target.value } })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Maqola to'liq matni</label>
                  <textarea
                    rows={6}
                    required
                    value={editingItem.data.content || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, content: e.target.value } })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button type="button" onClick={() => setEditingItem(null)} className="px-4 py-2 text-xs font-semibold text-slate-600">Bekor qilish</button>
                  <button type="submit" className="px-5 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl">Saqlash</button>
                </div>
              </form>
            )}

            {/* FAQ Edit Form */}
            {editingItem.type === 'faq' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveFAQ(editingItem.data, !!editingItem.data.id, editingItem.data.id);
                }}
                className="space-y-3"
              >
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Savol</label>
                  <input
                    type="text"
                    required
                    value={editingItem.data.question || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, question: e.target.value } })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Javob</label>
                  <textarea
                    rows={4}
                    required
                    value={editingItem.data.answer || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, answer: e.target.value } })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button type="button" onClick={() => setEditingItem(null)} className="px-4 py-2 text-xs font-semibold text-slate-600">Bekor qilish</button>
                  <button type="submit" className="px-5 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl">Saqlash</button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
