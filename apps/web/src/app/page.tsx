"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { setCurrentUser } from "@/lib/auth";

export default function Home() {
  const router = useRouter();

  const handleSelect = (userId: string, path: string) => {
    setCurrentUser(userId);
    router.push(path);
  };

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">EduX</h1>
          <p className="text-muted-foreground text-lg">
            Accessible &amp; Actionable Communication between Teachers and Parents
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            className="cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => handleSelect("parent-1", "/parent/dashboard")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">👨‍👩‍👧</span>
                Parent Portal
              </CardTitle>
              <CardDescription>
                View your child&apos;s courses, learning progress, and chat with the AI Learning Advisor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Enter as Parent</Button>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => handleSelect("teacher-1", "/teacher/dashboard")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">👩‍🏫</span>
                Teacher Portal
              </CardTitle>
              <CardDescription>
                View parent feedback, AI-generated insights, and communicate with parents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Enter as Teacher</Button>
            </CardContent>
          </Card>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Powered by CurricuLLM API · Riverside Primary School Demo
        </p>
      </div>
    </div>
  );
}
