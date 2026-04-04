"use client";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const links = [
    { href: "/teacher/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/teacher/chat", label: "Chat", icon: "💬" },
  ];

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          links={links}
          title="Teacher Portal"
          subtitle="Riverside Primary School"
        />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
