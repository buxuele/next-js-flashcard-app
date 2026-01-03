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

export enum DataSet {
  QUOTES = "quotes",
  POEMS = "poems",
  CUSTOM = "custom",
}

export interface DataSetInfo {
  id: DataSet;
  name: string;
  description: string;
}

export interface AppState {
  revealedIds: Set<number>;
  viewMode: ViewMode;
  currentIndex: number;
  dataSet: DataSet;
}

export type AppAction =
  | { type: "REVEAL"; id: number }
  | { type: "SET_VIEW_MODE"; mode: ViewMode }
  | { type: "SET_INDEX"; index: number }
  | { type: "SET_DATASET"; dataSet: DataSet }
  | { type: "SET_CUSTOM_DATA"; data: Quote[] }
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "RESET" }
  | { type: "LOAD_PROGRESS"; ids: number[]; dataSet?: DataSet };
