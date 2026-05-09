# subset_font.py
import subprocess
import os

# 定义需要的字符
required_chars = set()
# 添加常用字符
required_chars.update("0123456789")
required_chars.update("年月日时分秒")
required_chars.update("第期页数月供本金利息剩余元¥")
required_chars.update("详细公积商业贷还款明计划表导出时间客户名称")
required_chars.update("汇总共金额合计大写壹贰叁肆伍陆柒捌玖拾佰仟万亿整")
required_chars.update("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
required_chars.update("abcdefghijklmnopqrstuvwxyz")
required_chars.update("():：#；;=+/-.%, ")

# 转换为 Unicode 格式
unicode_list = []
for char in required_chars:
    if char:
        unicode_list.append(f"U+{ord(char):04X}")

# 去重并排序
unicode_list = sorted(set(unicode_list))
unicode_str = ",".join(unicode_list)

print(f"需要 {len(required_chars)} 个字符")
print(f"Unicode 列表: {unicode_str[:100]}...")

# 构建命令
cmd = [
    "pyftsubset",
    "SourceHanSansSC-Regular.ttf",
    f"--unicodes={unicode_str}",
    "--output-file=NotoSansSC-subset.ttf",
    # "--flavor=woff2",
    "--layout-features=*",
    "--hinting-tables=",
    "--verbose"
]

# 执行命令
print("正在生成字体子集...")
result = subprocess.run(cmd, capture_output=True, text=True)

if result.returncode == 0:
    print("✅ 字体子集生成成功！")
    
    # 检查文件大小
    if os.path.exists("NotoSansSC-subset.ttf"):
        size = os.path.getsize("NotoSansSC-subset.ttf")
        print(f"📦 文件大小: {size/1024:.1f} KB")
else:
    print("❌ 生成失败！")
    print("错误信息:", result.stderr)