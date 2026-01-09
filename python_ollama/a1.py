

import requests

url = "http://localhost:11434/api/chat"

payload = {
    #  model='gemma3:4b',
    "model": "qwen3:8b",
    "messages": [
        {"role":"system","content":"你是一个严谨的编程专家"},
        {"role":"user","content":"写一个 Python 版 LRU Cache"}
    ],
    "stream": True,
    "options": {
        "temperature": 0.6,
        "top_p": 0.9,
        "num_ctx": 2048,
        "num_gpu": 1
    }
}

r = requests.post(url, json=payload, stream=True)
for line in r.iter_lines():
    if line:
        print(line.decode())


