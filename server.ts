import express, { Request, Response, NextFunction } from "express";
import path from "path";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { createServer as createViteServer } from "vite";
import {
  getDatabase,
  saveDatabase,
  Doctor,
  Service,
  Experience,
  Certificate,
  Article,
  FAQItem,
  Appointment,
  AppointmentStatus
} from "./server/db.ts";
import {
  sendTelegramNotification,
  getNotificationLogs,
  formatTelegramAppointmentMessage
} from "./server/notifications.ts";
import { startTelegramPolling } from "./server/telegramBot.ts";
import { openApiSchema } from "./server/swagger.ts";

dotenv.config();

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "dilnoza-doctor-jwt-token-secret-2026";
const ADMIN_USER = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASS = process.env.ADMIN_PASSWORD || "adminpassword123";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper Response Formatters conforming to prompt specification:
// Success: { success: true, data: ... }
// Error: { success: false, message: "...", errors: ... }
function sendSuccess(res: Response, data: any, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data
  });
}

function sendError(res: Response, message: string, errors: any = {}, statusCode = 400) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
}

// Authentication Middleware
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, "Authentication required. Bearer token missing.", {}, 401);
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (err) {
    return sendError(res, "Invalid or expired token.", {}, 401);
  }
}

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Swagger OpenAPI Schema & Docs
app.get("/api/schema/", (req, res) => {
  res.json(openApiSchema);
});

app.get("/api/docs/", (req, res) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Dilnoza Doctor API Docs (Swagger)</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
</head>
<body style="margin:0; background:#f8fafc;">
  <div style="background:#0f766e; color:white; padding:16px 24px; display:flex; justify-content:space-between; align-items:center;">
    <div>
      <h2 style="margin:0; font-family:sans-serif; font-size:20px;">Dilnoza Doctor — Swagger API Documentation</h2>
      <p style="margin:4px 0 0; opacity:0.85; font-size:13px;">Django REST Framework & Express API Specification v1.0.0</p>
    </div>
    <a href="/" style="color:#ffffff; background:#14b8a6; padding:8px 16px; border-radius:6px; text-decoration:none; font-family:sans-serif; font-size:14px; font-weight:bold;">← Saytga qaytish</a>
  </div>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: '/api/schema/',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.SwaggerUIStandalonePreset
        ],
        layout: "BaseLayout"
      });
    };
  </script>
</body>
</html>`;
  res.send(html);
});

// ----------------------------------------------------
// 1. AUTHENTICATION ENDPOINTS
// ----------------------------------------------------
app.post("/api/v1/auth/login/", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return sendError(res, "Username and password are required.", {}, 400);
  }

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const payload = { username, role: "admin" };
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
    const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    return sendSuccess(res, {
      access: accessToken,
      refresh: refreshToken,
      user: {
        username: "admin",
        full_name: "Dilnoza Yusupova (Administrator)",
        role: "admin"
      }
    });
  }

  return sendError(res, "Noto‘g‘ri login yoki parol kiritildi.", {}, 401);
});

app.get("/api/v1/auth/verify/", requireAuth, (req, res) => {
  return sendSuccess(res, {
    valid: true,
    user: (req as any).user
  });
});

// ----------------------------------------------------
// 2. DOCTOR PROFILE ENDPOINTS
// ----------------------------------------------------
app.get("/api/v1/doctor/", (req, res) => {
  const db = getDatabase();
  return sendSuccess(res, db.doctor);
});

app.patch("/api/v1/doctor/", requireAuth, (req, res) => {
  const db = getDatabase();
  const updates = req.body;

  db.doctor = {
    ...db.doctor,
    ...updates,
    updated_at: new Date().toISOString()
  };

  saveDatabase(db);
  return sendSuccess(res, db.doctor);
});

// ----------------------------------------------------
// 3. SERVICES ENDPOINTS
// ----------------------------------------------------
app.get("/api/v1/services/", (req, res) => {
  const db = getDatabase();
  const activeOnly = req.query.all !== "true";
  const services = activeOnly ? db.services.filter(s => s.is_active) : db.services;
  return sendSuccess(res, services);
});

app.get("/api/v1/services/:slug/", (req, res) => {
  const db = getDatabase();
  const { slug } = req.params;
  const service = db.services.find(s => s.slug === slug || s.id === slug);
  if (!service) {
    return sendError(res, "Xizmat topilmadi.", {}, 404);
  }
  return sendSuccess(res, service);
});

app.post("/api/v1/services/", requireAuth, (req, res) => {
  const db = getDatabase();
  const { title, slug, short_description, description, icon, duration_minutes, is_active } = req.body;

  if (!title || !short_description) {
    return sendError(res, "Xizmat nomi va qisqa tavsifi majburiy.", { title: "Majburiy maydon" }, 400);
  }

  const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const newService: Service = {
    id: `srv-${Date.now()}`,
    title,
    slug: generatedSlug,
    short_description,
    description: description || short_description,
    icon: icon || "Stethoscope",
    duration_minutes: Number(duration_minutes) || 30,
    is_active: is_active !== undefined ? is_active : true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  db.services.push(newService);
  saveDatabase(db);
  return sendSuccess(res, newService, 201);
});

app.patch("/api/v1/services/:slug/", requireAuth, (req, res) => {
  const db = getDatabase();
  const { slug } = req.params;
  const index = db.services.findIndex(s => s.slug === slug || s.id === slug);
  if (index === -1) {
    return sendError(res, "Xizmat topilmadi.", {}, 404);
  }

  db.services[index] = {
    ...db.services[index],
    ...req.body,
    updated_at: new Date().toISOString()
  };

  saveDatabase(db);
  return sendSuccess(res, db.services[index]);
});

app.delete("/api/v1/services/:slug/", requireAuth, (req, res) => {
  const db = getDatabase();
  const { slug } = req.params;
  const initialLength = db.services.length;
  db.services = db.services.filter(s => s.slug !== slug && s.id !== slug);

  if (db.services.length === initialLength) {
    return sendError(res, "Xizmat topilmadi.", {}, 404);
  }

  saveDatabase(db);
  return sendSuccess(res, { message: "Xizmat muvaffaqiyatli o'chirildi." });
});

// ----------------------------------------------------
// 4. EXPERIENCES (TIMELINE) ENDPOINTS
// ----------------------------------------------------
app.get("/api/v1/experiences/", (req, res) => {
  const db = getDatabase();
  const sorted = [...db.experiences].sort((a, b) => b.start_year - a.start_year);
  return sendSuccess(res, sorted);
});

app.post("/api/v1/experiences/", requireAuth, (req, res) => {
  const db = getDatabase();
  const { organization, position, start_year, end_year, description, is_current } = req.body;

  if (!organization || !position || !start_year) {
    return sendError(res, "Tashkilot, lavozim va boshlanish yili majburiy.", {}, 400);
  }

  const newExp: Experience = {
    id: `exp-${Date.now()}`,
    doctor_id: "doc-1",
    organization,
    position,
    start_year: Number(start_year),
    end_year: is_current ? null : (end_year ? Number(end_year) : null),
    description: description || "",
    is_current: !!is_current,
    created_at: new Date().toISOString()
  };

  db.experiences.push(newExp);
  saveDatabase(db);
  return sendSuccess(res, newExp, 201);
});

app.patch("/api/v1/experiences/:id/", requireAuth, (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  const index = db.experiences.findIndex(e => e.id === id);
  if (index === -1) {
    return sendError(res, "Tajriba yozuvi topilmadi.", {}, 404);
  }

  db.experiences[index] = {
    ...db.experiences[index],
    ...req.body
  };

  saveDatabase(db);
  return sendSuccess(res, db.experiences[index]);
});

app.delete("/api/v1/experiences/:id/", requireAuth, (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  const initialLen = db.experiences.length;
  db.experiences = db.experiences.filter(e => e.id !== id);

  if (db.experiences.length === initialLen) {
    return sendError(res, "Tajriba topilmadi.", {}, 404);
  }

  saveDatabase(db);
  return sendSuccess(res, { message: "O'chirildi." });
});

// ----------------------------------------------------
// 5. CERTIFICATES ENDPOINTS
// ----------------------------------------------------
app.get("/api/v1/certificates/", (req, res) => {
  const db = getDatabase();
  const sorted = [...db.certificates].sort((a, b) => b.year - a.year);
  return sendSuccess(res, sorted);
});

app.post("/api/v1/certificates/", requireAuth, (req, res) => {
  const db = getDatabase();
  const { title, organization, year, image, description } = req.body;

  if (!title || !organization || !year) {
    return sendError(res, "Sertifikat nomi, tashkilot va yil majburiy.", {}, 400);
  }

  const newCert: Certificate = {
    id: `cert-${Date.now()}`,
    doctor_id: "doc-1",
    title,
    organization,
    year: Number(year),
    image: image || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
    description: description || "",
    created_at: new Date().toISOString()
  };

  db.certificates.push(newCert);
  saveDatabase(db);
  return sendSuccess(res, newCert, 201);
});

app.patch("/api/v1/certificates/:id/", requireAuth, (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  const index = db.certificates.findIndex(c => c.id === id);
  if (index === -1) {
    return sendError(res, "Sertifikat topilmadi.", {}, 404);
  }

  db.certificates[index] = {
    ...db.certificates[index],
    ...req.body
  };

  saveDatabase(db);
  return sendSuccess(res, db.certificates[index]);
});

app.delete("/api/v1/certificates/:id/", requireAuth, (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  const initialLen = db.certificates.length;
  db.certificates = db.certificates.filter(c => c.id !== id);

  if (db.certificates.length === initialLen) {
    return sendError(res, "Sertifikat topilmadi.", {}, 404);
  }

  saveDatabase(db);
  return sendSuccess(res, { message: "O'chirildi." });
});

// ----------------------------------------------------
// 6. ARTICLES (BLOG) ENDPOINTS
// ----------------------------------------------------
app.get("/api/v1/articles/", (req, res) => {
  const db = getDatabase();
  let articles = [...db.articles];

  // Filtering
  const isAll = req.query.all === "true";
  if (!isAll) {
    articles = articles.filter(a => a.is_published);
  }

  const category = req.query.category as string;
  if (category && category !== "all") {
    articles = articles.filter(a => a.category.toLowerCase() === category.toLowerCase());
  }

  const search = (req.query.search as string || "").toLowerCase();
  if (search) {
    articles = articles.filter(a =>
      a.title.toLowerCase().includes(search) ||
      a.excerpt.toLowerCase().includes(search) ||
      a.content.toLowerCase().includes(search)
    );
  }

  // Sorting
  articles.sort((a, b) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime());

  // Pagination (default 10)
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.page_size as string) || 10;
  const total = articles.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginated = articles.slice(startIndex, startIndex + pageSize);

  return sendSuccess(res, {
    count: total,
    total_pages: totalPages,
    current_page: page,
    page_size: pageSize,
    results: paginated
  });
});

app.get("/api/v1/articles/:slug/", (req, res) => {
  const db = getDatabase();
  const { slug } = req.params;
  const article = db.articles.find(a => a.slug === slug || a.id === slug);
  if (!article) {
    return sendError(res, "Maqola topilmadi.", {}, 404);
  }

  // Related articles (same category or latest other articles)
  const related = db.articles
    .filter(a => a.id !== article.id && a.is_published)
    .slice(0, 3);

  return sendSuccess(res, {
    ...article,
    related_articles: related
  });
});

app.post("/api/v1/articles/", requireAuth, (req, res) => {
  const db = getDatabase();
  const { title, slug, category, excerpt, content, image, author, read_time_minutes, is_published } = req.body;

  if (!title || !content) {
    return sendError(res, "Sarlavha va maqola matni majburiy.", {}, 400);
  }

  const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const newArticle: Article = {
    id: `art-${Date.now()}`,
    title,
    slug: generatedSlug,
    category: category || "Salomatlik",
    excerpt: excerpt || content.slice(0, 160) + "...",
    content,
    image: image || "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
    author: author || "Dilnoza Yusupova",
    read_time_minutes: Number(read_time_minutes) || 4,
    is_published: is_published !== undefined ? !!is_published : true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  db.articles.push(newArticle);
  saveDatabase(db);
  return sendSuccess(res, newArticle, 201);
});

app.patch("/api/v1/articles/:slug/", requireAuth, (req, res) => {
  const db = getDatabase();
  const { slug } = req.params;
  const index = db.articles.findIndex(a => a.slug === slug || a.id === slug);
  if (index === -1) {
    return sendError(res, "Maqola topilmadi.", {}, 404);
  }

  db.articles[index] = {
    ...db.articles[index],
    ...req.body,
    updated_at: new Date().toISOString()
  };

  saveDatabase(db);
  return sendSuccess(res, db.articles[index]);
});

app.delete("/api/v1/articles/:slug/", requireAuth, (req, res) => {
  const db = getDatabase();
  const { slug } = req.params;
  const initialLen = db.articles.length;
  db.articles = db.articles.filter(a => a.slug !== slug && a.id !== slug);

  if (db.articles.length === initialLen) {
    return sendError(res, "Maqola topilmadi.", {}, 404);
  }

  saveDatabase(db);
  return sendSuccess(res, { message: "Maqola o'chirildi." });
});

// ----------------------------------------------------
// 7. FAQ ENDPOINTS
// ----------------------------------------------------
app.get("/api/v1/faq/", (req, res) => {
  const db = getDatabase();
  const activeOnly = req.query.all !== "true";
  const items = activeOnly ? db.faq.filter(f => f.is_active) : db.faq;
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return sendSuccess(res, sorted);
});

app.post("/api/v1/faq/", requireAuth, (req, res) => {
  const db = getDatabase();
  const { question, answer, category, order, is_active } = req.body;

  if (!question || !answer) {
    return sendError(res, "Savol va javob majburiy.", {}, 400);
  }

  const newFaq: FAQItem = {
    id: `faq-${Date.now()}`,
    question,
    answer,
    category: category || "Umumiy",
    order: Number(order) || (db.faq.length + 1),
    is_active: is_active !== undefined ? !!is_active : true,
    created_at: new Date().toISOString()
  };

  db.faq.push(newFaq);
  saveDatabase(db);
  return sendSuccess(res, newFaq, 201);
});

app.patch("/api/v1/faq/:id/", requireAuth, (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  const index = db.faq.findIndex(f => f.id === id);
  if (index === -1) {
    return sendError(res, "FAQ savoli topilmadi.", {}, 404);
  }

  db.faq[index] = {
    ...db.faq[index],
    ...req.body
  };

  saveDatabase(db);
  return sendSuccess(res, db.faq[index]);
});

app.delete("/api/v1/faq/:id/", requireAuth, (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  const initialLen = db.faq.length;
  db.faq = db.faq.filter(f => f.id !== id);

  if (db.faq.length === initialLen) {
    return sendError(res, "FAQ topilmadi.", {}, 404);
  }

  saveDatabase(db);
  return sendSuccess(res, { message: "O'chirildi." });
});

// ----------------------------------------------------
// 8. APPOINTMENTS SYSTEM ENDPOINTS
// ----------------------------------------------------
app.post("/api/v1/appointments/", async (req, res) => {
  const db = getDatabase();
  const { name, phone, email, service_id, preferred_date, preferred_time, price, message } = req.body;

  const errors: Record<string, string> = {};

  // Validation rules
  if (!name || name.trim().length < 2) {
    errors.name = "Ismni to‘liq kiriting (kamida 2 ta belgi).";
  }

  if (!phone || phone.trim().length < 7) {
    errors.phone = "To‘g‘ri telefon raqamini kiriting.";
  }

  if (email && email.trim() !== "") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.email = "Email formati noto‘g‘ri.";
    }
  }

  // Date cannot be in the past
  if (preferred_date) {
    const selectedDate = new Date(preferred_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      errors.preferred_date = "Sana o‘tib ketgan bo‘lishi mumkin emas.";
    }
  }

  // Check service if provided
  let serviceTitle = "Tibbiy muolaja";
  let resolvedPrice: number | string = price;
  if (service_id) {
    const service = db.services.find(s => s.id === service_id || s.slug === service_id);
    if (service) {
      serviceTitle = service.title;
      if (!resolvedPrice && service.price) {
        resolvedPrice = service.price;
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return sendError(res, "Ma’lumotlarni tekshirib qaytadan kiriting.", errors, 400);
  }

  const newAppointment: Appointment = {
    id: `apt-${Date.now()}`,
    name: name.trim(),
    phone: phone.trim(),
    email: email ? email.trim() : undefined,
    service_id: service_id || "srv-1",
    service_title: serviceTitle,
    preferred_date: preferred_date || new Date().toISOString().split("T")[0],
    preferred_time: preferred_time || "09:00 - 18:00",
    price: resolvedPrice || "Kelishiladi",
    message: message ? message.trim() : "",
    status: "NEW",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  db.appointments.unshift(newAppointment);
  saveDatabase(db);

  // Trigger real-time Telegram Bot notification with inline Accept/Reject buttons
  try {
    await sendTelegramNotification(newAppointment);
  } catch (tgErr) {
    console.error("Telegram notification error:", tgErr);
  }

  return sendSuccess(res, {
    appointment: newAppointment,
    message: "So‘rovingiz muvaffaqiyatli yuborildi. Shifokorimiz tez orada siz bilan bog‘lanadi."
  }, 201);
});

// Direct Decision endpoint (Accept / Reject) for API and testing
app.post("/api/v1/appointments/:id/decision/", async (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  const { action, notes } = req.body; // 'accept' or 'reject'

  const index = db.appointments.findIndex(a => a.id === id);
  if (index === -1) {
    return sendError(res, "Qabul arizasi topilmadi.", {}, 404);
  }

  const isAccept = action === 'accept' || action === 'confirm';
  db.appointments[index].status = isAccept ? 'CONFIRMED' : 'CANCELLED';
  db.appointments[index].admin_notes = notes || (isAccept ? "Qabul qilindi" : "Rad etildi");
  db.appointments[index].updated_at = new Date().toISOString();

  saveDatabase(db);
  return sendSuccess(res, {
    appointment: db.appointments[index],
    message: isAccept ? "Qabul muvaffaqiyatli tasdiqlandi." : "Qabul rad etildi."
  });
});

app.get("/api/v1/appointments/", requireAuth, (req, res) => {
  const db = getDatabase();
  let list = [...db.appointments];

  const status = req.query.status as string;
  if (status && status !== "ALL") {
    list = list.filter(a => a.status === status);
  }

  const search = (req.query.search as string || "").toLowerCase();
  if (search) {
    list = list.filter(a =>
      a.name.toLowerCase().includes(search) ||
      a.phone.toLowerCase().includes(search) ||
      (a.email && a.email.toLowerCase().includes(search)) ||
      a.service_title.toLowerCase().includes(search)
    );
  }

  list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return sendSuccess(res, {
    count: list.length,
    results: list
  });
});

app.get("/api/v1/appointments/:id/", requireAuth, (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  const apt = db.appointments.find(a => a.id === id);
  if (!apt) {
    return sendError(res, "Qabul arizasi topilmadi.", {}, 404);
  }
  return sendSuccess(res, apt);
});

app.patch("/api/v1/appointments/:id/", requireAuth, (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  const index = db.appointments.findIndex(a => a.id === id);
  if (index === -1) {
    return sendError(res, "Qabul arizasi topilmadi.", {}, 404);
  }

  const { status, admin_notes, preferred_date } = req.body;
  if (status) {
    const validStatuses: AppointmentStatus[] = ["NEW", "CONTACTED", "CONFIRMED", "COMPLETED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return sendError(res, "Noto‘g‘ri status.", {}, 400);
    }
    db.appointments[index].status = status;
  }

  if (admin_notes !== undefined) {
    db.appointments[index].admin_notes = admin_notes;
  }

  if (preferred_date) {
    db.appointments[index].preferred_date = preferred_date;
  }

  db.appointments[index].updated_at = new Date().toISOString();
  saveDatabase(db);

  return sendSuccess(res, db.appointments[index]);
});

app.delete("/api/v1/appointments/:id/", requireAuth, (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  const initialLen = db.appointments.length;
  db.appointments = db.appointments.filter(a => a.id !== id);

  if (db.appointments.length === initialLen) {
    return sendError(res, "Qabul arizasi topilmadi.", {}, 404);
  }

  saveDatabase(db);
  return sendSuccess(res, { message: "Qabul arizasi o'chirildi." });
});

// ----------------------------------------------------
// 9. ADMIN DASHBOARD STATS & TELEGRAM ENDPOINTS
// ----------------------------------------------------
app.get("/api/v1/stats/", requireAuth, (req, res) => {
  const db = getDatabase();
  const totalAppointments = db.appointments.length;
  const newAppointments = db.appointments.filter(a => a.status === "NEW").length;
  const confirmedAppointments = db.appointments.filter(a => a.status === "CONFIRMED").length;
  const completedAppointments = db.appointments.filter(a => a.status === "COMPLETED").length;

  return sendSuccess(res, {
    appointments: {
      total: totalAppointments,
      new: newAppointments,
      confirmed: confirmedAppointments,
      completed: completedAppointments
    },
    counts: {
      services: db.services.length,
      articles: db.articles.length,
      certificates: db.certificates.length,
      faq: db.faq.length,
      experiences: db.experiences.length
    },
    telegram_logs: getNotificationLogs().slice(0, 10)
  });
});

app.post("/api/v1/telegram/test/", requireAuth, async (req, res) => {
  const mockApt: Appointment = {
    id: `test-${Date.now()}`,
    name: "Sinov Foydalanuvchi (Test)",
    phone: "+998 90 000 00 00",
    service_id: "srv-1",
    service_title: "Sinov konsultatsiyasi",
    preferred_date: new Date().toISOString().split("T")[0],
    message: "Bu Telegram xabarnoma tizimi sinovi.",
    status: "NEW",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const result = await sendTelegramNotification(mockApt);
  return sendSuccess(res, {
    result,
    message: "Telegram bildirishnomasi sinovi yuborildi."
  });
});

// ----------------------------------------------------
// VITE MIDDLEWARE & SERVER STARTUP
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: "0.0.0.0", port: 3000 },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Dilnoza Doctor] Server running on http://0.0.0.0:${PORT}`);
    console.log(`[Dilnoza Doctor] Swagger API Docs available at http://localhost:${PORT}/api/docs/`);
    // Start background telegram polling for instant Accept/Reject actions
    startTelegramPolling();
  });
}

startServer();
