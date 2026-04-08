"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Insight } from "@/lib/types";

interface InsightCardProps {
  insight: Insight;
  onDraftMessage?: (insight: Insight) => void;
}

const statusConfig = {
  NEW: { label: "New", className: "bg-blue-100 text-blue-800" },
  ACTIONED: { label: "Actioned", className: "bg-green-100 text-green-800" },
  DISMISSED: { label: "Dismissed", className: "bg-gray-100 text-gray-600" },
};

export function InsightCard({ insight, onDraftMessage }: InsightCardProps) {
  const status = statusConfig[insight.status] ?? statusConfig.NEW;

  return (
    <Card className="border-l-4 border-l-primary/60">
      <CardHeader className="pb-2 flex flex-row items-start justify-between gap-2">
        <Badge variant="secondary" className={`text-xs shrink-0 ${status.className}`}>
          {status.label}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {/* Data point */}
        <div className="space-y-0.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Data</p>
          <p className="text-foreground">{insight.dataPoint}</p>
        </div>

        {/* Therefore */}
        <div className="space-y-0.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Therefore</p>
          <p className="text-foreground">{insight.therefore}</p>
        </div>

        {/* Suggestion */}
        <div className="space-y-0.5">
          <p className="text-xs font-semibold text-primary uppercase tracking-wide">Suggestion</p>
          <p className="text-foreground">{insight.suggestion}</p>
        </div>

        {/* Action */}
        {insight.status === "NEW" && onDraftMessage && (
          <div className="pt-1">
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-7"
              onClick={() => onDraftMessage(insight)}
            >
              ✉ Draft parent message
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
