"use client";

import React from "react";
import { useLogin } from "@/presentation/hooks/useLogin";
import { Card } from "@/presentation/components/common/Card";
import { LoginHeader } from "./components/LoginHeader";
import { LoginForm } from "./components/LoginForm";
import { LoginFooter } from "./components/LoginFooter";

export const LoginPage: React.FC = () => {
  const { state, actions } = useLogin();

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-slate-100 via-indigo-50/30 to-slate-200/70 text-slate-800 p-4 sm:p-6 relative overflow-hidden font-sans">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/50 rounded-full blur-[120px] pointer-events-none" />

      <main className="w-full max-w-md z-10">
        <LoginHeader />
        <Card>
          <LoginForm state={state} actions={actions} />
          <LoginFooter />
        </Card>
      </main>
    </div>
  );
};
