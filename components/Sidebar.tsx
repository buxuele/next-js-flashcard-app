"use client";

import { memo } from "react";
import { DataSetInfo } from "@/types";

interface SidebarProps {
  dataSets: DataSetInfo[];
  currentDataSetId: string;
  onSelect: (dataSetId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar = memo(function Sidebar({
  dataSets,
  currentDataSetId,
  onSelect,
  isOpen,
  onToggle,
}: SidebarProps) {
  return (
    <>
      {/* 移动端切换按钮 */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-20 left-4 z-50 p-2 bg-slate-800 rounded-lg shadow-lg border border-slate-700 text-indigo-400"
        aria-label="切换侧边栏"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* 侧边栏 */}
      <aside
        className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] bg-slate-800 border-r border-slate-700 transition-all duration-300 z-40 ${
          isOpen
            ? "translate-x-0 w-64"
            : "-translate-x-full lg:translate-x-0 lg:w-16"
        } flex flex-col`}
      >
        {/* 桌面端折叠/展开按钮 */}
        <button
          onClick={onToggle}
          className="hidden lg:flex absolute -right-3 top-6 w-6 h-6 bg-slate-700 hover:bg-slate-600 rounded-full items-center justify-center border border-slate-600 text-slate-300 hover:text-white transition-all z-50"
          aria-label={isOpen ? "折叠侧边栏" : "展开侧边栏"}
        >
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${
              isOpen ? "" : "rotate-180"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div
          className={`p-4 border-b border-slate-700 ${isOpen ? "" : "lg:p-2"}`}
        >
          {isOpen ? (
            <>
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                数据集
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                共 {dataSets.length} 个
              </p>
            </>
          ) : (
            <div className="hidden lg:flex justify-center">
              <svg
                className="w-6 h-6 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
          )}
        </div>

        <div className={`flex-1 overflow-y-auto ${isOpen ? "p-2" : "lg:p-1"}`}>
          {dataSets.length === 0 ? (
            <div
              className={`text-center py-8 text-slate-500 text-sm ${
                isOpen ? "" : "hidden"
              }`}
            >
              暂无数据集
            </div>
          ) : (
            <div className="space-y-1">
              {dataSets.map((dataSet) => (
                <button
                  key={dataSet.id}
                  onClick={() => {
                    onSelect(dataSet.id);
                    if (window.innerWidth < 1024) {
                      onToggle();
                    }
                  }}
                  className={`w-full text-left rounded-lg transition-all group relative ${
                    isOpen ? "px-3 py-2.5" : "lg:px-2 lg:py-2"
                  } ${
                    currentDataSetId === dataSet.id
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-slate-300 hover:bg-slate-700"
                  }`}
                  title={isOpen ? "" : dataSet.name}
                >
                  {isOpen ? (
                    <>
                      <div className="font-medium text-sm">{dataSet.name}</div>
                      <div className="text-xs opacity-75 mt-0.5">
                        {dataSet.data.length} 张卡片
                      </div>
                    </>
                  ) : (
                    <div className="hidden lg:flex justify-center">
                      <div className="w-8 h-8 flex items-center justify-center rounded bg-slate-700 group-hover:bg-slate-600 text-xs font-bold">
                        {dataSet.name.charAt(0)}
                      </div>
                    </div>
                  )}

                  {/* 折叠状态下的悬浮提示 */}
                  {!isOpen && (
                    <div className="hidden lg:block absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-slate-700 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                      <div className="font-medium">{dataSet.name}</div>
                      <div className="text-xs opacity-75">
                        {dataSet.data.length} 张卡片
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {isOpen && (
          <div className="p-4 border-t border-slate-700">
            <div className="text-xs text-slate-500">
              将 JSON 文件放入{" "}
              <code className="text-indigo-400">json_data</code>{" "}
              文件夹即可自动加载
            </div>
          </div>
        )}
      </aside>

      {/* 移动端遮罩 */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30 top-16"
          onClick={onToggle}
        />
      )}
    </>
  );
});
