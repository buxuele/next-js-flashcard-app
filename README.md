# Echoes of Wisdom - 智慧回响

一个基于 Next.js 的闪卡学习应用，支持问答卡片浏览、AI 生成问答内容。

## 功能特性

- 📚 内置诗词和名言数据集
- 🤖 支持上传文本，使用 Gemini AI 自动生成问答卡片
- 🎯 两种浏览模式：信息流模式 / 专注模式
- ⌨️ 键盘快捷键支持（← → 切换卡片）
- 💾 学习进度本地存储
- 🗑️ 支持删除已掌握的卡片

## 本地运行

**前置条件:** Node.js

1. 安装依赖：

   ```bash
   npm install
   ```

2. 在 `.env.local` 中设置 `GEMINI_API_KEY` 为你的 Gemini API 密钥

3. 启动开发服务器：
   ```bash
   npm run dev
   ```

## 技术栈

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Google Generative AI (Gemini)
