#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
列出修复失败的文件
"""

from pathlib import Path

# 修复失败的文件名
failed_files = [
    "读书笔记--李斯 2.md.json",
    "读书笔记--林肯.json",
    "读书笔记--梵高 3.md.json",
    "读书笔记--谷歌.md.json"
]

json_dir = Path('json_data')

print("=" * 80)
print("修复失败的文件列表")
print("=" * 80)
print()

for i, filename in enumerate(failed_files, 1):
    file_path = json_dir / filename
    if file_path.exists():
        print(f"{i}. {filename}")
        print(f"   完整路径: {file_path.absolute()}")
        print()
    else:
        print(f"{i}. {filename} (文件不存在)")
        print()

print("=" * 80)
print(f"共 {len(failed_files)} 个文件需要手动处理")
print("=" * 80)
