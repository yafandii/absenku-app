<div align="center">

  <img src="public/logo.svg" alt="Absenku Logo" width="84" height="84" />

  # ABSENKU
  ### Modern Smart Attendance Web System for Remote & WFH Workforce

  <p align="center">
    Sistem presensi kehadiran cerdas berbasis <b>Face Recognition & Geolocation</b> yang dirancang untuk efisiensi, akurasi, dan integritas data kerja presisi tinggi.
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 16" />
    <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5" />
    <img src="https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS v4" />
    <img src="https://img.shields.io/badge/Architecture-Clean_Architecture-4F46E5?style=for-the-badge" alt="Clean Architecture" />
  </p>

</div>

---

## 🌟 Key Highlights & Features

| Fitur | Deskripsi |
| :--- | :--- |
| 🛡️ **Clean Architecture** | Pemisahan ketat 4-layer (*Domain*, *Data*, *Infrastructure*, *Presentation*) yang modular dan mudah diuji. |
| 🔒 **Enterprise Cookie Auth** | Autentikasi aman berbasis *HttpOnly Cookie* (`withCredentials: true`), terlindung dari eksploitasi XSS. |
| ⚡ **Centralized Error Handling** | Standardisasi penanganan error NestJS DTO validation, HTTP status codes, network timeouts, dan sesi kadaluarsa. |
| 🎨 **Identic-Inspired Design** | Palet warna *Deep Indigo* & *Electric Violet* dengan komponen atomik reusable dan visual feedback responsif. |
| 📱 **Mobile-First Responsive** | Tampilan presisi tinggi yang adaptif di layar smartphone compact hingga monitor desktop resolusi 4K. |

---

## 🏛️ Arsitektur Proyek (Clean Architecture)

Mengadopsi pola arsitektur **Clean Architecture (Onion Pattern)** untuk memastikan independensi logika bisnis terhadap framework UI dan library pihak ketiga:

```
src/
├── app/                           # Thin Route Adapters (Next.js App Router)
│   ├── (auth)/login/              # Route /login (delegasi langsung ke Presentation View)
│   ├── (employee)/                # Employee Routes (dashboard, clock-in, clock-out, history)
│   └── (admin)/                   # Admin Routes (live-monitor, reports, settings)
│
├── domain/                        # Core Business Logic (Layer Terbersih / Framework-Agnostic)
│   ├── entities/                  # Model data bisnis murni
│   ├── repositories/              # Interface / Contract repository
│   └── use-cases/                 # Aturan bisnis aplikasi
│
├── data/                          # Data Access Layer
│   ├── dto/                       # Data Transfer Objects (Request/Response API)
│   ├── data-sources/              # Panggilan remote API / local persistence
│   └── repositories/              # Implementasi konkret dari domain repository
│
├── infrastructure/                # Eksternal Adapter & Utilities
│   └── http/                      # Axios client instance, endpoints, token storage, & error mapping
│
└── presentation/                  # UI Components & State Management
    ├── components/common/         # Atomic Reusable Components (Card, Button, Input, Alert)
    ├── views/                     # Screen / Page Orchestrators
    └── hooks/                     # Controller Custom Hooks ("Dapur Kotor" State & Event Handlers)
```

---

## 🎨 Design System & Palette

Antarmuka dibangun dengan palet warna enterprise modern yang segar dan profesional:

| Token | Warna | Hex | Kegunaan |
| :--- | :---: | :---: | :--- |
| **Primary Accent** | Deep Indigo | `#4F46E5` | Tombol CTA utama, badge header, active focus states |
| **Secondary Accent** | Electric Violet | `#7C3AED` | Gradient glow ambient, hover visual highlights |
| **Canvas Background** | Slate Gradient | `#F8FAFC` → `#F1F5F9` | Latar belakang bersih dengan soft lighting blur |
| **Error Feedback** | Rose Crimson | `#E11D48` | Alert validasi formulir dan kegagalan API |

---

## 🚀 Memulai (Getting Started)

### 1. Prasyarat Sistem
- **Node.js**: `v20.x` atau `v22.x` (Disarankan LTS terbaru)
- **Package Manager**: `npm`

### 2. Kloning & Instalasi Dependensi
```bash
git clone <repository-url>
cd absenku-frontend
npm install
```

### 3. Konfigurasi Environment Variable
Salin template konfigurasi `.env.example` ke `.env`:

```bash
cp .env.example .env
```

Pastikan variabel environment telah sesuai dengan endpoint backend Anda:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_ID_COOKIE_TOKEN=_AT_
```

### 4. Menjalankan Development Server
```bash
npm run dev
```

Buka browser dan akses aplikasi di:
```
http://localhost:3000
```

---

## 📦 Scripts yang Tersedia

| Command | Kegunaan |
| :--- | :--- |
| `npm run dev` | Menjalankan local dev server dengan Turbopack |
| `npm run build` | Menjalankan build bundle production |
| `npm run start` | Menjalankan production server setelah build |
| `npm run lint` | Menjalankan pemeriksaan ESLint |
| `npx tsc --noEmit` | Memvalidasi integritas static type checking TypeScript |

---

<div align="center">
  <sub>Dibangun dengan dedikasi untuk performa dan arsitektur web modern &bull; <b>Absenku Tech Team</b></sub>
</div>
