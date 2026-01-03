"use client";

import { useState, useRef } from "react";
import { Quote } from "@/types";

interface FileUploaderProps {
  onGenerated: (data: Quote[]) => void;
}

export function FileUploader({ onGenerated }: FileUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const content = await file.text();
    setText(content);
  };

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError("请输入或上传内容");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text, count: 10 }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      onGenerated(json.data);
      setText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
      <h3 className="text-lg font-bold text-slate-200 mb-4">
        📚 从内容生成问答卡片
      </h3>

      <div className="space-y-4">
        <div>
          <input
            ref={fileRef}
            type="file"
            accept=".txt,.md,.json"
            onChange={handleFile}
            className="hidden"
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm hover:bg-slate-600 transition"
          >
            上传文件 (.txt, .md)
          </button>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="或直接粘贴学习内容..."
          className="w-full h-40 bg-slate-900 text-slate-300 rounded-lg p-4 text-sm border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          onClick={handleGenerate}
          disabled={loading || !text.trim()}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "生成中..." : "✨ 生成问答卡片"}
        </button>
      </div>
    </div>
  );
}
