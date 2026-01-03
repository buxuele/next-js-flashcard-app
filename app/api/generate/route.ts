import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const { content, count = 10 } = await request.json();

    if (!content) {
      return NextResponse.json({ error: "内容不能为空" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY 未配置" },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    const prompt = `请根据以下内容，生成 ${count} 道问答题，用于帮助用户学习和记忆。

要求：
1. 问题应该考察内容中的关键知识点
2. 答案要简洁准确
3. 返回 JSON 数组格式，每个对象包含：question（问题）、answer（答案）、category（分类）
4. 只返回 JSON，不要其他文字

内容：
${content}

返回格式示例：
[
  {"question": "问题1", "answer": "答案1", "category": "分类1"},
  {"question": "问题2", "answer": "答案2", "category": "分类2"}
]`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // 提取 JSON
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "生成格式错误" }, { status: 500 });
    }

    const questions = JSON.parse(jsonMatch[0]);
    const data = questions.map(
      (
        q: { question: string; answer: string; category?: string },
        i: number
      ) => ({
        id: i + 1,
        question: q.question,
        answer: q.answer,
        author: null,
        category: q.category || "自定义",
      })
    );

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json({ error: "生成失败，请重试" }, { status: 500 });
  }
}
