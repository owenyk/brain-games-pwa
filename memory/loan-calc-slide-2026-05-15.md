# 贷款计算器 - 预览表格备注列 & 滑动 2026-05-15

## 文件
`F:\Documents\Projects\JS\brain-games-pwa\bgp4cloudflare\loanCalculator.html`

## 改动摘要

### 1. 备注仅在选中期（isSelected=true）显示
- `item.remark` 只在该行 `isSelected` 为 true 时渲染
- 其余行显示空占位符 `.remark-placeholder`（保持表格对齐）
- `has-remark` class 改为绑定 `item.isSelected`

### 2. 预览表格支持触摸滑动 + 左右箭头
- `.preview-table-wrapper` 内包了两层：
  - `.preview-scroll-container`（横向滚动容器，支持 touch 拖拽）
  - 左右箭头 `.table-scroll-hint`（hover 显示，click 滚动 180px）
- `scrollTable(dir)` 函数，每次滚动 180px
- 触摸事件：`touchstart` / `touchmove` / `touchend` 手动实现拖拽
- 导出 `scrollTable` 到 return {}

### 3. 已完成但需注意：合计行简化
- tfoot 从 `<td colspan="2">` + foot-principal + foot-interest 合并为 `<td colspan="5">` 合计标签
- foot-remark 列保留 "—"