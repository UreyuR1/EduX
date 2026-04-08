"use client";

import { Header } from "@/components/layout/Header";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
