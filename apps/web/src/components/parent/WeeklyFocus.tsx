"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { t } from "@/lib/i18n";
import type { WeeklyFocus as WeeklyFocusType } from "@/lib/types";

interface WeeklyFocusProps {
  focus: WeeklyFocusType;
  courseName: string;
  language?: string;
}

function weekLabel(n: number, language: string) {
  if (language === "zh") return `\u7b2c ${n} \u5468`;
  if (language === "hi") return `\u0938\u092a\u094d\u0924\u093e\u0939 ${n}`;
  return `Week ${n}`;
}

function localise(en: string, zh: string | undefined, hi: string | undefined, language: string): string {
  if (language === "zh" && zh) return zh;
  if (language === "hi" && hi) return hi;
  return en;
}

export function WeeklyFocus({ focus, courseName, language = "en" }: WeeklyFocusProps) {
  const topic = localise(focus.topic, focus.topic_zh, focus.topic_hi, language);
  const activity = localise(focus.activity, focus.activity_zh, focus.activity_hi, language);

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <span>🎯</span>
            {t("parent.weeklyFocus", language)}
          </CardTitle>
          <div className="flex items-center gap-1.5">
            {focus.curriculumCode && (
              <Badge variant="outline" className="text-xs font-mono text-muted-foreground">
                {focus.curriculumCode}
              </Badge>
            )}
            {focus.weekNumber > 0 && (
              <Badge variant="outline" className="text-xs">
                {weekLabel(focus.weekNumber, language)}
              </Badge>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{courseName}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {focus.source !== "teacher" && (
            <p className="font-medium text-sm">{t("parent.weeklyFocus.topic", language)}: {topic}</p>
          )}
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {activity}
          </p>
          {focus.source === "teacher" && (
            <Badge variant="secondary" className="text-xs mt-2 bg-primary/10 text-primary border-primary/20">
              ✉ {t("parent.weeklyFocus.teacherMsg", language)}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
