# Echoes of Wisdom - 智慧回响

一个基于 Next.js 的闪卡学习应用，支持问答卡片浏览和动态数据集加载。

## 功能特性

- 📚 动态加载数据集（支持无限扩展）
- 🎯 两种浏览模式：信息流模式 / 专注模式
- ⌨️ 键盘快捷键支持（← → 切换卡片）
- 💾 学习进度本地存储
- 🗑️ 支持删除已掌握的卡片
- 📱 响应式设计，支持移动端
- 🎲 自动随机打乱卡片顺序

## 如何添加新的数据集

只需在 `json_data` 文件夹中添加 JSON 文件即可！

### JSON 文件格式

```json
[
  {
    "id": 1,
    "question": "问题内容",
    "answer": "答案内容",
    "author": "作者名（可选）",
    "category": "分类（可选）"
  },
  {
    "id": 2,
    "question": "另一个问题",
    "answer": "另一个答案",
    "author": null,
    "category": "分类"
  }
]
```

### 示例

1. 创建文件 `json_data/history.json`
2. 添加历史知识问答内容
3. 刷新页面，新数据集会自动出现在左侧边栏

## 本地运行

**前置条件:** Node.js

1. 安装依赖：

   ```bash
   npm install
   ```

2. 启动开发服务器：

   ```bash
   npm run dev
   ```

3. 打开浏览器访问 `http://localhost:3000`

## 技术栈

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS

## 项目结构

```
├── app/
│   ├── api/datasets/      # 数据集加载 API
│   ├── page.tsx           # 主页面
│   └── layout.tsx         # 布局
├── components/
│   ├── Header.tsx         # 顶部导航
│   ├── Sidebar.tsx        # 左侧数据集列表
│   ├── QuoteCard.tsx      # 卡片组件
│   └── icons/             # 图标组件
├── hooks/
│   ├── useAppReducer.ts   # 状态管理
│   ├── useLocalStorage.ts # 本地存储
│   └── useKeyboardNavigation.ts # 键盘导航
├── json_data/             # 数据集文件夹
│   ├── quotes.json        # 智慧名言
│   ├── poems.json         # 古诗词
│   └── example.json       # 示例数据
└── types.ts               # TypeScript 类型定义
```
