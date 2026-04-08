"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Insight } from "@/lib/types";

interface MessageComposerProps {
  insight: Insight | null;
  courseId: string;
  courseName: string;
  onClose: () => void;
}

type Stage = "loading" | "editing" | "publishing" | "done" | "error";

export function MessageComposer({ insight, courseId, courseName, onClose }: MessageComposerProps) {
  const [draft, setDraft] = useState("");
  const [stage, setStage] = useState<Stage>("loading");

  // Fetch draft when insight changes
  useEffect(() => {
    if (!insight) return;
    setStage("loading");
    setDraft("");

    fetch("/api/messages/draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ insight, courseName }),
    })
      .then((r) => r.json())
      .then((data) => {
        setDraft(data.draft ?? "");
        setStage("editing");
      })
      .catch(() => setStage("error"));
  }, [insight, courseName]);

  async function handlePublish() {
    setStage("publishing");
    try {
      await fetch("/api/messages/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, content: draft }),
      });
      setStage("done");
    } catch {
      setStage("error");
    }
  }

  function handleClose() {
    setDraft("");
    setStage("loading");
    onClose();
  }

  return (
    <Dialog open={!!insight} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent className="sm:max-w-lg" showCloseButton>
        <DialogHeader>
          <DialogTitle>Draft Parent Message</DialogTitle>
        </DialogHeader>

        {stage === "loading" && (
          <div className="py-8 text-center text-sm text-muted-foreground animate-pulse">
            Generating draft…
          </div>
        )}

        {stage === "error" && (
          <div className="py-4 text-sm text-destructive">
            Failed to generate draft. Please try again.
          </div>
        )}

        {(stage === "editing" || stage === "publishing") && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              AI-generated draft — review and edit before publishing.
            </p>
            <textarea
              className="w-full min-h-[180px] rounded-md border bg-background px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              disabled={stage === "publishing"}
            />
          </div>
        )}

        {stage === "done" && (
          <div className="py-6 text-center space-y-1">
            <p className="text-sm font-medium text-green-700">Message published!</p>
            <p className="text-xs text-muted-foreground">
              Parents can now see this update on their Dashboard.
            </p>
          </div>
        )}

        <DialogFooter showCloseButton={stage === "done"}>
          {(stage === "editing" || stage === "publishing") && (
            <>
              <Button variant="outline" onClick={handleClose} disabled={stage === "publishing"}>
                Cancel
              </Button>
              <Button onClick={handlePublish} disabled={!draft.trim() || stage === "publishing"}>
                {stage === "publishing" ? "Publishing…" : "Publish to parents"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
