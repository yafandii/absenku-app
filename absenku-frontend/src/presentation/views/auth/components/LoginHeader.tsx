import React from "react";
import Image from "next/image";

export const LoginHeader: React.FC = () => {
  return (
    <div className="text-center mb-7">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-lg shadow-indigo-500/10 border border-slate-100 mb-2 transform hover:scale-105 transition-transform duration-200">
        <Image
          src="/logo.svg"
          width={48}
          height={48}
          alt="Logo Absenku"
          priority
        />
      </div>

      <h1 className="text-3xl font-black tracking-tight text-slate-900">
        ABSEN<span className="text-indigo-600">KU</span>
      </h1>
      <p className="mt-1 text-xs text-slate-500 font-medium">
        Sistem Presensi Web Pintar Karyawan WFH
      </p>
    </div>
  );
};
