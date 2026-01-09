#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
智能修复 JSON 文件
- 自动检测并移除 markdown 代码块标记
- 提取有效的 JSON 数组部分
"""

import json
import os
import re
from pathlib import Path


def extract_json_array(content):
    """
    从内容中提取 JSON 数组
    
    Args:
        content: 文件内容
        
    Returns:
        str: 提取的 JSON 数组字符串，如果失败返回 None
    """
    # 查找第一个 [ 和最后一个 ]
    start = content.find('[')
    end = content.rfind(']')
    
    if start == -1 or end == -1 or start >= end:
        return None
    
    # 提取数组部分
    json_str = content[start:end+1]
    return json_str


def check_and_fix_json(file_path):
    """
    检查并修复 JSON 文件
    
    Args:
        file_path: JSON 文件路径
        
    Returns:
        tuple: (是否修复, 状态信息)
    """
    try:
        # 读取文件内容
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # 尝试直接解析
        try:
            data = json.loads(content)
            if isinstance(data, list) and len(data) > 0:
                return False, f"✅ 合法 ({len(data)} 条数据)"
            else:
                return False, "❌ 格式错误: 不是有效的数组或为空"
        except json.JSONDecodeError:
            pass
        
        # 尝试修复
        print(f"⚠️  {file_path.name} 需要修复...")
        
        # 1. 移除 markdown 代码块标记
        content = content.strip()
        content = re.sub(r'^```?json\s*\n?', '', content, flags=re.IGNORECASE)
        content = re.sub(r'\n?```?\s*$', '', content)
        content = content.strip()
        
        # 2. 尝试解析
        try:
            data = json.loads(content)
            if isinstance(data, list) and len(data) > 0:
                # 保存修复后的文件
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                return True, f"✅ 已修复 (移除标记, {len(data)} 条数据)"
        except json.JSONDecodeError:
            pass
        
        # 3. 尝试提取 JSON 数组
        json_str = extract_json_array(content)
        if json_str:
            try:
                data = json.loads(json_str)
                if isinstance(data, list) and len(data) > 0:
                    # 保存修复后的文件
                    with open(file_path, 'w', encoding='utf-8') as f:
                        json.dump(data, f, ensure_ascii=False, indent=2)
                    return True, f"✅ 已修复 (提取数组, {len(data)} 条数据)"
            except json.JSONDecodeError:
                pass
        
        # 4. 尝试删除头尾行
        lines = original_content.splitlines()
        if len(lines) > 4:
            # 尝试删除头1行尾1行
            for head_lines in [1, 2, 3]:
                for tail_lines in [1, 2, 3]:
                    if len(lines) <= head_lines + tail_lines:
                        continue
                    
                    fixed_lines = lines[head_lines:-tail_lines] if tail_lines > 0 else lines[head_lines:]
                    fixed_content = '\n'.join(fixed_lines)
                    
                    try:
                        data = json.loads(fixed_content)
                        if isinstance(data, list) and len(data) > 0:
                            # 保存修复后的文件
                            with open(file_path, 'w', encoding='utf-8') as f:
                                json.dump(data, f, ensure_ascii=False, indent=2)
                            return True, f"✅ 已修复 (删除头{head_lines}尾{tail_lines}行, {len(data)} 条数据)"
                    except json.JSONDecodeError:
                        continue
        
        return False, "❌ 修复失败: 无法提取有效的 JSON 数组"
                
    except Exception as e:
        return False, f"❌ 处理失败: {e}"


def main():
    """主函数"""
    # JSON 数据目录
    json_dir = Path('json_data')
    
    if not json_dir.exists():
        print(f"❌ 目录不存在: {json_dir}")
        return
    
    # 获取所有 JSON 文件
    json_files = list(json_dir.glob('*.json'))
    
    if not json_files:
        print(f"❌ 在 {json_dir} 中没有找到 JSON 文件")
        return
    
    print(f"找到 {len(json_files)} 个 JSON 文件\n")
    print("=" * 80)
    
    # 统计
    total = 0
    valid = 0
    fixed = 0
    failed = 0
    
    # 处理每个文件
    for json_file in sorted(json_files):
        total += 1
        was_fixed, status = check_and_fix_json(json_file)
        
        if was_fixed:
            fixed += 1
            print(f"🔧 {json_file.name}")
            print(f"   {status}\n")
        elif "✅ 合法" in status:
            valid += 1
            print(f"✅ {json_file.name}: {status}\n")
        else:
            failed += 1
            print(f"❌ {json_file.name}")
            print(f"   {status}\n")
    
    # 输出统计
    print("=" * 80)
    print(f"\n📊 统计结果:")
    print(f"   总文件数: {total}")
    print(f"   ✅ 原本合法: {valid}")
    print(f"   🔧 已修复: {fixed}")
    print(f"   ❌ 修复失败: {failed}")
    
    if fixed > 0:
        print(f"\n✨ 成功修复了 {fixed} 个文件！")
    
    if failed > 0:
        print(f"\n⚠️  还有 {failed} 个文件需要手动处理")


if __name__ == '__main__':
    main()
