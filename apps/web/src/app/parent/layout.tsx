"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { getCurrentUser, type MockUser } from "@/lib/auth";
import { t } from "@/lib/i18n";

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useState("en");
  const [user, setUser] = useState<MockUser | null>(null);

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
    setLanguage(u.language);
  }, []);

  const links = [
    { href: "/parent/dashboard", label: t("nav.dashboard", language), icon: "📊" },
    { href: "/parent/chat", label: t("nav.chat", language), icon: "💬" },
  ];

  return (
    <div className="flex flex-col h-screen">
      <Header
        showLanguageToggle
        language={language}
        onLanguageChange={setLanguage}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          links={links}
          title={user?.childName || "My Child"}
          subtitle="Riverside Primary School"
        />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
