import { Quote, DataSet, DataSetInfo } from "./types";
import quotesJson from "./data/quotes.json";
import poemsJson from "./data/poems.json";

export const QUOTES_DATA: Quote[] = quotesJson;
export const POEMS_DATA: Quote[] = poemsJson;

export const DATA_SETS: Record<DataSet, Quote[]> = {
  [DataSet.QUOTES]: QUOTES_DATA,
  [DataSet.POEMS]: POEMS_DATA,
  [DataSet.CUSTOM]: [],
};

export const DATA_SET_INFO: DataSetInfo[] = [
  { id: DataSet.QUOTES, name: "智慧名言", description: "励志名言警句" },
  { id: DataSet.POEMS, name: "古诗词", description: "中华经典诗词名句" },
  { id: DataSet.CUSTOM, name: "自定义", description: "AI 生成的问答" },
];
