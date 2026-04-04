"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FeedbackPromptProps {
  courseId: string;
  parentId: string;
  onDismiss: () => void;
}

type Step = "completion" | "difficulty" | "done";

export function FeedbackPrompt({ courseId, parentId, onDismiss }: FeedbackPromptProps) {
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
            Thank you for your feedback!
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
                ? "Quick Feedback"
                : "One more question"}
            </CardTitle>
            <Badge
              variant="outline"
              className="text-xs cursor-pointer hover:bg-accent"
              onClick={onDismiss}
            >
              Skip
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          {step === "completion" && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Did your child complete this week&apos;s learning activity?
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCompletion("Done")}
                  disabled={submitting}
                >
                  Done
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCompletion("Partially")}
                  disabled={submitting}
                >
                  Partially
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCompletion("Not yet")}
                  disabled={submitting}
                >
                  Not yet
                </Button>
              </div>
            </div>
          )}

          {step === "difficulty" && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                What did your child find most challenging?
              </p>
              <div className="flex flex-wrap gap-2">
                {["Fractions", "Word problems", "Reading comprehension", "Writing", "Other"].map(
                  (topic) => (
                    <Button
                      key={topic}
                      size="sm"
                      variant="outline"
                      onClick={() => handleDifficulty(topic)}
                      disabled={submitting}
                    >
                      {topic}
                    </Button>
                  )
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
