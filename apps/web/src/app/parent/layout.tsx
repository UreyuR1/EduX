"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { getCurrentUser } from "@/lib/auth";

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const u = getCurrentUser();
    setLanguage(u.language);

    const handler = (e: Event) => {
      const newUser = (e as CustomEvent).detail;
      setLanguage(newUser.language);
    };
    window.addEventListener("edux-user-changed", handler);
    return () => window.removeEventListener("edux-user-changed", handler);
  }, []);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    window.dispatchEvent(new CustomEvent("edux-language-changed", { detail: lang }));
  };

  return (
    <div className="flex flex-col h-screen">
      <Header
        showLanguageToggle
        language={language}
        onLanguageChange={handleLanguageChange}
      />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
