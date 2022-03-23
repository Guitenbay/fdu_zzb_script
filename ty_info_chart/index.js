const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

/**
 * 生成团支部团干部人数表
 */
const BASIC = "../basic.xlsx";
const OUT = "./out.xlsx";

/**
 * 获取团支部团员数据
 */

function readChart2JSON(filepath) {
  if (!fs.existsSync(filepath)) {
    console.log("Error: not file " + filepath);
    return {};
  }
  const data = XLSX.readFile(filepath);

  const dJson = XLSX.utils.sheet_to_json(data.Sheets[data.SheetNames[0]], {
    skipHeader: true,
  });
  return dJson.map((item) => {
    return {
      组织全称: item.组织全称,
      姓名: item.姓名,
      性别: item.性别,
      出生年月: item.出生年月,
      手机号码: item.手机号码,
      政治面貌: item.政治面貌,
      团员发展编号: item.团员发展编号,
    };
  });
}

function writeJSON2Chart(data) {
  console.log("生成 excel 表...\n");
  const basic = XLSX.readFile(path.resolve(__dirname, path.resolve(__dirname, BASIC)));

  basic.Sheets[basic.SheetNames[0]] = XLSX.utils.json_to_sheet(data, {
    header: [],
  });

  XLSX.writeFile(basic, path.resolve(__dirname, path.resolve(__dirname, OUT)));
  console.log("生成 out.xlsx;\n");
}

function findJsonFile(dir) {
  let files = fs.readdirSync(dir);
  return files
    .map(function (filename) {
      if (!filename.includes('.xlsx')) return [];
      let fPath = path.resolve(dir, filename);
      let stat = fs.statSync(fPath);
      if (stat.isDirectory() === true) {
        return findJsonFile(fPath);
      }
      if (stat.isFile() === true) {
        return fPath;
      }
    })
    .flat();
}

const dir = path.resolve(__dirname, `download`);

const excels = findJsonFile(dir);

const excelJson = excels.map((filename) => readChart2JSON(filename)).flat();

writeJSON2Chart(excelJson);

console.log(">> 推出 <<\n");
// });
