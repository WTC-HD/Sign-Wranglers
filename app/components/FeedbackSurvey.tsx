"use client";
import { useEffect, useState } from "react";

const STORAGE_KEY = "signWranglersFeedback";

export default function FeedbackSurvey() {
  // Defaults to true so a returning visitor never sees the prompt flash
  // on screen before the localStorage check below finishes.
  const [alreadyAnswered, setAlreadyAnswered] = useState(true);
  const [feedbackResponse, setFeedbackResponse] = useState<"yes" | "no" | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading localStorage on mount is a documented valid use of useEffect
    setAlreadyAnswered(stored === "yes" || stored === "no");
  }, []);

  function respond(response: "yes" | "no") {
    setFeedbackResponse(response);
    localStorage.setItem(STORAGE_KEY, response);

    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: response === "yes" ? "feedback_yes" : "feedback_no",
      }),
    }).catch(() => {});
  }

  if (alreadyAnswered && feedbackResponse === null) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-10 w-full border-t-[3px] border-black bg-brand-primary py-2 text-center">
      {feedbackResponse === null ? (
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4">
          <p className="text-xs text-brand-accent">
            Did this website provide a service or information that you
            wouldn&apos;t have otherwise gotten?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => respond("yes")}
              className="pixel-btn bg-surface px-3 py-1 text-xs text-brand-accent hover:bg-brand-primary-hover"
            >
              Yes
            </button>
            <button
              onClick={() => respond("no")}
              className="pixel-btn bg-surface px-3 py-1 text-xs text-brand-accent hover:bg-brand-primary-hover"
            >
              No
            </button>
          </div>
        </div>
      ) : (
        <p className="text-xs text-brand-accent">
          Thanks for letting us know!
        </p>
      )}
    </div>
  );
}
