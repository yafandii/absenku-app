<div align="center">

  <img src="public/logo.svg" alt="Absenku Logo" width="96" height="96" />

  # ABSENKU FRONTEND
  ### Modern Smart Attendance Web System for Remote & Hybrid Workforce

  <p align="center">
    Sistem presensi kehadiran cerdas berbasis <b>Face Capture & Geolocation Geofencing</b> yang dirancang dengan standar enterprise untuk akurasi data, keamanan, dan efisiensi manajemen operasional SDM.
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

## 🌟 Fitur Utama (Key Features)

### 1. 🕒 Smart Attendance & Employee Dashboard
- **Clock-In & Clock-Out Real-Time**: Pencatatan waktu masuk dan pulang presisi dengan validasi status kehadiran (*On Time*, *Late*).
- **Face Capture & Geolocation Geofencing**: Verifikasi visual kamera langsung serta pengecekan koordinat GPS karyawan terhadap radius kantor/zona kerja yang ditentukan.
- **Monthly Summary Cards**: Ringkasan performa kehadiran bulanan (Total Kehadiran, Keterlambatan, Absen, serta status kepatuhan *Safe / Danger* dan skor *Good / Needs Improvement*).
- **Riwayat Presensi (Attendance History)**: Filter riwayat berdasarkan tanggal dan bulan dengan rincian durasi kerja harian.

### 2. 📊 Live Monitoring Presensi (HRD & Manajemen)
- **Real-Time Presence Tracking**: Pantau status kehadiran seluruh karyawan hari ini secara langsung.
- **Multi-Level Filtering & Quick Search**: Filter berdasarkan tanggal, divisi, status kehadiran (*Tepat Waktu*, *Terlambat*, *Belum Checkout*), serta pencarian instan (Nama, NIK, Email, Divisi).
- **Detail Presensi & Modal Interaktif**: Tinjau foto absensi, catatan, koordinat lokasi, dan jam absensi detail.
- **Export Multi-Format**: Ekspor data laporan presensi ke dalam format **Excel (.xlsx)**, **CSV**, dan cetak/unduh langsung sebagai dokumen **PDF**.
- **Pagination Interaktif**: Navigasi data terstruktur dengan pemilih jumlah baris (10, 25, 50 data per halaman) tanpa lag.

### 3. 👥 Manajemen Karyawan (User Management)
- **Full CRUD Karyawan**: Tambah karyawan baru, edit biodata/divisi/role/status aktif, dan hapus karyawan dengan modal konfirmasi aman.
- **Reset Password (Admin/HRD)**: Fasilitas bagi HRD/Admin untuk me-reset password akun karyawan yang terkendala login.
- **Ganti Password Mandiri**: Pengguna dapat memperbarui kata sandi akun secara mandiri melalui modal profil terproteksi.
- **Filter Role & Search**: Penyaringan cepat berdasarkan peran (*ALL*, *HRD*, *EMPLOYEE*) dan pencarian data karyawan.

### 4. 🔒 Enterprise Security & Architecture
- **HttpOnly Cookie Authentication**: Penyimpanan token terisolasi dari akses JavaScript sisi browser (`withCredentials: true`), melindungi aplikasi dari kerentanan serangan XSS (*Cross-Site Scripting*).
- **Strict Clean Architecture**: Pemisahan tegas antara logika bisnis (*Domain*), akses API (*Data*), konfigurasi eksternal (*Infrastructure*), dan tampilan antarmuka (*Presentation*).
- **Centralized Error Handling**: Pemetaan otomatis error validasi NestJS DTO, status kode HTTP, koneksi terputus, dan penanganan sesi kedaluwarsa secara konsisten.
- **No Cascading Re-renders**: Optimasi React 19 tanpa efek samping re-render beruntun pada filter dan paginasi tabel.

---

## 🏛️ Arsitektur Proyek (Clean Architecture)

Aplikasi ini menerapkan prinsip **Clean Architecture (Onion Pattern)** guna menjamin kode yang *loosely coupled*, *maintainable*, serta mudah diuji secara independen dari framework UI:

```
src/
├── app/                           # Thin Route Adapters (Next.js App Router)
│   ├── (auth)/                    # Public Authentication Routes (/login)
│   ├── (employee)/                # Employee Workspace (/dashboard)
│   ├── (admin)/                   # HRD/Admin Workspace
│   │   ├── employees/             # Kelola Karyawan (User Management)
│   │   ├── monitoring-presensi/   # Live Monitoring Presensi Karyawan
│   │   ├── reports/               # Laporan Rekapitulasi Presensi
│   │   └── settings/              # Konfigurasi Sistem
│   ├── layout.tsx                 # Root Layout & Font Providers
│   └── globals.css                # Tailwind CSS v4 Core Tokens & Reset
│
├── domain/                        # Pure Business Logic (Framework Agnostic)
│   ├── entities/                  # Model entitas bisnis murni (User, Attendance, Master)
│   ├── repositories/              # Interface / Kontrak repository
│   └── use-cases/                 # Single-responsibility use cases (CreateUser, ClockIn, Login, dll)
│
├── data/                          # Data Access Layer
│   ├── dto/                       # Data Transfer Objects (Request & Response API payload)
│   ├── data-sources/              # Pemanggilan HTTP API (Axios Remote Data Source)
│   └── repositories/              # Implementasi konkret dari kontrak Domain Repository
│
├── infrastructure/                # External Services & Drivers
│   └── http/                      # Axios client instance, cookies adapter, & central error handler
│
├── presentation/                  # UI Components, Layouts, & Presentation State
│   ├── components/common/         # Komponen atomik reusable (Button, Input, Card, Modal, Icons)
│   ├── views/                     # Screen / View Orchestrator per modul
│   └── hooks/                     # Custom Hook Controller (State management, filter, & paginasi)
│
└── utils/                         # Helper Murni (Export Excel, CSV, PDF, Format Tanggal)
```

### 🔄 Alur Aliran Data (Data Flow)
```
[User Action / View]
        ↓
[Presentation Hook (Controller)]
        ↓
[Domain Use Case (Business Rules)]
        ↓
[Domain Repository Interface]
        ↓
[Data Repository Implementation]
        ↓
[Remote Data Source (Axios Client)]
        ↓
[Backend API (NestJS REST Endpoints)]
```

---

## 🎨 Design System & Visual Palette

Dibangun dengan pendekatan desain modern, kontras tinggi, dan tata letak responsif:

| Token | Deskripsi | Nilai Hex | Visual |
| :--- | :--- | :---: | :---: |
| **Brand Primary** | Deep Indigo | `#4F46E5` | ![#4F46E5](https://via.placeholder.com/15/4F46E5/000000?text=+) |
| **Brand Secondary** | Electric Violet | `#7C3AED` | ![#7C3AED](https://via.placeholder.com/15/7C3AED/000000?text=+) |
| **Success / On-Time** | Emerald Green | `#10B981` | ![#10B981](https://via.placeholder.com/15/10B981/000000?text=+) |
| **Warning / Late** | Amber Orange | `#F59E0B` | ![#F59E0B](https://via.placeholder.com/15/F59E0B/000000?text=+) |
| **Danger / Absent** | Rose Red | `#EF4444` | ![#EF4444](https://via.placeholder.com/15/EF4444/000000?text=+) |
| **Canvas Background** | Slate Clean Tint | `#F8FAFC` → `#F1F5F9` | ![#F8FAFC](https://via.placeholder.com/15/F8FAFC/000000?text=+) |

---

## 🚀 Memulai (Getting Started)

### 1. Prasyarat Sistem
- **Node.js**: Versi `v20.x` atau `v22.x` (Disarankan versi LTS)
- **Package Manager**: `npm` versi 9 atau lebih baru
- **Backend Absenku**: Pastikan service `absenku-backend` (NestJS) telah aktif

### 2. Kloning & Instalasi
```bash
git clone <repository-url>
cd absenku-frontend
npm install
```

### 3. Konfigurasi Environment Variable
Salin berkas template `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```

Sesuaikan nilai variabel lingkungan pada `.env`:
```env
# URL Basis API NestJS Backend
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000

# Nama Key Cookie Token Sesi
NEXT_PUBLIC_ID_COOKIE_TOKEN=_AT_
```

### 4. Menjalankan Server Pengembangan

#### Menjalankan secara Lokal Standard:
```bash
npm run dev
```
Buka peramban di [http://localhost:3000](http://localhost:3000).

#### Menjalankan dengan HTTPS (Untuk Uji Kamera & Geolocation di Perangkat Mobile LAN):
```bash
npm run dev:https
```
> *Catatan: Fitur browser seperti `navigator.mediaDevices.getUserMedia` (kamera) dan `navigator.geolocation` memerlukan konteks aman (HTTPS) ketika diakses dari perangkat selain `localhost`.*

---

## 📦 Skrip NPM yang Tersedia

| Perintah | Deskripsi |
| :--- | :--- |
| `npm run dev` | Menjalankan Next.js development server pada port default `3000` |
| `npm run dev:https` | Menjalankan server dev dengan sertifikat SSL/HTTPS eksperimental |
| `npm run build` | Melakukan kompilasi dan optimasi bundle production |
| `npm run start` | Menjalankan production server hasil build |
| `npm run lint` | Menjalankan linter ESLint untuk menjamin kualitas kode |
| `npx tsc --noEmit` | Memverifikasi konsistensi static typing TypeScript |

---

## 🛠️ Standar Kode & Kualitas (Code Quality)
- **Clean Hooks**: Menghindari *cascading re-render* dengan pola event-driven state updates (*"You Might Not Need an Effect"*).
- **TypeScript Strict Mode**: Seluruh entitas, payload DTO, dan properti komponen divalidasi dengan tipe data eksplisit tanpa `any` liar.
- **Atomic Components**: Komponen tombol, modal, input, dan tabel dibuat modular dan dapat dipakai ulang (*reusable*).

---

<div align="center">
  <sub>Dikembangkan dengan ❤️ untuk efisiensi operasional presensi modern &bull; <b>Absenku Engineering Team</b></sub>
</div>
