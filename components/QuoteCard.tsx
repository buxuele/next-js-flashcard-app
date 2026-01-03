"use client";

import { memo } from "react";
import { Quote } from "@/types";

interface QuoteCardProps {
  quote: Quote | undefined;
  isRevealed: boolean;
  onReveal: (id: number) => void;
  onMastered?: (id: number) => void;
  isFocusMode?: boolean;
}

export const QuoteCard = memo(function QuoteCard({
  quote,
  isRevealed,
  onReveal,
  onMastered,
  isFocusMode,
}: QuoteCardProps) {
  if (!quote) {
    return (
      <div
        className={`bg-slate-800 p-6 rounded-2xl border border-slate-700 text-slate-500 text-center ${
          isFocusMode ? "w-full max-w-2xl p-10" : ""
        }`}
      >
        暂无数据
      </div>
    );
  }

  const handleReveal = () => {
    if (!isRevealed) {
      onReveal(quote.id);
    }
  };

  return (
    <div
      onClick={handleReveal}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleReveal()}
      aria-label={isRevealed ? "已揭示答案" : "点击揭示答案"}
      className={`group relative overflow-hidden transition-all duration-500 ease-out cursor-pointer
        ${
          isFocusMode
            ? "w-full max-w-2xl bg-slate-800/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-slate-700"
            : "bg-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-lg border border-slate-700"
        }`}
    >
      <div className="flex flex-col space-y-4">
        <div className="text-indigo-500/30 text-4xl font-serif select-none">
          "
        </div>
        <div
          className={`font-serif leading-relaxed text-slate-200 ${
            isFocusMode ? "text-3xl" : "text-xl"
          }`}
        >
          {quote.question}
        </div>
        <div className="relative pt-2">
          <div
            className={`transition-all duration-700 ease-in-out font-serif italic text-indigo-400 leading-relaxed
            ${
              isRevealed
                ? "opacity-100 translate-y-0 filter-none"
                : "opacity-40 blur-md select-none translate-y-2"
            }
            ${isFocusMode ? "text-3xl" : "text-xl"}`}
          >
            {quote.answer}
          </div>
        </div>
        <div
          className={`pt-4 flex items-center justify-between ${
            isRevealed ? "opacity-100" : "opacity-0"
          } transition-opacity duration-500`}
        >
          <div className="text-slate-500 text-sm font-medium">
            — {quote.author || "佚名"}
          </div>
          {onMastered && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMastered(quote.id);
              }}
              className="px-3 py-1 text-xs font-medium text-green-400 bg-green-900/30 rounded-lg hover:bg-green-900/50 transition"
              aria-label="已学会，删除此卡片"
            >
              ✓ 已学会
            </button>
          )}
        </div>
      </div>
    </div>
  );
});
