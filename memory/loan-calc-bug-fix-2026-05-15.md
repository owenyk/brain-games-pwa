# 提前还款金额校验 - 2026-05-15

## 修改
文件：`F:\Documents\Projects\JS\brain-games-pwa\bgp4cloudflare\loanCalculator.html`

在 `previewModification()` 中，`enablePrepayment.value && prepaymentType.value === 'partial' && prepaymentAmount.value > remainingPrincipal` 时弹出提示「还款金额不能大于剩余本金（xxx元）！」并直接 return。

## 位置
行 ~4641，在 `const remainingPrincipal = getRemainingPrincipalAtSelected()` 之后。