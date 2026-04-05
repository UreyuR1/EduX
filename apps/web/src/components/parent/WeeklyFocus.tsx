"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { WeeklyFocus as WeeklyFocusType } from "@/lib/types";

interface WeeklyFocusProps {
  focus: WeeklyFocusType;
  courseName: string;
}

export function WeeklyFocus({ focus, courseName }: WeeklyFocusProps) {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <span>🎯</span>
            This Week&apos;s Learning Focus
          </CardTitle>
          {focus.weekNumber > 0 && (
            <Badge variant="outline" className="text-xs">
              Week {focus.weekNumber}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{courseName}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {focus.source !== "teacher" && (
            <p className="font-medium text-sm">Topic: {focus.topic}</p>
          )}
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {focus.activity}
          </p>
          {focus.source === "teacher" && (
            <Badge variant="secondary" className="text-xs mt-2 bg-primary/10 text-primary border-primary/20">
              ✉ Message from your teacher
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
