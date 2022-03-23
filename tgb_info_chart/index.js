const XLSX = require("xlsx");
const path = require("path");

/**
 * 生成团支部团干部人数表
 */
const BASIC = "../basic.xlsx";
const OUT = "./out.xlsx";

/**
 * 获取团支部团干部人数数据
 */
function writeJSON2Chart(data) {
  console.log("生成 excel 表...\n");
  const basic = XLSX.readFile(path.resolve(__dirname, BASIC));

  basic.Sheets[basic.SheetNames[0]] = XLSX.utils.json_to_sheet(data, {
    header: ["团委名", "团总支名", "支部名", "其他", "团干部人数"],
  });

  XLSX.writeFile(basic, path.resolve(__dirname, OUT));
  console.log("生成 out.xlsx;\n");
}

const data = require("./tgb_list.json");
// const dataWithoutBiye = data.filter(({ 支部名, 团总支名 }) => {
//   return (
//     // (支部名 &&
//     //   !支部名.includes("2016") &&
//     //   !支部名.includes("2017") &&
//     //   !支部名.includes("2018")) ||
//     // (团总支名 &&
//     //   !团总支名.includes("2016") &&
//     //   !团总支名.includes("2017") &&
//     //   !团总支名.includes("2018")) ||
//     支部名 === undefined && 团总支名 === undefined
//   );
// });
// createChartJSON().then((data) => {
writeJSON2Chart(data);

console.log(">> 推出 <<\n");
// });
