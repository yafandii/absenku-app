import { Metadata } from "next";
import { LoginPage } from "@/presentation/views/auth/LoginPage";

export const metadata: Metadata = {
  title: "Login Karyawan | Absenku — Dexa Group",
  description: "Halaman login presensi WFH karyawan Dexa Group",
};

export default function Page() {
  return <LoginPage />;
}
