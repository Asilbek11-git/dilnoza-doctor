# Dilnoza Doctor — Medical Doctor Portfolio & Appointment Platform

A high-performance, production-ready medical doctor portfolio and online appointment booking platform built for **Dr. Dilnoza Yusupova** (*Shifokor-Terapevt*, 20+ years of professional medical experience).

---

## 🌟 Key Features

- **Doctor Profile & Trust Identity:** Full biography, verified experience timeline (2006–2026), clinic affiliations, and direct emergency/consultation contact details.
- **Interactive Service Catalog:** Detailed therapeutic services with consultation duration, diagnostic indicators, and one-click booking triggers.
- **Career Timeline & Milestones:** Vertical responsive milestone timeline.
- **Certificate & Qualification Gallery:** Interactive lightbox modal with zoom and accreditation details.
- **Medical Health Blog / CMS:** Informational articles with search, tags, pagination, related articles, and mandatory medical disclaimers.
- **Real-Time Appointment Booking System:** Interactive form with live validation (Uzbek/international phone formatting, future date enforcement, duplicate prevention, and automated notifications).
- **Automated Telegram Notifications:** Modular webhook dispatcher broadcasting structured new appointment alerts to the doctor's Telegram channel/bot.
- **Administrative CMS Dashboard:** Full JWT-authenticated dashboard to manage doctor info, services, timeline, certificates, articles, FAQ, and incoming appointment triage (NEW → CONTACTED → CONFIRMED → COMPLETED → CANCELLED).
- **Interactive OpenAPI / Swagger Documentation:** Live documentation viewer available at `/api/docs/` and `/api/schema/`.
- **Multilingual Support:** Seamless client-side language switching between Uzbek (O‘zbekcha - default), Russian (Русский), and English (English).
- **SEO & Medical Safety:** OpenGraph tags, semantic schema, responsive typography, and clear medical safety disclaimers.

---

## 🛠 Tech Stack

### Frontend
- **React 19 + TypeScript + Vite**
- **Tailwind CSS v4** (Medical Palette: `#0F766E` Primary Teal, `#14B8A6` Mint, `#F8FAFC` Background, `#0F172A` Text)
- **Lucide Icons**
- **Motion (Framer Motion)** for smooth entrance and transition animations
- **Canvas-Confetti** for appointment confirmation UX

### Backend
- **Express / Node.js Full-Stack REST API** running on Port 3000 (with persistent JSON storage in `data/db.json`)
- **Django 5.0 + Django REST Framework + SimpleJWT** (ready for production deployment with PostgreSQL)
- **drf-spectacular** (OpenAPI 3.0 & Swagger UI)
- **Modular Telegram Bot Notification Service**

---

## 🚀 Quick Start (Local Node & Express Server)

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run Development Server:**
   ```bash
   npm run dev
   ```
   The application will start on `http://localhost:3000`.

3. **Access Interactive API Docs (Swagger):**
   Open `http://localhost:3000/api/docs/` in your browser.

4. **Admin Login:**
   - **Username:** `admin`
   - **Password:** `adminpassword123`

---

## 🐳 Docker & PostgreSQL Deployment

To run with PostgreSQL and Django backend via Docker Compose:

```bash
docker-compose up --build
```

Services started:
- `doctor_postgres`: PostgreSQL 16 on port 5432
- `doctor_backend`: Django REST Framework on port 8000
- `doctor_frontend`: React + Express Web Platform on port 3000

---

## 📡 REST API Endpoints Overview

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/v1/doctor/` | Public doctor profile & statistics | Public |
| `PATCH` | `/api/v1/doctor/` | Update doctor profile | Admin (JWT) |
| `GET` | `/api/v1/services/` | List medical services | Public |
| `POST` | `/api/v1/services/` | Create medical service | Admin (JWT) |
| `GET` | `/api/v1/services/{slug}/` | Get service details | Public |
| `GET` | `/api/v1/experiences/` | Career timeline items | Public |
| `GET` | `/api/v1/certificates/` | Qualifications & certificates | Public |
| `GET` | `/api/v1/articles/` | Paginated articles with search | Public |
| `GET` | `/api/v1/articles/{slug}/` | Article detail with related items | Public |
| `GET` | `/api/v1/faq/` | Categorized FAQ list | Public |
| `POST` | `/api/v1/appointments/` | Submit appointment request | Public |
| `GET` | `/api/v1/appointments/` | Triage & list appointments | Admin (JWT) |
| `PATCH` | `/api/v1/appointments/{id}/` | Update appointment status/notes | Admin (JWT) |
| `POST` | `/api/v1/auth/login/` | Admin JWT login | Public |
| `GET` | `/api/v1/stats/` | Dashboard metrics | Admin (JWT) |

---

## ⚕️ Medical Disclaimer

> *Ushbu vebsaytda keltirilgan barcha maqolalar va ma’lumotlar faqatgina umumiy tanishuv maqsadida taqdim etiladi. Aniq tibbiy tashxis qo‘yish va individual davolash rejasini tuzish uchun shifokor qabuliga yozilish yoki bevosita tibbiy muassasaga murojaat qilish tavsiya etiladi.*

---
© 2026 Dr. Dilnoza Yusupova. Barcha huquqlar himoyalangan.
