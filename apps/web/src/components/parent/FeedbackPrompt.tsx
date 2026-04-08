"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { t } from "@/lib/i18n";

interface FeedbackPromptProps {
  courseId: string;
  parentId: string;
  onDismiss: () => void;
  language?: string;
}

type Step = "completion" | "difficulty" | "done";

// Difficulty topics: value is always English (stored in DB), label is translated for display
const DIFFICULTY_TOPICS = [
  { value: "Fractions",             key: "parent.feedback.fractions" },
  { value: "Word problems",         key: "parent.feedback.wordProblems" },
  { value: "Reading comprehension", key: "parent.feedback.readingComprehension" },
  { value: "Writing",               key: "parent.feedback.writing" },
  { value: "Other",                 key: "parent.feedback.other" },
];

export function FeedbackPrompt({ courseId, parentId, onDismiss, language = "en" }: FeedbackPromptProps) {
  const [step, setStep] = useState<Step>("completion");
  const [submitting, setSubmitting] = useState(false);

  const submitFeedback = async (type: string, value: string) => {
    setSubmitting(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, value, courseId, parentId }),
      });
    } catch (err) {
      console.error("Feedback submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompletion = async (value: string) => {
    await submitFeedback("completion", value);
    setStep("difficulty");
  };

  const handleDifficulty = async (value: string) => {
    await submitFeedback("difficulty", value);
    setStep("done");
    setTimeout(onDismiss, 1500);
  };

  if (step === "done") {
    return (
      <div className="mx-4 mb-2">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="py-3 text-center text-sm text-green-700">
            {t("parent.feedback.thanks", language)}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-4 mb-2">
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-2 pt-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              {step === "completion"
                ? t("parent.feedback.title1", language)
                : t("parent.feedback.title2", language)}
            </CardTitle>
            <Badge
              variant="outline"
              className="text-xs cursor-pointer hover:bg-accent"
              onClick={onDismiss}
            >
              {t("parent.feedback.skip", language)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          {step === "completion" && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {t("parent.feedback.completion", language)}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCompletion("Done")}
                  disabled={submitting}
                >
                  {t("parent.feedback.done", language)}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCompletion("Partially")}
                  disabled={submitting}
                >
                  {t("parent.feedback.partially", language)}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCompletion("Not yet")}
                  disabled={submitting}
                >
                  {t("parent.feedback.notYet", language)}
                </Button>
              </div>
            </div>
          )}

          {step === "difficulty" && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {t("parent.feedback.difficulty", language)}
              </p>
              <div className="flex flex-wrap gap-2">
                {DIFFICULTY_TOPICS.map(({ value, key }) => (
                  <Button
                    key={value}
                    size="sm"
                    variant="outline"
                    onClick={() => handleDifficulty(value)}
                    disabled={submitting}
                  >
                    {t(key, language)}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
