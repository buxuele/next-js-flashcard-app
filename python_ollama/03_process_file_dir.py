import os
import time
from ollama import chat

### 使用 ollama 来处理文件。
start_time = time.time()


def read_markdown_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        return content


def write_json_file(file_path, content):
    with open(file_path, 'w', encoding='utf-8') as f:
        # 去除收尾的3引号。
        f.write(content[1:-1])
        return True


SYSTEM_ROLE = """
# Role
你是一个智能文本整理专家，擅长将长文本提炼为高质量、可记忆的结构化知识。
"""

RULES = """
# 处理规则（智能剪刀模式 · 严格）

## 0. 最高原则（不可违反）
- 本任务中，你不是“理解者”，而是【剪刀】。
- **禁止改写、禁止总结、禁止省略、禁止补写。**
- **question + answer 拼接后，必须与原文语义与内容等价，且文本基本完整。**
- 唯一允许的操作：在原文中选择一个合理的切分点。

---

## 1. 文本类型识别
- 文本中：
  - 有序列表（1. 2. 3. …） = 原文内容（必须完整保留）
  - 以「- 」开头的内容 = 用户个人看法（非原文）

---

## 2. 清洗修复（不影响内容）
- 仅修正明显 OCR 错误（错别字、错序）。
- 仅去除无意义干扰字符（乱码、水印、页码）。
- **不得删除任何有意义的句子或从句。**

---

## 3. 智能剪刀拆分模式（核心）

- 每一条原文，必须被拆为两段：
  - question = 原文前半段
  - answer = 原文后半段
- **拆分不等于改写，只是切开。**
- 不得将一句话缩短为“概念”或“摘要”。

---

## 4. 拆分位置选择规则（按优先级）

### 4.1 结构性切分点（优先）
- 以下位置优先作为切分点：
  - 逗号（，）
  - 冒号（：）
  - 引出动作或引语的动词前后（如“说道”“反问道”“写道”）
- 目标是：
  - question 形成“未完待续”的自然停顿
  - answer 自然承接前文

### 4.2 禁止过度切分
- 不得只保留一句话的一小部分
- 不得将完整事件压缩成半句
- **question 与 answer 合起来，应能完整复述原文事件**

---

## 5. 强制结构约束（硬规则）

1. **question 与 answer 必须都来自原文**
   - 不得新增新词
   - 不得替换说法

2. **禁止内容丢失**
   - 不得删除时间、人物、动作、因果关系

3. answer 不得为 null  
   - 必须是原文剩余部分

---

## 6. 引号与反问句处理规则（关键）

- 若原文包含引号或反问：
  - 不得拆散引号内部的完整语义
  - 不得只保留引号中的半句话
- 优先切分在：
  - 引号之前
  - 或完整引语结束之后

---

## 7. 个人看法的处理（附加，不参与切分）
- 以「- 」开头的个人看法：
  - 不参与 question / answer 的切分
  - 若存在，可作为【补充说明】附加在 answer 末尾
  - 不得影响原文内容的完整性

---

## 8. 作者提取
- 原文中明确出现作者 → 提取
- 未明确出现 → author = null
"""

OUTPUT_SCHEMA = """
# 输出格式要求
- 只输出一个合法 JSON 数组
- 不允许任何解释性文字

```json
[
  {
    "id": 1,
    "question": "前半句（铺垫）",
    "answer": "后半句（核心）",
    "author": "作者名 或 null"
  }
]
"""

EXAMPLES = """
# 示例

输入：
Hard times build character.

输出：
[
  {
    "id": 1,
    "question": "Hard times",
    "answer": "build character.",
    "author": null
  }
]

输入：
你若盛开，蝴蝶自来。

输出：
[
  {
    "id": 2,
    "question": "你若盛开，",
    "answer": "蝴蝶自来。",
    "author": null
  }
]
"""


def build_prompt(text: str) -> str:
    return "\n\n".join([
        SYSTEM_ROLE.strip(),
        RULES.strip(),
        OUTPUT_SCHEMA.strip(),
        EXAMPLES.strip(),
        "# 待处理文本如下：",
        text.strip()
    ])


def run(input_md_file_path: str):

    md_content = read_markdown_file(input_md_file_path)
    prompt = build_prompt(md_content)

    # print(f'输入文本长度: {len(prompt)}')
    # print(prompt)
    # print()

    stream = chat(
        model='gemma3:4b',
        # messages=[{'role': 'user', 'content': '给我讲个笑话，开头是，一个野牛走进一家酒吧，'}],
        messages=[{'role': 'user', 'content': prompt}],
        stream=True,
    )

    json_text = ""
    for chunk in stream:
        # print(chunk['message']['content'], end='', flush=True)
        json_text += chunk['message']['content']

    # print(json_text)
    return json_text


if __name__ == '__main__':
    for one_file in os.listdir('./book_data'):
        ### 读取 md
        file_path = os.path.join('./book_data', one_file)
        print(f"正在处理: {one_file}")

        # ollama 处理。
        ret = run(file_path)

        ### 写入文件。
        write_json_file(f'./bookNoteJsonDdata/{one_file}.json', ret)

end_time = time.time()
elapsed_time = end_time - start_time

print(f'\n\n耗时: {elapsed_time:.2f} 秒')
