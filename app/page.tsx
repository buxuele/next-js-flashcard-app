"use client";

import { useCallback, useState } from "react";
import { ViewMode, DataSet } from "@/types";
import { useAppReducer, useKeyboardNavigation } from "@/hooks";
import { Header } from "@/components/Header";
import { QuoteCard } from "@/components/QuoteCard";
import { FileUploader } from "@/components/FileUploader";
import { ChevronLeft, ChevronRight } from "@/components/icons";

export default function Home() {
  const {
    state,
    dispatch,
    progress,
    reset,
    currentData,
    setDataSet,
    setCustomQuotes,
    hasCustomData,
    markAsMastered,
  } = useAppReducer();
  const { viewMode, revealedIds, currentIndex, dataSet } = state;
  const [showUploader, setShowUploader] = useState(false);

  const goToNext = useCallback(() => dispatch({ type: "NEXT" }), [dispatch]);
  const goToPrev = useCallback(() => dispatch({ type: "PREV" }), [dispatch]);

  useKeyboardNavigation({
    onNext: goToNext,
    onPrev: goToPrev,
    enabled: viewMode === ViewMode.FOCUS,
  });

  const handleReveal = useCallback(
    (id: number) => dispatch({ type: "REVEAL", id }),
    [dispatch]
  );
  const setViewMode = useCallback(
    (mode: ViewMode) => dispatch({ type: "SET_VIEW_MODE", mode }),
    [dispatch]
  );

  const handleDataSetChange = (ds: DataSet) => {
    if (ds === DataSet.CUSTOM && !hasCustomData) {
      setShowUploader(true);
    } else {
      setDataSet(ds);
    }
  };

  const showEmpty = currentData.length === 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        progress={progress}
        onReset={reset}
        currentDataSet={dataSet}
        onDataSetChange={handleDataSetChange}
        onUploadClick={() => setShowUploader(true)}
      />

      <main className="flex-1 overflow-y-auto bg-slate-900 pb-20 sm:pb-8">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {showUploader && (
            <div className="mb-8">
              <FileUploader
                onGenerated={(data) => {
                  setCustomQuotes(data);
                  setShowUploader(false);
                }}
              />
              <button
                onClick={() => setShowUploader(false)}
                className="mt-4 text-slate-500 text-sm hover:text-slate-300"
              >
                取消
              </button>
            </div>
          )}

          {showEmpty ? (
            <div className="text-center py-20">
              <p className="text-slate-500 mb-4">暂无数据</p>
              <button
                onClick={() => setShowUploader(true)}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
              >
                上传内容生成问答
              </button>
            </div>
          ) : viewMode === ViewMode.FEED ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentData.map((quote) => (
                <QuoteCard
                  key={quote.id}
                  quote={quote}
                  isRevealed={revealedIds.has(quote.id)}
                  onReveal={handleReveal}
                  onMastered={markAsMastered}
                />
              ))}
            </div>
          ) : currentData[currentIndex] ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
              <div className="w-full flex justify-center">
                <QuoteCard
                  key={`${dataSet}-${currentData[currentIndex].id}`}
                  quote={currentData[currentIndex]}
                  isRevealed={revealedIds.has(currentData[currentIndex].id)}
                  onReveal={handleReveal}
                  onMastered={markAsMastered}
                  isFocusMode
                />
              </div>
              <div className="flex items-center space-x-6">
                <button
                  onClick={goToPrev}
                  className="p-4 rounded-full bg-slate-800 shadow-md hover:shadow-lg text-indigo-400 transition-all active:scale-95 border border-slate-700"
                  aria-label="上一个"
                >
                  <ChevronLeft />
                </button>
                <div className="text-slate-500 font-bold text-sm">
                  {currentIndex + 1} / {currentData.length}
                </div>
                <button
                  onClick={goToNext}
                  className="p-4 rounded-full bg-slate-800 shadow-md hover:shadow-lg text-indigo-400 transition-all active:scale-95 border border-slate-700"
                  aria-label="下一个"
                >
                  <ChevronRight />
                </button>
              </div>
              <p className="text-slate-600 text-xs">使用 ← → 方向键切换</p>
            </div>
          ) : null}
        </div>
      </main>

      <footer className="fixed bottom-0 inset-x-0 p-4 flex justify-center pointer-events-none sm:hidden">
        <div className="bg-slate-800/90 backdrop-blur text-slate-200 px-6 py-3 rounded-full shadow-2xl flex items-center space-x-4 pointer-events-auto border border-slate-700">
          <span className="text-xs font-bold tracking-widest uppercase">
            已学习: {revealedIds.size}
          </span>
        </div>
      </footer>
    </div>
  );
}
