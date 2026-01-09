import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { DataSetInfo, Quote } from "@/types";

export async function GET() {
  try {
    const jsonDataDir = path.join(process.cwd(), "json_data");

    // 确保目录存在
    if (!fs.existsSync(jsonDataDir)) {
      return NextResponse.json({ dataSets: [] });
    }

    // 读取所有 JSON 文件
    const files = fs
      .readdirSync(jsonDataDir)
      .filter((file) => file.endsWith(".json"));

    const dataSets: DataSetInfo[] = files.map((file) => {
      const filePath = path.join(jsonDataDir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const data: Quote[] = JSON.parse(fileContent);

      const nameWithoutExt = file.replace(".json", "");
      const nameMap: Record<string, string> = {
        quotes: "智慧名言",
        poems: "古诗词",
      };

      return {
        id: nameWithoutExt,
        name: nameMap[nameWithoutExt] || nameWithoutExt,
        fileName: file,
        data,
      };
    });

    return NextResponse.json({ dataSets });
  } catch (error) {
    console.error("Error loading datasets:", error);
    return NextResponse.json({
      dataSets: [],
      error: "Failed to load datasets",
    });
  }
}
