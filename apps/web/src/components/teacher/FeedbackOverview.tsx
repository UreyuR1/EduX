"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { FeedbackAggregate } from "@/lib/types";

interface FeedbackOverviewProps {
  aggregate: FeedbackAggregate | null;
}

export function FeedbackOverview({ aggregate }: FeedbackOverviewProps) {
  if (!aggregate) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Parent Feedback Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No feedback data yet.</p>
        </CardContent>
      </Card>
    );
  }

  const completionPct = Math.round(aggregate.completionRate * 100);
  const { positive, neutral, negative } = aggregate.sentimentDistribution;
  const total = positive + neutral + negative;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Parent Feedback Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Homework completion */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Homework completion</span>
            <span className="font-semibold">{completionPct}%</span>
          </div>
          <Progress value={completionPct} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Based on parent feedback responses this week
          </p>
        </div>

        {/* Sentiment */}
        {total > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Overall sentiment</p>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                😊 Positive: {positive}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                😐 Neutral: {neutral}
              </Badge>
              {negative > 0 && (
                <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800">
                  😟 Needs support: {negative}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Top difficulty tags */}
        {aggregate.topTags.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Common difficulty topics (from negative/neutral feedback)</p>
            <div className="space-y-1.5">
              {aggregate.topTags.slice(0, 5).map(({ tag, count }) => {
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={tag} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="capitalize">{tag}</span>
                      <span className="text-muted-foreground">{count} parents ({pct}%)</span>
                    </div>
                    <Progress value={pct} className="h-1.5" />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
