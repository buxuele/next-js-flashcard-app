"use client";

import { memo } from "react";
import { ViewMode } from "@/types";

interface HeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  progress: number;
  onReset: () => void;
}

export const Header = memo(function Header({
  viewMode,
  setViewMode,
  progress,
  onReset,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-slate-800/80 backdrop-blur-xl border-b border-slate-700">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <button
          onClick={onReset}
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer"
          aria-label="重置进度"
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            E
          </div>
          <h1 className="hidden sm:block text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            智慧回响
          </h1>
        </button>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <nav className="flex bg-slate-700 p-1 rounded-xl" role="tablist">
            <button
              role="tab"
              aria-selected={viewMode === ViewMode.FOCUS}
              onClick={() => setViewMode(ViewMode.FOCUS)}
              className={`px-3 sm:px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewMode === ViewMode.FOCUS
                  ? "bg-slate-600 shadow-sm text-indigo-400"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              专注
            </button>
            <button
              role="tab"
              aria-selected={viewMode === ViewMode.FEED}
              onClick={() => setViewMode(ViewMode.FEED)}
              className={`px-3 sm:px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewMode === ViewMode.FEED
                  ? "bg-slate-600 shadow-sm text-indigo-400"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              列表
            </button>
          </nav>

          <div className="hidden sm:flex items-center space-x-2">
            <div
              className="h-2 w-24 bg-slate-700 rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full bg-indigo-500 transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-slate-500">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>
    </header>
  );
});
