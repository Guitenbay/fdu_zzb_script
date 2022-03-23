const {
  wait,
  postLoginInfo,
  downloadTyListExcel,
  tree2tzbList,
} = require("../api");
const fs = require("fs");

/**
 * 生成团支部团干部人数表
 */

/**
 * 获取团支部团干部人数数据
 */
async function downloadAllExcel() {
  const tzbTreeList = require("../tzb_tree/tzb_tree.json");
  let CURRENT_LIST = [];
  if (fs.existsSync("./ty_list.json")) {
    CURRENT_LIST = require("./ty_list.json");
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
      "之前已全部查询完成，如需更新查询数据，请删除本文件夹下的 ty_list.json 文件，再重新启动脚本 <<\n"
    );
    return;
  }
  for (let i = startIndex; i < len; i++) {
    await wait(1000);
    await downloadTyListExcel(
      tzbList[i].ID,
      "out_" + tzbList[i].支部名.replace(/(\s)/g, "_")
    );
    const url = `https://zhtj.youth.cn/v1/center/tuanweiexportmembers/${tzbList[i].ID}`;
    console.log(`${i + 1}/${(((i + 1) * 100) / len).toFixed(2)}%: ${url}`);
    tzbResultList.push({
      url,
    });
  }

  console.log("查询完成，结果写入文件 ty_list.json...\n");
  fs.writeFileSync("./ty_list.json", JSON.stringify(tzbResultList));
  console.log("写入完成;\n");
  return tzbList;
}

postLoginInfo().then(([res]) => {
  if (res) {
    downloadAllExcel();
    // downloadTyListExcel(
    //   "r-2YnBmLIMECcGXXcr0BRg==",
    //   "_ fea".replace(/(\s)/g, "_")
    // );
  }
});
