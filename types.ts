export interface Quote {
  id: number;
  question: string;
  answer: string;
  author: string | null;
  category?: string;
}

export enum ViewMode {
  FEED = "FEED",
  FOCUS = "FOCUS",
}

export interface DataSetInfo {
  id: string;
  name: string;
  fileName: string;
  data: Quote[];
}

export interface AppState {
  revealedIds: Set<number>;
  viewMode: ViewMode;
  currentIndex: number;
  dataSetId: string;
}

export type AppAction =
  | { type: "REVEAL"; id: number }
  | { type: "SET_VIEW_MODE"; mode: ViewMode }
  | { type: "SET_INDEX"; index: number }
  | { type: "SET_DATASET"; dataSetId: string }
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "RESET" }
  | { type: "LOAD_PROGRESS"; ids: number[]; dataSetId?: string };
