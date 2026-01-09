const fs = require("fs");
const path = require("path");

const jsonDataDir = path.join(__dirname, "json_data");
const files = fs
  .readdirSync(jsonDataDir)
  .filter((file) => file.endsWith(".json"));

console.log(`找到 ${files.length} 个 JSON 文件\n`);

let successCount = 0;
let errorCount = 0;

files.forEach((file) => {
  try {
    const filePath = path.join(jsonDataDir, file);
    let fileContent = fs.readFileSync(filePath, "utf-8");

    // 清理可能的 markdown 代码块标记
    fileContent = fileContent.trim();
    if (fileContent.startsWith("```json") || fileContent.startsWith("``json")) {
      console.log(`⚠️  ${file} 包含 markdown 标记，正在清理...`);
      fileContent = fileContent.replace(/^```?json\s*\n?/i, "");
    }
    if (fileContent.endsWith("```")) {
      fileContent = fileContent.replace(/\n?```\s*$/, "");
    }

    const data = JSON.parse(fileContent);

    if (!Array.isArray(data) || data.length === 0) {
      console.log(`❌ ${file}: 数据格式无效`);
      errorCount++;
    } else {
      console.log(`✅ ${file}: ${data.length} 条数据`);
      successCount++;
    }
  } catch (error) {
    console.log(`❌ ${file}: ${error.message}`);
    errorCount++;
  }
});

console.log(`\n总结: ${successCount} 成功, ${errorCount} 失败`);
