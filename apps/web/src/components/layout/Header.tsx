"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MOCK_USERS, getCurrentUser, setCurrentUser, type MockUser } from "@/lib/auth";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n";

interface HeaderProps {
  showLanguageToggle?: boolean;
  language?: string;
  onLanguageChange?: (lang: string) => void;
}

export function Header({ showLanguageToggle, language, onLanguageChange }: HeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<MockUser | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const handleUserSwitch = (userId: string) => {
    const newUser = setCurrentUser(userId);
    if (newUser) {
      setUser(newUser);
      const path = newUser.role === "TEACHER" ? "/teacher/dashboard" : "/parent/dashboard";
      router.push(path);
    }
  };

  return (
    <header className="h-14 border-b flex items-center justify-between px-6 bg-background shrink-0">
      <div className="flex items-center gap-3">
        <span
          className="font-bold text-lg tracking-tight cursor-pointer"
          onClick={() => router.push("/")}
        >
          EduX
        </span>
        <Badge variant="secondary" className="text-xs">
          {user.role === "TEACHER" ? "Teacher" : "Parent"}
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        {showLanguageToggle && (
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
              {SUPPORTED_LANGUAGES.find((l) => l.code === language)?.label || "English"}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => onLanguageChange?.(lang.code)}
                >
                  {lang.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <span className="text-sm hidden sm:inline">{user.name}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Switch User</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
              Teachers
            </DropdownMenuLabel>
            {MOCK_USERS.filter((u) => u.role === "TEACHER").map((u) => (
              <DropdownMenuItem
                key={u.id}
                onClick={() => handleUserSwitch(u.id)}
                className={u.id === user.id ? "bg-accent" : ""}
              >
                {u.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
              Parents
            </DropdownMenuLabel>
            {MOCK_USERS.filter((u) => u.role === "PARENT").map((u) => (
              <DropdownMenuItem
                key={u.id}
                onClick={() => handleUserSwitch(u.id)}
                className={u.id === user.id ? "bg-accent" : ""}
              >
                {u.name} {u.childName ? `(${u.childName})` : ""}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
