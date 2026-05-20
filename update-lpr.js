/**
 * LPR 利率自动更新脚本
 * 数据来源：中国货币网 https://www.chinamoney.com.cn/chinese/bklpr/
 * API: https://www.chinamoney.com.cn/ags/ms/cm-u-bk-currency/LprHis?lprTerm=1&date=
 *
 * 用法（Node.js 22+）:
 *   node update-lpr.js                    # 仅检查并输出最新 LPR 值
 *   node update-lpr.js --write            # 检查并自动更新 loanCalculator.html
 *   node update-lpr.js --write --dry-run   # 仅模拟更新，不实际写入文件
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const API_URL = 'https://www.chinamoney.com.cn/ags/ms/cm-u-bk-currency/LprHis?lprTerm=1&date=';
const HTML_FILE = path.join(__dirname, 'loanCalculator.html');

// 命令行参数
const args = process.argv.slice(2);
const WRITE_MODE = args.includes('--write');
const DRY_RUN = args.includes('--dry-run');

function fetchLPR() {
  return new Promise((resolve, reject) => {
    https.get(API_URL, { headers: { Accept: 'application/json' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const latest = json.records?.[0];
          if (!latest) return reject(new Error('无法解析 LPR 数据'));
          resolve({ lpr1y: latest['1Y'], lpr5y: latest['5Y'], date: latest.showDateCN });
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function updateHTML(lpr1y, lpr5y) {
  const content = fs.readFileSync(HTML_FILE, 'utf8');

  // 匹配 LPR 常量定义：const LPR_1Y = 3.xx; // ...\nconst LPR_5Y = 3.xx;
  const pattern = /const LPR_1Y = [\d.]+;[\s\S]*?const LPR_5Y = [\d.]+;/;
  const replacement = `const LPR_1Y = ${lpr1y};  // 1年期 LPR（来源chinamoney.com.cn/api）\n            const LPR_5Y = ${lpr5y};  // 5年期以上 LPR（来源chinamoney.com.cn/api）`;

  if (!pattern.test(content)) {
    console.error('⚠️  未在 HTML 文件中找到 LPR 常量定义，请确认文件结构');
    process.exit(1);
  }

  const newContent = content.replace(pattern, replacement);

  if (DRY_RUN) {
    console.log('📝 [dry-run] 拟更新为:');
    console.log(`   LPR_1Y = ${lpr1y}`);
    console.log(`   LPR_5Y = ${lpr5y}`);
    return;
  }

  fs.writeFileSync(HTML_FILE, newContent, 'utf8');
  console.log(`✅ 已更新 ${HTML_FILE}`);
  console.log(`   LPR_1Y = ${lpr1y}`);
  console.log(`   LPR_5Y = ${lpr5y}`);
}

async function main() {
  try {
    console.log('📡 正在从 chinamoney.com.cn 获取 LPR 数据...');
    const { lpr1y, lpr5y, date } = await fetchLPR();
    console.log(`✅ 获取成功！日期: ${date}`);
    console.log(`   1年期 LPR = ${lpr1y}%`);
    console.log(`   5年期+  LPR = ${lpr5y}%`);

    if (WRITE_MODE) {
      await updateHTML(lpr1y, lpr5y);
    } else {
      console.log('\n提示：加 --write 参数会直接更新 loanCalculator.html');
      console.log('      加 --dry-run 仅模拟更新，不写入文件');
    }
  } catch (err) {
    console.error('❌ 获取失败:', err.message);
    process.exit(1);
  }
}

main();
