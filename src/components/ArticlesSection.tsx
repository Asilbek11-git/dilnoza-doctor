import React, { useState } from 'react';
import { BookOpen, Search, Calendar, Clock, ArrowRight, User, AlertCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Article, Language } from '../types.ts';
import { translations } from '../i18n/translations.ts';

interface ArticlesSectionProps {
  articles: Article[];
  lang: Language;
}

export const ArticlesSection: React.FC<ArticlesSectionProps> = ({ articles, lang }) => {
  const t = translations[lang];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  const categories = ['all', ...Array.from(new Set(articles.map((a) => a.category)))];

  // Filtering
  const filteredArticles = articles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || art.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // Pagination (6 per page)
  const pageSize = 6;
  const totalPages = Math.ceil(filteredArticles.length / pageSize) || 1;
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <section id="articles" className="py-20 bg-slate-900/40 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-400 bg-teal-950/80 px-3 py-1 rounded-full border border-teal-500/30">
            {t.articles.title}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.articles.subtitle}
          </h2>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat === 'all' ? t.articles.allCategories : cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={t.articles.searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-900 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs placeholder-slate-500"
            />
          </div>
        </div>

        {/* Articles Grid */}
        {paginatedArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedArticles.map((art) => (
              <article
                key={art.id}
                onClick={() => setActiveArticle(art)}
                className="group bg-slate-900/90 rounded-2xl overflow-hidden border border-slate-800 shadow-md hover:shadow-2xl hover:border-teal-500/50 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Article Thumbnail */}
                  <div className="relative aspect-[16/9] bg-slate-950 overflow-hidden">
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-xs text-teal-300 text-[11px] font-bold px-2.5 py-0.5 rounded-md border border-slate-700">
                      {art.category}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-teal-400" />
                        <span>{new Date(art.published_at || art.created_at).toLocaleDateString()}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-teal-400" />
                        <span>{art.read_time_minutes} {t.articles.readTime}</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-teal-400 transition-colors line-clamp-2 mb-2">
                      {art.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-3">
                      {art.excerpt}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-800 text-xs font-bold text-teal-400 group-hover:text-teal-300">
                  <span>{t.articles.readMore}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-900 rounded-2xl border border-slate-800 text-slate-400 text-sm">
            {t.articles.noArticles}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:bg-slate-800 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-300 px-3">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:bg-slate-800 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

      {/* Article Detail Full Reading Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-800 max-h-[90vh] overflow-y-auto space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-xs uppercase font-bold text-teal-400 bg-teal-950/80 px-3 py-1 rounded-full border border-teal-500/30">
                {activeArticle.category}
              </span>
              <button
                onClick={() => setActiveArticle(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                {activeArticle.title}
              </h2>

              <div className="flex items-center gap-4 text-xs text-slate-400 border-b border-slate-800 pb-3">
                <span className="flex items-center gap-1 font-semibold text-slate-300">
                  <User className="w-3.5 h-3.5 text-teal-400" />
                  <span>{activeArticle.author || 'Dr. Dilnoza Yusupova'}</span>
                </span>
                <span>•</span>
                <span>{new Date(activeArticle.published_at || activeArticle.created_at).toLocaleDateString()}</span>
                <span>•</span>
                <span>{activeArticle.read_time_minutes} daqiqa mutolaa</span>
              </div>

              <div className="aspect-[16/9] rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                <img
                  src={activeArticle.image}
                  alt={activeArticle.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Article Content Text */}
              <div className="text-sm sm:text-base text-slate-200 leading-relaxed whitespace-pre-line space-y-4 pt-2">
                {activeArticle.content}
              </div>

              {/* Mandatory Medical Safety Disclaimer */}
              <div className="mt-8 p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm font-medium leading-relaxed">
                  <strong>Tibbiy eslatma:</strong> {t.articles.disclaimer}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                onClick={() => setActiveArticle(null)}
                className="px-6 py-2.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-xl"
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
