# 贷款计算器变更 - 2026-05-15

## 文件
`F:\Documents\Projects\JS\brain-games-pwa\bgp4cloudflare\loanCalculator.html`

## 本次完成的改动

### 1. Toast 弹框美化（Vue+CSS）

**改动位置：** CSS L2107 + template L2844 + JS L2882

- 升级为渐变背景 + 圆角卡片风格，带 scale 动画出入
- 新增 `toastType`（warning/error/success）+ `toastIcon` 三种图标
- `showToast(msg, type)` 支持类型参数，error 用红色主题 + `fa-times-circle`
- 已将"还款金额不能大于剩余本金"调用升级为 `showToast(..., 'error')`

### 2. 预览表格新增"备注"列

**改动位置：**

| 位置 | 改动 |
|------|------|
| `previewSchedule` 构建（L3150） | 冻结部分追加 `remark: ''` |
| `previewModification`（L4731） | 生成变动说明字符串（如 "降利率至4.9% / 等额本息"），写入 `modifiedSchedule` 每行的 `remark` |
| `getPreviewSchedule`（L3168） | 来自 `modifiedSchedule` 的行追加 `remark: item.remark \|\| ''` |
| 表头 L2774 | 新增 `<th>备注</th>` |
| 表格行 L2818 | 新增 `<td class="col-remark" :class="{ 'has-remark': item.remark }">{{ item.remark \|\| '—' }}</td>` |
| 表尾 L2827 | 新增 `<td class="foot-remark">—</td>` |
| CSS L2155 | `.col-remark` / `.has-remark` / `.foot-remark` 样式 |
| `return {}` L5486 | 导出 `toastMsg, toastVisible, toastType, toastIcon, showToast` |