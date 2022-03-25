const {
  wait,
  postLoginInfo,
  tree2tzzList,
  downloadDBDJListExcel,
} = require("../api");
const fs = require("fs");
const path = require("path");

/**
 * 获取团支部对标定级数据
 */
async function downloadAllExcel(year) {
  let CURRENT_LIST = [];
  if (fs.existsSync(path.resolve(__dirname, "dbdj_list.json"))) {
    CURRENT_LIST = require("./dbdj_list.json");
  }

  const tzbTreeList = require("../tzb_tree/tzb_tree.json");
  const treeList = tzbTreeList.map((tree) => {
    const list = tree2tzzList(tree, ["01TZB", "06BYBTZB"]);
    return list;
  });
  const tzzList = treeList.flat();
  console.log(tzzList.length);

  const tzbResultList = CURRENT_LIST;
  let startIndex = CURRENT_LIST.length;
  const len = tzzList.length;
  if (startIndex >= len) {
    console.log(
      "之前已全部查询完成，如需更新查询数据，请删除对标定级数据统计文件夹下的 dbdj_list.json 文件，再重新启动脚本 <<\n"
    );
    return;
  }
  for (let i = startIndex; i < len; i++) {
    await wait(1000);
    await downloadDBDJListExcel(tzzList[i].ID, year, "out_" + tzzList[i].ID);
    const url = `https://zhtj.youth.cn/v1/center/exportLowerReviewStatistics/${tzzList[i].ID}/${year}`;
    console.log(`${i + 1}/${(((i + 1) * 100) / len).toFixed(2)}%: ${url}`);
    tzbResultList.push({
      url,
    });
  }

  console.log("查询完成，结果写入文件 dbdj_list.json...\n");
  fs.writeFileSync(
    path.resolve(__dirname, "dbdj_list.json"),
    JSON.stringify(tzbResultList)
  );
  console.log("写入完成;\n");
  return tzzList;
}

const YEAR = 2021;

postLoginInfo().then(([res]) => {
  if (res) {
    downloadAllExcel(YEAR);
  }
});
