"use client";

import { memo } from "react";
import { DataSet } from "@/types";
import { DATA_SET_INFO } from "@/constants";

interface DataSetSelectorProps {
  currentDataSet: DataSet;
  onSelect: (dataSet: DataSet) => void;
}

export const DataSetSelector = memo(function DataSetSelector({
  currentDataSet,
  onSelect,
}: DataSetSelectorProps) {
  return (
    <select
      value={currentDataSet}
      onChange={(e) => onSelect(e.target.value as DataSet)}
      className="bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      {DATA_SET_INFO.map((info) => (
        <option key={info.id} value={info.id}>
          {info.name}
        </option>
      ))}
    </select>
  );
});
