"use client";

import { memo, useState, useMemo } from "react";
import { DataSetInfo } from "@/types";

interface SidebarProps {
  dataSets: DataSetInfo[];
  currentDataSetId: string;
  onSelect: (dataSetId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  内置数据集: "📚",
  读书笔记: "📖",
  重读系列: "🔄",
  其他: "📁",
};

export const Sidebar = memo(function Sidebar({
  dataSets,
  currentDataSetId,
  onSelect,
  isOpen,
  onToggle,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(
    new Set()
  );

  const groupedDataSets = useMemo(() => {
    const groups: Record<string, DataSetInfo[]> = {};

    dataSets.forEach((dataSet) => {
      const category = dataSet.category || "其他";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(dataSet);
    });

    const sortedGroups: Record<string, DataSetInfo[]> = {};
    const order = ["内置数据集", "读书笔记", "重读系列", "其他"];

    order.forEach((cat) => {
      if (groups[cat]) {
        sortedGroups[cat] = groups[cat].sort((a, b) =>
          a.name.localeCompare(b.name, "zh-CN")
        );
      }
    });

    return sortedGroups;
  }, [dataSets]);

  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return groupedDataSets;

    const query = searchQuery.toLowerCase();
    const filtered: Record<string, DataSetInfo[]> = {};

    Object.entries(groupedDataSets).forEach(([category, datasets]) => {
      const matchedDatasets = datasets.filter((ds) =>
        ds.name.toLowerCase().includes(query)
      );
      if (matchedDatasets.length > 0) {
        filtered[category] = matchedDatasets;
      }
    });

    return filtered;
  }, [groupedDataSets, searchQuery]);

  const toggleCategory = (category: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const totalCount = dataSets.length;
  const filteredCount = Object.values(filteredGroups).reduce(
    (sum, datasets) => sum + datasets.length,
    0
  );

  return (
    <>
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

      <aside
        className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] bg-slate-800 border-r border-slate-700 transition-all duration-300 z-40 ${
          isOpen
            ? "translate-x-0 w-64"
            : "-translate-x-full lg:translate-x-0 lg:w-16"
        } flex flex-col`}
      >
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
                {searchQuery
                  ? `找到 ${filteredCount} 个`
                  : `共 ${totalCount} 个`}
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

        {isOpen && (
          <div className="p-3 border-b border-slate-700">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索数据集..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 pl-9 bg-slate-700 text-slate-200 text-sm rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-500"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        <div className={`flex-1 overflow-y-auto ${isOpen ? "p-2" : "lg:p-1"}`}>
          {dataSets.length === 0 ? (
            <div
              className={`text-center py-8 text-slate-500 text-sm ${
                isOpen ? "" : "hidden"
              }`}
            >
              暂无数据集
            </div>
          ) : isOpen ? (
            <div className="space-y-3">
              {Object.entries(filteredGroups).map(([category, datasets]) => (
                <div key={category}>
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <span>{CATEGORY_ICONS[category] || "📁"}</span>
                      <span>{category}</span>
                      <span className="text-slate-600">
                        ({datasets.length})
                      </span>
                    </span>
                    <svg
                      className={`w-3 h-3 transition-transform ${
                        collapsedCategories.has(category) ? "-rotate-90" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {!collapsedCategories.has(category) && (
                    <div className="space-y-1 mt-1">
                      {datasets.map((dataSet) => (
                        <button
                          key={dataSet.id}
                          onClick={() => {
                            onSelect(dataSet.id);
                            if (window.innerWidth < 1024) {
                              onToggle();
                            }
                          }}
                          className={`w-full text-left px-3 py-2.5 rounded-lg transition-all ${
                            currentDataSetId === dataSet.id
                              ? "bg-indigo-600 text-white shadow-md"
                              : "text-slate-300 hover:bg-slate-700"
                          }`}
                        >
                          <div className="font-medium text-sm truncate">
                            {dataSet.name}
                          </div>
                          <div className="text-xs opacity-75 mt-0.5">
                            {dataSet.data.length} 张卡片
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {filteredCount === 0 && searchQuery && (
                <div className="text-center py-8 text-slate-500 text-sm">
                  未找到匹配的数据集
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              {dataSets.map((dataSet) => (
                <button
                  key={dataSet.id}
                  onClick={() => onSelect(dataSet.id)}
                  className={`w-full rounded-lg transition-all group relative lg:px-2 lg:py-2 ${
                    currentDataSetId === dataSet.id
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-slate-300 hover:bg-slate-700"
                  }`}
                  title={dataSet.name}
                >
                  <div className="hidden lg:flex justify-center">
                    <div className="w-8 h-8 flex items-center justify-center rounded bg-slate-700 group-hover:bg-slate-600 text-xs font-bold">
                      {dataSet.name.charAt(0)}
                    </div>
                  </div>

                  <div className="hidden lg:block absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-slate-700 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    <div className="font-medium">{dataSet.name}</div>
                    <div className="text-xs opacity-75">
                      {dataSet.data.length} 张卡片
                    </div>
                  </div>
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

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30 top-16"
          onClick={onToggle}
        />
      )}
    </>
  );
});
