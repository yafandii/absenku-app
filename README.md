<div align="center">

  <img src="absenku-frontend/public/logo.svg" alt="Absenku Logo" width="96" height="96" />

  # ABSENKU - Fullstack Monorepo
  ### Smart Attendance System (WFH & Hybrid Workforce)

  <p align="center">
    Sistem presensi web cerdas berbasis <b>Face Verification & Geolocation</b> yang dirancang dengan arsitektur modern, performa tinggi, dan keamanan tingkat enterprise.
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 16" />
    <img src="https://img.shields.io/badge/NestJS_11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
    <img src="https://img.shields.io/badge/Prisma_ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5" />
    <img src="https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS v4" />
  </p>

</div>

---

## 🌟 Fitur Utama

### 1. 🕒 Presensi Mandiri Karyawan (Self-Service Attendance)
* **Clock-In & Clock-Out Pintar:** Validasi foto wajah langsung via webcam (*live capture viewfinder*) dan koordinat geolocation perangkat (*latitude & longitude*).
* **Timer Durasi Kerja Berjalan:** Penghitung durasi kerja harian berjalan secara real-time.
* **Keamanan Kredensial Mandiri:** Fitur **Ganti Password** mandiri bagi karyawan dengan validasi password lama demi privasi akun.

### 2. 📊 Ringkasan Metrik & Analisis Kedisiplinan Real-Time
* **Kalkulasi Jam Kerja Riil (*True Work Hours*):** Akumulasi jam kerja bulanan dihitung berdasarkan sesi yang sudah selesai (*Clock-Out*), dengan proteksi otomatis (*auto-cap*) untuk hari lampau yang lupa di-clock-out.
* **Tingkat Kedisiplinan (*On-Time Attendance Rate*):** Dihitung secara presisi berdasarkan persentase ketepatan waktu dari kehadiran yang nyata dijalani.
* **Indikator Keterlambatan Cerdas:** Status toleransi keterlambatan bulanan otomatis terdeteksi (`[Safe]` / `[Danger]`).

### 3. 👥 Manajemen Pengguna (HRD / Admin)
* **CRUD Karyawan Lengkap:** Tambah, edit data profil, divisi, peran (`EMPLOYEE` / `HRD`), dan status aktif karyawan.
* **Tabel Terpaginasi & Filter:** Pagination fleksibel (10, 25, 50 data/halaman), pencarian instan nama/email/ID, dan filter peran.
* **Reset Password Darurat:** HRD memiliki wewenang mereset password akun karyawan yang lupa akses tanpa mengetahui password pribadi sebelumnya.

### 4. 📡 Live Monitoring Presensi (HRD)
* **Pemantauan Presensi Real-Time:** Melihat seluruh aktivitas clock-in dan clock-out seluruh karyawan secara terpusat.
* **Filter Multifaktor:** Filter berdasarkan rentang tanggal, status kehadiran (Tepat Waktu / Terlambat), serta divisi.
* **Ekspor Laporan:** Ekspor data rekapitulasi presensi ke format CSV dengan format data siap olah untuk kebutuhan payroll.

---

## 📁 Struktur Monorepo

Repository ini memuat keseluruhan ekosistem aplikasi **Absenku**:

```text
absenku-app/
├── absenku-frontend/        # Client App (Next.js 16 App Router, Tailwind CSS v4, Clean Architecture)
│   ├── src/
│   │   ├── app/             # App Router Pages & Layouts
│   │   ├── domain/          # Entities, Repositories (Interface), Use Cases
│   │   ├── data/            # DTO, Data Sources, Repository Implementations
│   │   ├── infrastructure/  # HTTP Axios Client, API Endpoints, Error Handler
│   │   └── presentation/    # Components, Views, Custom Hooks
├── absenku-backend/         # REST API (NestJS 11, Prisma ORM, JWT Cookie Auth, Role Guards)
│   ├── src/
│   │   ├── common/          # Decorators (@GetUser, @Roles), Guards, Config
│   │   └── modules/         # Auth, Users, Attendances, Divisions, Prisma
│   └── prisma/              # Prisma Schema & Database Migrations
├── .gitignore               # Konfigurasi Git ignore terpusat
└── README.md                # Dokumentasi utama proyek
```

---

## 🚀 Quick Start Guide

### 1. Prasyarat Sistem
* **Node.js**: ≥ 20.x atau ≥ 22.x
* **Database**: MySQL / PostgreSQL (aktif dan siap menerima koneksi Prisma)
* **Package Manager**: npm

---

### 2. Menjalankan Backend (`absenku-backend`)

Buka terminal:
```bash
cd absenku-backend

# 1. Install dependencies
npm install

# 2. Setup Environment Variables
cp .env.example .env
# Sesuaikan DATABASE_URL, JWT_SECRET, ACCESS_TOKEN_EXPIRATION, dan PORT (default: 4000)

# 3. Jalankan migrasi database Prisma
npx prisma migrate dev

# 4. Jalankan backend dev server
npm run start:dev
```
Backend API akan berjalan di `http://localhost:4000`.

---

### 3. Menjalankan Frontend (`absenku-frontend`)

Buka terminal baru:
```bash
cd absenku-frontend

# 1. Install dependencies
npm install

# 2. Setup Environment Variables
cp .env.example .env
# Pastikan NEXT_PUBLIC_API_BASE_URL=http://localhost:4000

# 3. Jalankan Next.js dev server
npm run dev
```
Buka browser Anda dan akses aplikasi di `http://localhost:3000`.

---

## 🔒 Arsitektur Autentikasi & Keamanan

* **HttpOnly Cookie Authentication**: Token JWT disimpan via header `Set-Cookie` dengan flag `httpOnly: true`, `sameSite: 'lax'`/`'strict'`, mengeliminasi risiko pencurian token via serangan XSS.
* **Role-Based Access Control (RBAC)**: Proteksi ganda pada level controller & route menggunakan `RolesGuard` dan decorator `@Roles(Role.HRD)` untuk endpoint sensitif (manajemen user, reset password, monitoring).
* **CORS & Credentials Security**: Backend dikonfigurasi dengan whitelist origin ketat dan `credentials: true` untuk komunikasi aman antar domain/port.
* **Centralized API Error Normalization**: Validasi DTO dari `class-validator` NestJS dinormalisasi secara otomatis menjadi pesan error yang ramah pengguna (*user-friendly*) di UI frontend.

---

## 📄 Hak Cipta & Lisensi

```text
Copyright (c) 2026 Yusuf Afandi. All Rights Reserved.
This project is submitted solely for recruitment assessment purposes.
Unauthorized commercial use, reproduction, or distribution is strictly prohibited.
```
