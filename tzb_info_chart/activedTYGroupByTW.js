const { writeJSON2Chart } = require("./excel");
const path = require("path");

/**
 * 生成各团委非流动团员团支部的团员人数总表
 */

const data = require("./tzb_list.json");

const twMap = new Map();

for (const tzb of data) {
  let key = '<none>';
  // 研究生团工委需要细分
  if (tzb.团委名 === '上海市复旦大学研究生团工委') {
    key = tzb.团总支名 ?? tzb.支部名;
  } else {
    key = tzb.团委名 ?? tzb.团总支名 ?? tzb.支部名;
  }
  if (!twMap.has(key)) {
    twMap.set(key, { 所属团委:'', 非流动: 0, 流动: 0 });
  }
  twMap.get(key).所属团委 = tzb.团委名;
  if (!tzb.支部名.includes("流动")) {
    twMap.get(key).非流动 += tzb.组织人数;
  } else {
    twMap.get(key).流动 += tzb.组织人数;
  }
}

const result = [];
twMap.forEach((value, key) => {
  result.push({
    '团委名/团总支': key,
    所属团委: value.所属团委,
    非流动团员人数: value.非流动,
    流动团员人数: value.流动,
  });
});

writeJSON2Chart(
  result,
  path.resolve(__dirname, "out-获取团委非流动团员数.xlsx")
);
console.log(">> 推出 <<\n");
