const { getTYListByQueryLeagueId, wait } = require("../api");
const fs = require("fs");

/**
 * 获取团支部团员人数数据
 */

function tree2tzbList(tree) {
  if (Array.isArray(tree.children) && tree.children.length > 0) {
    const result = tree.children.map((tree) => {
      const list = tree2tzbList(tree);
      return list;
    });
    const list = result.flat();
    const key =
      tree.leagueTypeId === "02TZZ"
        ? "团总支名"
        : tree.leagueTypeId === "03TW" || tree.leagueTypeId === "04TGW"
        ? "团委名"
        : "其他";
    return list.map((item) => ({ ...item, [key]: tree.leagueFullName }));
  } else {
    if (tree.leagueId === undefined) {
      return [
        {
          ID: undefined,
          支部类型: tree.leagueTypeId,
          支部名: tree.leagueFullName,
          组织人数: "未知",
        },
      ];
    }
    return {
      ID: tree.leagueId,
      支部名: tree.leagueFullName,
      支部类型: tree.leagueTypeId,
      组织人数: undefined,
    };
  }
}

async function createChartJSON() {
  const tzbTreeList = require("../tzb_tree/tzb_tree.json");
  let CURRENT_LIST = [];
  if (fs.existsSync("./tzb_list.json")) {
    CURRENT_LIST = require("./tzb_list.json");
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
      "之前已全部查询完成，如需更新查询数据，请删除本文件夹下的 tzb_list.json 文件，再重新启动脚本 <<\n"
    );
    return;
  }
  for (let i = startIndex; i < len; i++) {
    await wait(3000);
    const resp = await getTYListByQueryLeagueId(
      tzbList[i].ID,
      tzbList[i].支部类型
    );
    const list = resp;
    if (resp === null) {
      console.log("查询中止，结果写入文件 tzb_list.json...\n");
      fs.writeFileSync("./tzb_list.json", JSON.stringify(tzbResultList));
      console.log("写入完成;\n");
      return;
    }
    console.log(
      `${i + 1}/${((i + 1) * 100 / len).toFixed(2)}%: ${list.totalNumber}`
    );
    tzbResultList.push({
      ...tzbList[i],
      组织人数: list.totalNumber,
    });
  }

  console.log("查询完成，结果写入文件 tzb_list.json...\n");
  fs.writeFileSync("./tzb_list.json", JSON.stringify(tzbResultList));
  console.log("写入完成;\n");
  return tzbList;
}

createChartJSON();
