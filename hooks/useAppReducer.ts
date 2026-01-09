"use client";

import {
  useReducer,
  useEffect,
  useMemo,
  useCallback,
  useState,
  useRef,
} from "react";
import { AppState, AppAction, ViewMode, Quote, DataSetInfo } from "@/types";
import { useLocalStorage } from "./useLocalStorage";

const initialState: AppState = {
  revealedIds: new Set(),
  viewMode: ViewMode.FOCUS,
  currentIndex: 0,
  dataSetId: "",
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

export function useAppReducer(dataSets: DataSetInfo[]) {
  const dataSetsRef = useRef<DataSetInfo[]>([]);
  dataSetsRef.current = dataSets;

  // 存储每个数据集的打乱顺序
  const [shuffledData, setShuffledData] = useState<Record<string, Quote[]>>({});

  // 存储已学会（删除）的卡片 ID
  const [masteredIds, setMasteredIds] = useLocalStorage<
    Record<string, number[]>
  >("mastered_wisdom", {});

  const [savedProgress, setSavedProgress, removeSavedProgress, isLoaded] =
    useLocalStorage<{
      ids: number[];
      dataSetId: string;
    }>("revealed_wisdom", { ids: [], dataSetId: "" });

  const appReducer = useCallback(
    (state: AppState, action: AppAction): AppState => {
      const getDataForSet = (dsId: string) => {
        const ds = dataSetsRef.current.find((d) => d.id === dsId);
        return ds?.data || [];
      };
      const currentData = getDataForSet(state.dataSetId);
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
            dataSetId: action.dataSetId,
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
          return { ...initialState, dataSetId: state.dataSetId };
        case "LOAD_PROGRESS":
          return {
            ...state,
            revealedIds: new Set(action.ids),
            dataSetId: action.dataSetId || state.dataSetId,
          };
        default:
          return state;
      }
    },
    []
  );

  const [state, dispatch] = useReducer(appReducer, initialState);

  // 初始化：设置第一个数据集
  useEffect(() => {
    if (dataSets.length > 0 && !state.dataSetId) {
      const defaultId = dataSets[0].id;
      dispatch({ type: "SET_DATASET", dataSetId: defaultId });
    }
  }, [dataSets, state.dataSetId]);

  useEffect(() => {
    if (!isLoaded || dataSets.length === 0) return;
    const validDataSetId =
      savedProgress.dataSetId &&
      dataSets.find((ds) => ds.id === savedProgress.dataSetId)
        ? savedProgress.dataSetId
        : dataSets[0]?.id || "";

    if (
      (savedProgress.ids && savedProgress.ids.length > 0) ||
      (validDataSetId && validDataSetId !== dataSets[0]?.id)
    ) {
      dispatch({
        type: "LOAD_PROGRESS",
        ids: savedProgress.ids || [],
        dataSetId: validDataSetId,
      });
    }
  }, [isLoaded, dataSets]);

  useEffect(() => {
    if (!isLoaded || !state.dataSetId) return;
    setSavedProgress({
      ids: Array.from(state.revealedIds),
      dataSetId: state.dataSetId,
    });
  }, [state.revealedIds, state.dataSetId, setSavedProgress, isLoaded]);

  // 当数据集变化时，生成打乱的顺序
  useEffect(() => {
    const dataSetKey = state.dataSetId;
    if (!dataSetKey || shuffledData[dataSetKey]) return;

    const ds = dataSets.find((d) => d.id === dataSetKey);
    if (!ds || ds.data.length === 0) return;

    setShuffledData((prev) => ({
      ...prev,
      [dataSetKey]: shuffleArray(ds.data),
    }));
  }, [state.dataSetId, dataSets, shuffledData]);

  const currentData = useMemo(() => {
    const dataSetKey = state.dataSetId;
    if (!dataSetKey) return [];

    let data: Quote[];
    // 优先返回打乱后的数据
    if (shuffledData[dataSetKey]) {
      data = shuffledData[dataSetKey];
    } else {
      const ds = dataSets.find((d) => d.id === dataSetKey);
      data = ds?.data || [];
    }
    // 过滤掉已学会的卡片
    const mastered = masteredIds[dataSetKey] || [];
    if (mastered.length > 0) {
      const masteredSet = new Set(mastered);
      data = data.filter((q) => !masteredSet.has(q.id));
    }
    return data;
  }, [state.dataSetId, dataSets, shuffledData, masteredIds]);

  const progress = useMemo(() => {
    if (!currentData || currentData.length === 0) return 0;
    return (state.revealedIds.size / currentData.length) * 100;
  }, [state.revealedIds, currentData]);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
    removeSavedProgress();
    // 重置时重新打乱当前数据集
    const dataSetKey = state.dataSetId;
    const ds = dataSets.find((d) => d.id === dataSetKey);
    if (ds && ds.data.length > 0) {
      setShuffledData((prev) => ({
        ...prev,
        [dataSetKey]: shuffleArray(ds.data),
      }));
    }
  }, [removeSavedProgress, state.dataSetId, dataSets]);

  const setDataSet = useCallback((dataSetId: string) => {
    dispatch({ type: "SET_DATASET", dataSetId });
  }, []);

  // 标记卡片为已学会
  const markAsMastered = useCallback(
    (id: number) => {
      const dataSetKey = state.dataSetId;
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
    [state.dataSetId, state.currentIndex, currentData.length, setMasteredIds]
  );

  return {
    state,
    dispatch,
    progress,
    reset,
    currentData,
    setDataSet,
    markAsMastered,
  };
}
