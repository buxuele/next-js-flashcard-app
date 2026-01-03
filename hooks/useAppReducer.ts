"use client";

import {
  useReducer,
  useEffect,
  useMemo,
  useCallback,
  useState,
  useRef,
} from "react";
import { AppState, AppAction, ViewMode, DataSet, Quote } from "@/types";
import { useLocalStorage } from "./useLocalStorage";
import { DATA_SETS } from "@/constants";

const initialState: AppState = {
  revealedIds: new Set(),
  viewMode: ViewMode.FOCUS,
  currentIndex: 0,
  dataSet: DataSet.QUOTES,
};

// Fisher-Yates 洗牌算法
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function useAppReducer() {
  const [customData, setCustomData] = useState<Quote[]>([]);
  const customDataRef = useRef<Quote[]>([]);
  customDataRef.current = customData;

  // 存储每个数据集的打乱顺序
  const [shuffledData, setShuffledData] = useState<Record<string, Quote[]>>({});

  // 存储已学会（删除）的卡片 ID
  const [masteredIds, setMasteredIds] = useLocalStorage<
    Record<string, number[]>
  >("mastered_wisdom", {});

  const [savedProgress, setSavedProgress, removeSavedProgress, isLoaded] =
    useLocalStorage<{
      ids: number[];
      dataSet: DataSet;
    }>("revealed_wisdom", { ids: [], dataSet: DataSet.QUOTES });

  const appReducer = useCallback(
    (state: AppState, action: AppAction): AppState => {
      const getDataForSet = (ds: DataSet) => {
        if (ds === DataSet.CUSTOM) return customDataRef.current;
        return DATA_SETS[ds] || DATA_SETS[DataSet.QUOTES];
      };
      const currentData = getDataForSet(state.dataSet);
      const len = currentData.length || 1;

      switch (action.type) {
        case "REVEAL":
          return {
            ...state,
            revealedIds: new Set([...state.revealedIds, action.id]),
          };
        case "SET_VIEW_MODE":
          return { ...state, viewMode: action.mode };
        case "SET_INDEX":
          return { ...state, currentIndex: action.index };
        case "SET_DATASET":
          return {
            ...state,
            dataSet: action.dataSet,
            currentIndex: 0,
            revealedIds: new Set(),
          };
        case "SET_CUSTOM_DATA":
          return {
            ...state,
            dataSet: DataSet.CUSTOM,
            currentIndex: 0,
            revealedIds: new Set(),
          };
        case "NEXT":
          return { ...state, currentIndex: (state.currentIndex + 1) % len };
        case "PREV":
          return {
            ...state,
            currentIndex: (state.currentIndex - 1 + len) % len,
          };
        case "RESET":
          return { ...initialState, dataSet: state.dataSet };
        case "LOAD_PROGRESS":
          return {
            ...state,
            revealedIds: new Set(action.ids),
            dataSet: action.dataSet || state.dataSet,
          };
        default:
          return state;
      }
    },
    []
  );

  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    if (!isLoaded) return;
    const validDataSet =
      savedProgress.dataSet &&
      (DATA_SETS[savedProgress.dataSet] ||
        savedProgress.dataSet === DataSet.CUSTOM)
        ? savedProgress.dataSet
        : DataSet.QUOTES;

    // 如果是 CUSTOM 但没有数据，回退到 QUOTES
    if (validDataSet === DataSet.CUSTOM && customData.length === 0) {
      return;
    }

    if (
      (savedProgress.ids && savedProgress.ids.length > 0) ||
      validDataSet !== DataSet.QUOTES
    ) {
      dispatch({
        type: "LOAD_PROGRESS",
        ids: savedProgress.ids || [],
        dataSet: validDataSet,
      });
    }
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    // 不保存 CUSTOM 数据集到 localStorage（因为数据本身没保存）
    if (state.dataSet === DataSet.CUSTOM && customData.length === 0) return;
    setSavedProgress({
      ids: Array.from(state.revealedIds),
      dataSet: state.dataSet,
    });
  }, [
    state.revealedIds,
    state.dataSet,
    setSavedProgress,
    isLoaded,
    customData.length,
  ]);

  // 当数据集变化时，生成打乱的顺序
  useEffect(() => {
    const dataSetKey = state.dataSet;
    if (shuffledData[dataSetKey]) return; // 已经打乱过了

    let sourceData: Quote[];
    if (dataSetKey === DataSet.CUSTOM) {
      if (customData.length === 0) return;
      sourceData = customData;
    } else {
      sourceData = DATA_SETS[dataSetKey] || DATA_SETS[DataSet.QUOTES];
    }

    setShuffledData((prev) => ({
      ...prev,
      [dataSetKey]: shuffleArray(sourceData),
    }));
  }, [state.dataSet, customData, shuffledData]);

  const currentData = useMemo(() => {
    const dataSetKey = state.dataSet;
    let data: Quote[];
    // 优先返回打乱后的数据
    if (shuffledData[dataSetKey]) {
      data = shuffledData[dataSetKey];
    } else if (dataSetKey === DataSet.CUSTOM) {
      data = customData;
    } else {
      data = DATA_SETS[dataSetKey] || DATA_SETS[DataSet.QUOTES];
    }
    // 过滤掉已学会的卡片
    const mastered = masteredIds[dataSetKey] || [];
    if (mastered.length > 0) {
      const masteredSet = new Set(mastered);
      data = data.filter((q) => !masteredSet.has(q.id));
    }
    return data;
  }, [state.dataSet, customData, shuffledData, masteredIds]);

  const progress = useMemo(() => {
    if (!currentData || currentData.length === 0) return 0;
    return (state.revealedIds.size / currentData.length) * 100;
  }, [state.revealedIds, currentData]);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
    removeSavedProgress();
    // 重置时重新打乱当前数据集
    const dataSetKey = state.dataSet;
    let sourceData: Quote[];
    if (dataSetKey === DataSet.CUSTOM) {
      sourceData = customData;
    } else {
      sourceData = DATA_SETS[dataSetKey] || DATA_SETS[DataSet.QUOTES];
    }
    setShuffledData((prev) => ({
      ...prev,
      [dataSetKey]: shuffleArray(sourceData),
    }));
  }, [removeSavedProgress, state.dataSet, customData]);

  const setDataSet = useCallback((dataSet: DataSet) => {
    dispatch({ type: "SET_DATASET", dataSet });
  }, []);

  const setCustomQuotes = useCallback((data: Quote[]) => {
    setCustomData(data);
    // 打乱自定义数据
    setShuffledData((prev) => ({
      ...prev,
      [DataSet.CUSTOM]: shuffleArray(data),
    }));
    // 延迟 dispatch，确保 ref 已更新
    setTimeout(() => dispatch({ type: "SET_CUSTOM_DATA", data }), 0);
  }, []);

  // 标记卡片为已学会
  const markAsMastered = useCallback(
    (id: number) => {
      const dataSetKey = state.dataSet;
      setMasteredIds((prev) => ({
        ...prev,
        [dataSetKey]: [...(prev[dataSetKey] || []), id],
      }));
      // 如果当前索引超出范围，调整
      if (
        state.currentIndex >= currentData.length - 1 &&
        state.currentIndex > 0
      ) {
        dispatch({ type: "SET_INDEX", index: state.currentIndex - 1 });
      }
    },
    [state.dataSet, state.currentIndex, currentData.length, setMasteredIds]
  );

  return {
    state,
    dispatch,
    progress,
    reset,
    currentData,
    setDataSet,
    setCustomQuotes,
    hasCustomData: customData.length > 0,
    markAsMastered,
  };
}
