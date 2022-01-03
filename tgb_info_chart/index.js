const XLSX = require("xlsx");
const {
  // wait,
  getTGBListByQueryLeagueId,
  getAllTZBTreeList,
} = require("../api");
const fs = require("fs");

/**
 * 生成团支部团干部人数表
 */
const BASIC = "../basic.xlsx";
const OUT = "./out.xlsx";

async function tree2tgbList(tree) {
  if (tree.leagueId === undefined)
    return [
      {
        支部名: tree.leagueFullName,
        团干部人数: "未知",
      },
    ];
  const tgbResp = await getTGBListByQueryLeagueId(tree.leagueId);
  const tgbList = tgbResp ?? {};
  if (Array.isArray(tree.children) && tree.children.length > 0) {
    const result = await Promise.all(
      tree.children.map(async (tree) => {
        const list = await tree2tgbList(tree);
        return list;
      })
    );
    const list = result.flat();
    const key =
      tree.leagueTypeId === "02TZZ"
        ? "团总支名"
        : tree.leagueTypeId === "03TW" || tree.leagueTypeId === "04TGW"
        ? "团委名"
        : "其他";
    return list
      .map((item) => ({ ...item, [key]: tree.leagueFullName }))
      .concat([
        {
          [key]: tree.leagueFullName,
          团干部人数: tgbList.totalNumber,
        },
      ]);
  } else {
    return {
      支部名: tree.leagueFullName,
      团干部人数: tgbList.totalNumber,
    };
  }
}

async function createChartJSON() {
  const tzbTreeList = require("../tzb_tree/tzb_tree.json");

  const result = await Promise.all(
    tzbTreeList.map(async (tree) => {
      const list = await tree2tgbList(tree);
      return list;
    })
  );
  const tzbList = result.flat();
  console.log(tzbList.length);

  console.log("查询完成，结果写入文件 tgb_list.json...\n");
  fs.writeFileSync("./tgb_list.json", JSON.stringify(tzbList));
  console.log("写入完成;\n");
  return tzbList;
}

function readJSON2Chart(data) {
  console.log("生成 excel 表...\n");
  const basic = XLSX.readFile(BASIC);

  basic.Sheets[basic.SheetNames[0]] = XLSX.utils.json_to_sheet(data, {
    header: ["团委名", "团总支名", "支部名", "其他", "团干部人数"],
  });

  XLSX.writeFile(basic, OUT);
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
createChartJSON().then((data) => {
  readJSON2Chart(data);

  console.log(">> 推出 <<\n");
});
