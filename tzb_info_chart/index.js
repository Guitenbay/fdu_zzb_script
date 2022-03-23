const { writeJSON2Chart } = require("./excel");
/**
 * 生成团支部团员人数表
 */
const OUT = "./out.xlsx";

const data = require("./tzb_list.json");

writeJSON2Chart(data, OUT);

console.log(">> 推出 <<\n");
