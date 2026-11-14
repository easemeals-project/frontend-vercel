"use client";

import React, { useState } from "react";
import { message } from "antd";

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ open, onClose }: FeedbackModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [satisfied, setSatisfied] = useState<"yes" | "no">("yes");
  const [suggestion, setSuggestion] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleClose = () => {
    localStorage.setItem("easemeals_feedback_shown", "true");
    setStep(1);
    onClose();
  };

  const handleNext = () => {
    setStep(2);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        satisfied: satisfied === "yes",
        suggestion: suggestion.trim(),
        submittedAt: new Date().toISOString(),
      };
      localStorage.setItem("easemeals_feedback_shown", "true");
      localStorage.setItem("easemeals_user_feedback", JSON.stringify(payload));
      await new Promise((r) => setTimeout(r, 300));
      message.success("Thank you for your feedback!");
      setStep(1);
      setSuggestion("");
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="bg-white rounded-3xl p-7 sm:p-8 w-full max-w-[480px] shadow-2xl relative">
        {/* Top Row: Step Indicator Bars + Close Button */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 pt-1">
            <span
              className={`w-7 h-1 rounded-full transition-colors ${
                step === 1 ? "bg-[#D84315]" : "bg-[#F5B7A1]"
              }`}
            />
            <span
              className={`w-7 h-1 rounded-full transition-colors ${
                step === 2 ? "bg-[#D84315]" : "bg-gray-200"
              }`}
            />
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close feedback modal"
            className="w-8 h-8 rounded-full bg-[#FAF8F5] hover:bg-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {step === 1 ? (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-2">
              Help us make EaseMeals better!
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mb-6">
              Are you satisfied with the meals generated for your timetable?
            </p>

            {/* Radio Options */}
            <div className="space-y-3 mb-6">
              <button
                type="button"
                onClick={() => setSatisfied("yes")}
                className={`w-full flex items-center gap-3.5 px-4 py-4 rounded-xl border text-left transition-all cursor-pointer ${
                  satisfied === "yes"
                    ? "bg-[#EEF7F0] border-[#2E7D32] text-[#1B5E20] font-semibold"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    satisfied === "yes"
                      ? "border-2 border-[#1B5E20]"
                      : "border border-gray-300"
                  }`}
                >
                  {satisfied === "yes" && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1B5E20]" />
                  )}
                </span>
                <span className="text-sm">Yes, I&apos;m satisfied.</span>
              </button>

              <button
                type="button"
                onClick={() => setSatisfied("no")}
                className={`w-full flex items-center gap-3.5 px-4 py-4 rounded-xl border text-left transition-all cursor-pointer ${
                  satisfied === "no"
                    ? "bg-[#EEF7F0] border-[#2E7D32] text-[#1B5E20] font-semibold"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    satisfied === "no"
                      ? "border-2 border-[#1B5E20]"
                      : "border border-gray-300"
                  }`}
                >
                  {satisfied === "no" && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1B5E20]" />
                  )}
                </span>
                <span className="text-sm">No, It can be better.</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="w-full py-3.5 rounded-xl bg-[#D84315] hover:bg-[#BF360C] text-white font-bold text-xs tracking-wider uppercase transition-all active:scale-[0.99] cursor-pointer"
            >
              NEXT
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-2">
              Make a suggestion
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mb-5">
              Is there something we can improve on? Anything?
            </p>

            <textarea
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              rows={5}
              className="w-full p-4 rounded-xl border border-gray-200 focus:border-[#2E7D32] outline-none resize-none text-sm text-[#1a1a1a] mb-6"
            />

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-[#D84315] hover:bg-[#BF360C] text-white font-bold text-xs tracking-wider uppercase transition-all active:scale-[0.99] disabled:opacity-70 cursor-pointer"
            >
              {submitting ? "SUBMITTING..." : "SUBMIT"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
