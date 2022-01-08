const XLSX = require("xlsx");
const { wait, getTGBListByQueryLeagueId, tree2tzbList } = require("../api");
const fs = require("fs");

/**
 * 生成团支部团干部人数表
 */
const BASIC = "../basic.xlsx";
const OUT = "./out.xlsx";

/**
 * 获取团支部团干部人数数据
 */
async function createChartJSON() {
  const tzbTreeList = require("../tzb_tree/tzb_tree.json");
  let CURRENT_LIST = [];
  if (fs.existsSync("./tgb_list.json")) {
    CURRENT_LIST = require("./tgb_list.json");
  }

  const treeList = tzbTreeList.map((tree) => {
    const list = tree2tzbList(tree);
    return list;
  });
  const tzbList = treeList.flat();
  console.log(tzbList.length);

  const tzbResultList = CURRENT_LIST;
  let startIndex = CURRENT_LIST.length;
  const len = tzbList.length;
  if (startIndex === len) {
    console.log(
      "之前已全部查询完成，如需更新查询数据，请删除本文件夹下的 tgb_list.json 文件，再重新启动脚本 <<\n"
    );
    return;
  }
  for (let i = startIndex; i < len; i++) {
    await wait(3000);
    const resp = await getTGBListByQueryLeagueId(tzbList[i].ID);
    const list = resp;
    if (resp === null) {
      console.log("查询中止，结果写入文件 tgb_list.json...\n");
      fs.writeFileSync("./tgb_list.json", JSON.stringify(tzbResultList));
      console.log("写入完成;\n");
      return;
    }
    console.log(
      `${i + 1}/${(((i + 1) * 100) / len).toFixed(2)}%: ${list.totalNumber}`
    );
    tzbResultList.push({
      ...tzbList[i],
      团干部人数: list.totalNumber,
    });
  }

  console.log("查询完成，结果写入文件 tgb_list.json...\n");
  fs.writeFileSync("./tgb_list.json", JSON.stringify(tzbResultList));
  console.log("写入完成;\n");
  return tzbList;
}

// createChartJSON();

function readJSON2Chart(data) {
  console.log("生成 excel 表...\n");
  const basic = XLSX.readFile(BASIC);

  basic.Sheets[basic.SheetNames[0]] = XLSX.utils.json_to_sheet(data, {
    header: ["团委名", "团总支名", "支部名", "其他", "团干部人数"],
  });

  XLSX.writeFile(basic, OUT);
  console.log("生成 out.xlsx;\n");
}

// createChartJSON()
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
readJSON2Chart(data);

console.log(">> 推出 <<\n");
// });
