const { shouldClassify } = require("./workTypeClassify");

/**
 * 计算学生人数
 */
const data = require("./tzb_list.json")
  .filter((item) => {
    return item.支部类型 === "01TZB";
  })
  .map((item) => {
    if (item.团委名 === undefined) {
      item.团委名 = item.团总支名;
    }
    if (item.团委名 === undefined) {
      item.团委名 = item.支部名;
    }
    return {
      二级组织名: item.团委名,
      支部名: item.支部名,
      组织人数: item.组织人数,
    };
  })
  .filter((item) => {
    if (shouldClassify(item.二级组织名)) {
      return (
        item.支部名.includes("学生") ||
        item.支部名.includes("本科") ||
        item.支部名.includes("试验") ||
        item.支部名.includes("实验") ||
        item.支部名.includes("硕") ||
        item.支部名.includes("研究生") ||
        item.支部名.includes("博") ||
        item.支部名.includes("规培生")
      );
    }
    return true;
  });

const calcMember = (a, item) => a + item.组织人数;

const movedList = data.filter(
  ({ 支部名 }) =>
    支部名.includes("流动") ||
    支部名.includes("待转接") ||
    支部名.includes("临时") ||
    支部名.includes("毕业") ||
    支部名.includes("新生")
);
const teacherList = data.filter(
  ({ 支部名 }) =>
    支部名.includes("教工") ||
    支部名.includes("出版") ||
    支部名.includes("机关")
);
const masterList = data.filter(
  ({ 支部名 }) =>
    !支部名.includes("博士研究生") &&
    (支部名.includes("研究") ||
      支部名.includes("硕") ||
      支部名.includes("口腔") ||
      支部名.includes("住培医师") ||
      支部名.includes("mfa") ||
      支部名.includes("MFA"))
);
const PhDList = data.filter(({ 支部名 }) => 支部名.includes("博士"));
const total = data.reduce(calcMember, 0);
const move = movedList.reduce(calcMember, 0);
const teacher = teacherList.reduce(calcMember, 0);
const master = masterList.reduce(calcMember, 0);
const PhD = PhDList.reduce(calcMember, 0);
const undergraduate = total - move - teacher - master - PhD;
console.log(`
结果:
---------
团员数：${total}
本科团员数：${undergraduate}
研究生团员数：${master}
博士团员数：${PhD}
流动团员数：${move}
教工团员数：${teacher}
`);
// console.log(
//   data
//     .filter(
//       ({ 支部名 }) =>
//         !(
//           支部名.includes("本科") ||
//           支部名.includes("试验") ||
//           支部名.includes("实验") ||
//           支部名.includes("流动") ||
//           支部名.includes("待转接") ||
//           支部名.includes("临时") ||
//           支部名.includes("毕业") ||
//           支部名.includes("新生") ||
//           支部名.includes("教工") ||
//           支部名.includes("出版") ||
//           支部名.includes("机关") ||
//           支部名.includes("研究") ||
//           支部名.includes("硕") ||
//           支部名.includes("口腔") ||
//           支部名.includes("mfa") ||
//           支部名.includes("MFA") ||
//           支部名.includes("博士")
//         )
//     )
//     .map(({ 支部名 }) => 支部名)
//     .join("\n")
// );
console.log(">> 推出 <<\n");
