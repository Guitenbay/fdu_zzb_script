const { writeJSON2Chart } = require("./excel");
const path = require("path");

/**
 * 生成新生团支部团员人数表（非完整）
 */
const data = require("./tzb_list.json");
// const freshmanList = data.map(({ tw, tzbs }) => {
//   return {
//     tw,
//     tzbs: tzbs.filter(
//       ({ 组织名 }) =>
//         组织名.includes("2021") ||
//         组织名.includes("新生") ||
//         (!/[0-9]+/.test(组织名) && 组织名.includes("团总支"))
//     ),
//   };
// });
const freshmanList = data.filter(
  ({ 支部名 }) => 支部名.includes("2021") || 支部名.includes("新生")
);

writeJSON2Chart(freshmanList, path.resolve(__dirname, "./out-freshman.xlsx"));
console.log(">> 推出 <<\n");
