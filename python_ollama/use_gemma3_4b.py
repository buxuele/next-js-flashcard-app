import time 
from ollama import chat

start_time = time.time()

stream = chat(
    model='gemma3:4b',
    messages=[{'role': 'user', 'content': '给我讲个笑话，开头是，一个野牛走进一家酒吧，'}],
    stream=True,
    )

for chunk in stream:
    print(chunk['message']['content'], end='', flush=True)

end_time = time.time()
elapsed_time = end_time - start_time

print(f'\n\n耗时: {elapsed_time:.2f} 秒')
### 14.13 秒


