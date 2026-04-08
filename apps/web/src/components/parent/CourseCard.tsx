"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { t } from "@/lib/i18n";
import type { Course, PerformanceNote } from "@/lib/types";

interface CourseCardProps {
  course: Course;
  performance?: PerformanceNote;
  expanded?: boolean;
  onToggle?: () => void;
  language?: string;
}

/** Replace English structural headings/labels in the plain-text syllabus with localised equivalents */
function localiseSyllabus(text: string, language: string): string {
  if (language === "en") return text;

  type ReplacementMap = Record<string, string>;
  const zh: ReplacementMap = {
    "Learning Outcomes": "\u5b66\u4e60\u76ee\u6807",
    "Key Activities": "\u4e3b\u8981\u6d3b\u52a8",
    "Assessment": "\u8bc4\u4f30",
    "Teacher:": "\u6559\u5e08\uff1a",
    "School:": "\u5b66\u6821\uff1a",
    "Curriculum:": "\u8bfe\u7a0b\u5927\u7eb2\uff1a",
  };
  const hi: ReplacementMap = {
    "Learning Outcomes": "\u0938\u0940\u0916\u0928\u0947 \u0915\u0947 \u092a\u0930\u093f\u0923\u093e\u092e",
    "Key Activities": "\u092e\u0941\u0916\u094d\u092f \u0917\u0924\u093f\u0935\u093f\u0927\u093f\u092f\u093e\u0901",
    "Assessment": "\u092e\u0942\u0932\u094d\u092f\u093e\u0902\u0915\u0928",
    "Teacher:": "\u0936\u093f\u0915\u094d\u0937\u0915\uff1a",
    "School:": "\u0935\u093f\u0926\u094d\u092f\u093e\u0932\u092f\uff1a",
    "Curriculum:": "\u092a\u093e\u0920\u094d\u092f\u0915\u094d\u0930\u092e\uff1a",
  };
  const map = language === "zh" ? zh : language === "hi" ? hi : null;
  if (!map) return text;

  let result = text;
  for (const [en, localised] of Object.entries(map)) {
    result = result.replace(new RegExp(en, "g"), localised);
  }
  return result;
}

export function CourseCard({ course, performance, expanded, onToggle, language = "en" }: CourseCardProps) {
  const progressPercent = Math.round((course.currentWeek / course.totalWeeks) * 100);

  const weekLabel =
    language === "zh"
      ? `第 ${course.currentWeek} 周 / 共 ${course.totalWeeks} 周`
      : language === "hi"
      ? `सप्ताह ${course.currentWeek} / ${course.totalWeeks}`
      : `Week ${course.currentWeek} of ${course.totalWeeks}`;

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="cursor-pointer" onClick={onToggle}>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">
              {course.name}
              {course.syllabusCode && (
                <span className="ml-1.5 text-sm font-normal text-muted-foreground">
                  ({course.syllabusCode})
                </span>
              )}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {t("parent.course.teacher", language)}: {course.teacherName || "—"}
            </p>
          </div>
          <Badge variant="outline">
            {course.yearLevel}
          </Badge>
        </div>

        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{weekLabel}</span>
            <span>{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {performance && (
          <div className="pt-2">
            <Badge
              variant={
                performance.label.includes("extra attention")
                  ? "destructive"
                  : "secondary"
              }
              className="text-xs"
            >
              {performance.label}
            </Badge>
          </div>
        )}
      </CardHeader>

      {expanded && course.syllabusPlain && (
        <>
          <Separator />
          <CardContent className="pt-4">
            <h4 className="font-medium text-sm mb-2">{t("parent.course.overview", language)}</h4>
            <div className="text-sm text-muted-foreground whitespace-pre-line max-h-96 overflow-auto">
              {language === "zh"
                ? (course.syllabusPlain_zh || localiseSyllabus(course.syllabusPlain, "zh"))
                : language === "hi"
                ? (course.syllabusPlain_hi || localiseSyllabus(course.syllabusPlain, "hi"))
                : course.syllabusPlain}
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
}
