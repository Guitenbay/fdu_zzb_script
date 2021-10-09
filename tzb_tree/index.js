const { getAllTZBTreeList } = require("../api");
const fs = require("fs");

const tzbResp = await getAllTZBTreeList("kewYH7OhwH7Lilh-efvOEQ==");
const tzbTreeList = tzbResp ?? [];

console.log("查询完成，结果写入文件 tzb_tree.json...\n");
fs.writeFileSync("./tzb_tree.json", JSON.stringify(tzbTreeList));
console.log("写入完成;\n");
