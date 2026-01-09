"use client";

import { useCallback, useState, useEffect } from "react";
import { ViewMode, DataSetInfo } from "@/types";
import { useAppReducer, useKeyboardNavigation } from "@/hooks";
import { Header } from "@/components/Header";
import { QuoteCard } from "@/components/QuoteCard";
import { Sidebar } from "@/components/Sidebar";
import { EncouragementToast } from "@/components/EncouragementToast";
import { ChevronLeft, ChevronRight } from "@/components/icons";

export default function Home() {
  const [dataSets, setDataSets] = useState<DataSetInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true); // 默认展开
  const [encouragementTrigger, setEncouragementTrigger] = useState(0);

  // 加载数据集
  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("/api/datasets");
        const data = await response.json();
        setDataSets(data.dataSets || []);
      } catch (error) {
        console.error("Failed to load datasets:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const {
    state,
    dispatch,
    progress,
    reset,
    currentData,
    setDataSet,
    markAsMastered,
  } = useAppReducer(dataSets);
  const { viewMode, revealedIds, currentIndex, dataSetId } = state;

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

  const handleShowEncouragement = useCallback(() => {
    setEncouragementTrigger((prev) => prev + 1);
  }, []);

  const setViewMode = useCallback(
    (mode: ViewMode) => dispatch({ type: "SET_VIEW_MODE", mode }),
    [dispatch]
  );

  const showEmpty = currentData.length === 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-slate-400">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        progress={progress}
        onReset={reset}
      />

      {/* 鼓励动画 */}
      <EncouragementToast
        trigger={encouragementTrigger}
        onComplete={() => {}}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          dataSets={dataSets}
          currentDataSetId={dataSetId}
          onSelect={setDataSet}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 overflow-y-auto bg-slate-900 pb-20 sm:pb-8">
          <div className="max-w-5xl mx-auto px-4 py-8">
            {showEmpty ? (
              <div className="text-center py-20">
                <p className="text-slate-500 mb-4">
                  {dataSets.length === 0
                    ? "暂无数据集，请在 json_data 文件夹中添加 JSON 文件"
                    : "当前数据集为空"}
                </p>
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
                    onShowEncouragement={handleShowEncouragement}
                  />
                ))}
              </div>
            ) : currentData[currentIndex] ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
                <div className="w-full flex justify-center">
                  <QuoteCard
                    key={`${dataSetId}-${currentData[currentIndex].id}`}
                    quote={currentData[currentIndex]}
                    isRevealed={revealedIds.has(currentData[currentIndex].id)}
                    onReveal={handleReveal}
                    onMastered={markAsMastered}
                    onShowEncouragement={handleShowEncouragement}
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
      </div>

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
