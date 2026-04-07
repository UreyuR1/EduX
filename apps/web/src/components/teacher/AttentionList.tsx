"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { StudentAttention } from "@/lib/types";

interface AttentionListProps {
  students: StudentAttention[];
}

export function AttentionList({ students }: AttentionListProps) {
  if (students.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Students Who May Benefit from Extra Support</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">All students are progressing well this week.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Students Who May Benefit from Extra Support</CardTitle>
        <p className="text-xs text-muted-foreground">Based on parent feedback and homework completion patterns</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {students.map((student) => {
          const initials = student.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2);

          return (
            <div key={student.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="text-xs bg-amber-100 text-amber-800">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{student.name}</p>
                <div className="flex flex-col gap-1 mt-1">
                  {student.flags.map((flag) => {
                    const isConcernFlag = flag === "Multiple parent concerns reported";
                    const label = isConcernFlag ? "May benefit from extra attention" : flag;
                    const details = isConcernFlag ? student.concerns : [];
                    return (
                      <div key={flag}>
                        <Badge
                          variant="secondary"
                          className="text-xs bg-amber-50 text-amber-700 border-amber-200 whitespace-normal h-auto py-0.5"
                        >
                          {details.length > 0
                            ? `${label}: ${details.map((d) => `'${d}'`).join(", ")}`
                            : label}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
