const { getAllTZBChildrenTreeList, postLoginInfo } = require("../api");
const fs = require("fs");
const path = require("path");

postLoginInfo().then(([res, data]) => {
  if (res) {
    getAllTZBChildrenTreeList(
      data.curLeagueId || "kewYH7OhwH7Lilh-efvOEQ=="
    ).then((tzbResp) => {
      const tzbChilrenTreeList = tzbResp ?? [];

      console.log("查询完成，结果写入文件 tzb_tree.json...\n");
      fs.writeFileSync(
        path.resolve(__dirname, "tzb_tree.json"),
        JSON.stringify({
          leagueId: data.curLeagueId,
          leagueFullName: data.curLeagueFullName,
          leagueName: data.curLeagueName,
          leagueTypeId: data.leagueTypeId,
          children: tzbChilrenTreeList,
        })
      );
      console.log("写入完成;\n");
    });
  }
});
