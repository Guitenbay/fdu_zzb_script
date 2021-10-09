const { readJSON2Chart } = require("./excel");
/**
 * 生成团支部团员人数表
 */
const OUT = "./out.xlsx";

const data = require("./tw_tzb.json");

readJSON2Chart(data, OUT);

console.log(">> 推出 <<\n");
