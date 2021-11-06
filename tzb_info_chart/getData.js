const { getTYListByQueryLeagueId } = require("../api");
const fs = require("fs");

/**
 * 获取团支部团员人数数据
 */

// async function createChartJSON() {
//   const twsResp = await getTWListByQueryLeagueId("kewYH7OhwH7Lilh-efvOEQ==");
//   const twsList = twsResp ? twsResp.leagueList : [];

//   const tws = twsList.map(({ leagueId, leagueName }) => ({
//     twId: leagueId,
//     tw: leagueName,
//   }));

//   fs.writeFileSync("./tws.json", JSON.stringify(tws));

//   const json = await Promise.all(
//     tws.map(async ({ twId, tw }) => {
//       const tzbResp = await getAllTZBPersonNumberInfo(twId, 1);
//       const tzbInfos = tzbResp ?? {};
//       return {
//         tw,
//         tzbs: tzbInfos,
//       };
//     })
//   );

//   console.log("查询完成，结果写入文件 tw_tzb.json...\n");
//   fs.writeFileSync("./tw_tzb.json", JSON.stringify(json));
//   console.log("写入完成;\n");
//   return json;
// }

async function tree2tgbList(tree) {
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
        : tree.leagueTypeId === "03TW"
        ? "团委名"
        : "其他";
    return list.map((item) => ({ ...item, [key]: tree.leagueFullName }));
  } else {
    if (tree.leagueId === undefined)
      return [
        {
          支部名: tree.leagueFullName,
          组织人数: "未知",
        },
      ];
    const tgbResp = await getTYListByQueryLeagueId(
      tree.leagueId,
      tree.leagueTypeId
    );
    const tgbList = tgbResp ?? {};
    return {
      支部名: tree.leagueFullName,
      组织人数: tgbList.totalNumber,
      支部类型: tree.leagueTypeId,
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

  console.log("查询完成，结果写入文件 tzb_list.json...\n");
  fs.writeFileSync("./tzb_list.json", JSON.stringify(tzbList));
  console.log("写入完成;\n");
  return tzbList;
}

createChartJSON();
