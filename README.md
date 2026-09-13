<div align=center>

  <img src=absenku-frontend/public/logo.svg alt=Absenku Logo width=96 height=96 />

  # ABSENKU — Fullstack Monorepo
  ### Smart Attendance System (WFH & Hybrid Workforce)

  <p align=center>
    Sistem presensi web cerdas berbasis <b>Face Recognition & Geolocation</b> yang dirancang dengan arsitektur modern, performa tinggi, dan keamanan enterprise.
  </p>

  <p align=center>
    <img src=https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js&logoColor=white alt=Next.js 16 />
    <img src=https://img.shields.io/badge/NestJS_11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white alt=NestJS />
    <img src=https://img.shields.io/badge/Prisma_ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white alt=Prisma />
    <img src=https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white alt=TypeScript 5 />
    <img src=https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white alt=Tailwind CSS v4 />
  </p>

</div>

---

## 📁 Struktur Monorepo

Repository ini memuat keseluruhan ekosistem aplikasi **Absenku**:

`
absenku-app/
├── absenku-frontend/        # Frontend Client (Next.js 16 App Router, Tailwind v4, Clean Architecture)
├── absenku-backend/         # Backend REST API (NestJS, Prisma ORM, JWT Cookie Authentication)
├── .gitignore               # Konfigurasi ignore terpusat
└── README.md                # Dokumentasi utama proyek
`

---

## ⚡ Quick Start Guide

### 1. Prasyarat Sistem
- **Node.js**: 20.x atau 22.x
- **Database**: PostgreSQL (aktif dan siap menerima koneksi Prisma)
- **Package Manager**: 
pm

---

### 2. Menjalankan Backend (bsenku-backend)

Buka terminal pertama:
`ash
cd absenku-backend

# 1. Install dependencies
npm install

# 2. Setup Environment Variables
cp .env.example .env
# Sesuaikan DATABASE_URL, JWT_SECRET, ACCESS_TOKEN, dan PORT (default: 4000)

# 3. Jalankan migrasi database Prisma
npx prisma migrate dev

# 4. Jalankan backend server
npm run start:dev
`
Backend API akan berjalan di http://localhost:4000.

---

### 3. Menjalankan Frontend (bsenku-frontend)

Buka terminal kedua:
`ash
cd absenku-frontend

# 1. Install dependencies
npm install

# 2. Setup Environment Variables
cp .env.example .env
# Pastikan NEXT_PUBLIC_API_BASE_URL=http://localhost:4000

# 3. Jalankan Next.js frontend dev server
npm run dev
`
Buka browser Anda dan akses aplikasi di http://localhost:3000.

---

## 🔐 Arsitektur Autentikasi & Keamanan

- **HttpOnly Cookie Authentication**: Token JWT dikirim melalui header Set-Cookie dengan flag httpOnly: true dan sameSite: 'strict' sehingga kebal dari serangan pencurian XSS.
- **CORS & Credentials**: Backend dikonfigurasi dengan credentials: true untuk origin http://localhost:3000, dan Axios frontend menggunakan withCredentials: true.
- **Centralized Error Normalization**: Error dari class-validator NestJS diproses dan dinormalisasi secara otomatis menjadi pesan yang ramah pengguna di sisi frontend.

---

## 📄 Hak Cipta & Lisensi

`	ext
Copyright (c) 2026 Yusuf Afandi. All Rights Reserved.
This project is submitted solely for recruitment assessment purposes.
Unauthorized commercial use, reproduction, or distribution is strictly prohibited.
`
