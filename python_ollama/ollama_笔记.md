

### 启动服务器

ollama serve         ### 这个命令很不错。
ollama run qwen3:8b


检查
http://localhost:11434


### 下载模型

ollama pull qwen2.5:7b
ollama pull qwen3:8b
ollama pull gemma3:4b   速度很快。很适合简单的任务，尤其是快速批量处理的任务。

### 最终的处理结果

- 我觉得已经很好了。毕竟我的文件格式很奇怪。
- 初步而言， 模型能运行，流程能跑通已经很不错了。
- 实际效果不理想是很正常的。可以考虑使用硬性的规则，提前处理那些 短线开头的文本。