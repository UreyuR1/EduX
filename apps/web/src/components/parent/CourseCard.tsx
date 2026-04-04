"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import type { Course, PerformanceNote } from "@/lib/types";

interface CourseCardProps {
  course: Course;
  performance?: PerformanceNote;
  expanded?: boolean;
  onToggle?: () => void;
}

export function CourseCard({ course, performance, expanded, onToggle }: CourseCardProps) {
  const progressPercent = Math.round((course.currentWeek / course.totalWeeks) * 100);

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="cursor-pointer" onClick={onToggle}>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{course.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Teacher: {course.teacherName || "—"}
            </p>
          </div>
          <Badge variant="outline">
            {course.yearLevel}
          </Badge>
        </div>

        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Week {course.currentWeek} of {course.totalWeeks}</span>
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
            <h4 className="font-medium text-sm mb-2">Course Overview</h4>
            <div className="text-sm text-muted-foreground whitespace-pre-line max-h-64 overflow-auto">
              {course.syllabusPlain.slice(0, 1500)}
              {course.syllabusPlain.length > 1500 && "..."}
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
}
