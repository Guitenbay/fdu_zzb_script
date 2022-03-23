const { writeJSON2Chart } = require("./excel");

/**
 * 生成在校或毕业团支部团员人数表
 */
const biye = true;

const data = require("./tzb_list.json");

const list = data.filter(({ 支部类型 }) => {
  if (biye) {
    return 支部类型 === "06BYBTZB";
  }
  return 支部类型 !== "06BYBTZB";
});

writeJSON2Chart(list, biye ? "./out-beye.xlsx" : "./out-onSchool.xlsx");
console.log(">> 推出 <<\n");
