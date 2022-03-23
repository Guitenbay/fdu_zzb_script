const { getAllTZBTreeList, postLoginInfo } = require("../api");
const fs = require("fs");
const path = require("path");

postLoginInfo().then(([res, data]) => {
  if (res) {
    getAllTZBTreeList(data.curLeagueId || "kewYH7OhwH7Lilh-efvOEQ==").then(
      (tzbResp) => {
        const tzbTreeList = tzbResp ?? [];

        console.log("查询完成，结果写入文件 tzb_tree.json...\n");
        fs.writeFileSync(path.resolve(__dirname, "tzb_tree.json"), JSON.stringify(tzbTreeList));
        console.log("写入完成;\n");
      }
    );
  }
});
