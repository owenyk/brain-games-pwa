# 贷款计算器 - 页面性能优化 2026-05-15

## 文件
`F:\Documents\Projects\JS\brain-games-pwa\bgp4cloudflare\loanCalculator.html`

## ✅ 已实施的优化

### 1. 预连接 CDN（减少连接建立时间 ~100-300ms）
```html
<link rel="preconnect" href="https://unpkg.com">
<link rel="preconnect" href="https://cdn.staticfile.net">
<link rel="preconnect" href="https://cdn.jsdelivr.net">
```

### 2. 导出库完全动态加载（零首屏开销）
**移除**了以下静态 `<script>` 标签（节省 ~900KB 同步下载）：
- ❌ xlsx.full.min.js（639KB）→ 动态加载 xlsx.mini.min.js（250KB，jsdelivr CDN）
- ❌ jspdf.umd.min.js（同步阻塞）
- ❌ jspdf.plugin.autotable.js（同步阻塞）
- ❌ html2canvas.min.js（150KB，从未在代码中使用，已移除）

**保留同步加载**（首屏必需）：
- ✅ Vue 3（unpkg）
- ✅ ECharts（staticfile）

### 3. 动态加载工具函数
```javascript
const loadScript = (url) => {
    return new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${url}"]`);
        if (existing) { resolve(); return; }
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
        document.head.appendChild(script);
    });
};
```

### 4. exportToExcel 动态加载 xlsx
```javascript
if (!window.XLSX) {
    await loadScript('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.mini.min.js');
}
```
- xlsx.mini.min.js（250KB）vs xlsx.full.min.js（639KB），节省 ~400KB
- 仅导出时才加载，用户点击导出按钮后约 0.5-1s 加载完成

### 5. exportToPDF 动态加载 jsPDF + autotable
```javascript
if (!window.jspdf) {
    await loadScript('https://cdn.jsdelivr.net/npm/jspdf@2/dist/jspdf.umd.min.js');
    await loadScript('https://cdn.jsdelivr.net/npm/jspdf-autotable@5/dist/jspdf.plugin.autotable.min.js');
}
```

### 6. html2canvas 确认未使用，完全移除
代码中无任何 `html2canvas` 调用，移除了这个无用的 150KB 依赖。

## 页面加载变化

| 阶段 | 优化前 | 优化后 |
|------|--------|--------|
| 同步下载 | Vue + ECharts + xlsx(639KB) + jsPDF + autotable + html2canvas | Vue + ECharts 约 300KB |
| 阻塞时间 | 所有CDN资源同步阻塞 | 仅 Vue + ECharts 阻塞 |
| 导出库 | 首屏全部加载（~900KB） | 仅导出时按需加载 |

## 进一步优化建议

1. **Cloudflare Auto Minify**：后台开启 HTML/CSS/JS 自动压缩（可减少 ~20% 文件大小）
2. **ECharts 可以考虑 defer**（需要重构 onMounted 中的同步调用）
3. **XLSX 可考虑换用更小库**：如 `exceljs` 的写入库或原生 `Blob+CSV`
4. **重复访问优化**：将 CDN 资源上传到 Cloudflare R2，用自己的 CDN 域名加载，设置 `max-age=31536000`