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

    const dataSets: DataSetInfo[] = [];

    for (const file of files) {
      try {
        const filePath = path.join(jsonDataDir, file);
        let fileContent = fs.readFileSync(filePath, "utf-8");

        // 清理可能的 markdown 代码块标记
        fileContent = fileContent.trim();
        if (
          fileContent.startsWith("```json") ||
          fileContent.startsWith("``json")
        ) {
          fileContent = fileContent.replace(/^```?json\s*\n?/i, "");
        }
        if (fileContent.endsWith("```")) {
          fileContent = fileContent.replace(/\n?```\s*$/, "");
        }

        const data: Quote[] = JSON.parse(fileContent);

        // 验证数据格式
        if (!Array.isArray(data) || data.length === 0) {
          console.warn(`Skipping ${file}: Invalid data format`);
          continue;
        }

        const nameWithoutExt = file
          .replace(/\.md\.json$/, "")
          .replace(/\.json$/, "");

        const nameMap: Record<string, string> = {
          quotes: "智慧名言",
          poems: "古诗词",
          example: "示例数据",
        };

        // 显示完整文件名，只对内置数据集做映射
        const displayName = nameMap[nameWithoutExt] || nameWithoutExt;

        // 自动分类
        let category = "其他";
        if (nameMap[nameWithoutExt]) {
          category = "内置数据集";
        } else if (nameWithoutExt.startsWith("读书笔记--")) {
          category = "读书笔记";
        } else if (nameWithoutExt.startsWith("读书笔记，重读")) {
          category = "重读系列";
        }

        dataSets.push({
          id: nameWithoutExt,
          name: displayName,
          fileName: file,
          category,
          data,
        });
      } catch (fileError) {
        console.error(`Error loading file ${file}:`, fileError);
        // 跳过有问题的文件，继续处理其他文件
        continue;
      }
    }

    return NextResponse.json({ dataSets });
  } catch (error) {
    console.error("Error loading datasets:", error);
    return NextResponse.json({
      dataSets: [],
      error: "Failed to load datasets",
    });
  }
}
