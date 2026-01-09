#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
检查并修复 JSON 文件
- 检查 JSON 是否合法
- 如果不合法，删除头尾各2行后重新保存
"""

import json
import os
from pathlib import Path


def check_and_fix_json(file_path):
    """
    检查 JSON 文件是否合法，不合法则删除头尾2行
    
    Args:
        file_path: JSON 文件路径
        
    Returns:
        tuple: (是否修复, 状态信息)
    """
    try:
        # 读取文件内容
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 尝试解析 JSON
        try:
            data = json.loads(content)
            # 验证是否为数组且不为空
            if isinstance(data, list) and len(data) > 0:
                return False, f"✅ 合法 ({len(data)} 条数据)"
            else:
                return False, "❌ 格式错误: 不是有效的数组或为空"
        except json.JSONDecodeError as e:
            # JSON 解析失败，尝试修复
            print(f"⚠️  {file_path.name} JSON 解析失败: {e}")
            print(f"   正在尝试删除头尾2行...")
            
            # 按行分割
            lines = content.splitlines()
            
            if len(lines) <= 4:
                return False, "❌ 文件行数太少，无法修复"
            
            # 删除头2行和尾2行
            fixed_lines = lines[2:-2]
            fixed_content = '\n'.join(fixed_lines)
            
            # 验证修复后的内容
            try:
                data = json.loads(fixed_content)
                if isinstance(data, list) and len(data) > 0:
                    # 保存修复后的文件
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(fixed_content)
                    return True, f"✅ 已修复 ({len(data)} 条数据)"
                else:
                    return False, "❌ 修复失败: 不是有效的数组"
            except json.JSONDecodeError as e2:
                return False, f"❌ 修复失败: {e2}"
                
    except Exception as e:
        return False, f"❌ 读取文件失败: {e}"


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
            print(f"   {status}")
        elif "✅ 合法" in status:
            valid += 1
            print(f"✅ {json_file.name}: {status}")
        else:
            failed += 1
            print(f"❌ {json_file.name}")
            print(f"   {status}")
        
        print()
    
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
