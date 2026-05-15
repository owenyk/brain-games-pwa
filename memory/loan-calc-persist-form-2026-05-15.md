# 贷款计算器 - 关闭面板保留表单数据 2026-05-15

## 文件
`F:\Documents\Projects\JS\brain-games-pwa\bgp4cloudflare\loanCalculator.html`

## 问题
关闭浮动修改面板后，提前还款金额、利率、还款方式等输入值被全部清空。再次点击其他期数时需要重新输入，不方便。

## 修复：closeModificationFloat 只清结构性状态

### 修改前（line 5419）
```javascript
const closeModificationFloat = (e) => {
    showModificationFloat.value = false;
    selectedPeriod.value = null;
    selectedRowIndex.value = null;
    selectedModalRowIndex.value = null;
    // ❌ 清空了用户输入值
    modificationType.value = '';
    enableRateChange.value = false;    // 利率变更
    newInterestRate.value = null;       // 新利率
    newRepaymentMethod.value = '';      // 新还款方式
    prepaymentAmount.value = 0;         // 提前还款金额
    modifiedSchedule.value = [];
    enableMethodChange.value = false;
    enablePrepayment.value = false;
    prepaymentType.value = 'partial';
    isFrozen.value = false;
};
```

### 修改后
```javascript
const closeModificationFloat = (e) => {
    showModificationFloat.value = false;
    // ✅ 只清结构性状态，保留用户的输入值
    selectedPeriod.value = null;
    selectedRowIndex.value = null;
    selectedModalRowIndex.value = null;
    modifiedSchedule.value = [];
    isFrozen.value = false;
    // 以下值不再清空：enableRateChange, newInterestRate,
    // newRepaymentMethod, prepaymentAmount, prepaymentOption,
    // enableMethodChange, enablePrepayment, prepaymentType
};
```

## 保留的值（再次打开时自动回填）
| 字段 | 说明 |
|------|------|
| `enableRateChange` | 是否勾选利率变更 |
| `newInterestRate` | 新利率值 |
| `enableMethodChange` | 是否勾选还款方式变更 |
| `newRepaymentMethod` | 新还款方式 |
| `enablePrepayment` | 是否勾选提前还款 |
| `prepaymentAmount` | 提前还款金额 |
| `prepaymentOption` | 缩期/减月供 |
| `prepaymentType` | partial/full |

## 自动回填逻辑（selectPeriod）
```javascript
// 选择期数时，如果利率变更已勾选且利率为空，自动填入当前利率
if (enableRateChange.value && !newInterestRate.value) {
    newInterestRate.value = parseFloat(effectiveRate.value.toFixed(2));
}
```

## 副作用注意
- `isFrozen` 也在关闭时重置为 false（之前不清），防止预览后关面板导致表格期数被错误冻结无法再次选择
- `.modification-float` 宽度最大 640px（用户已自行修改 CSS）