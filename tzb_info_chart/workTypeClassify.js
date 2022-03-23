const { writeJSON2Chart } = require("./excel");
const path = require("path");

const classify_names = [
  "上海市复旦大学科研机构综合团委",
  "上海市复旦大学机关团总支",
  "上海市复旦大学复旦上医机关团支部",
  "上海市复旦大学出版社团支部",
  "上海市复旦大学中山医院团委",
  "上海市复旦大学华山医院团委",
  "上海市复旦大学儿科医院团委",
  "上海市复旦大学妇产科医院团委",
  "共青团复旦大学附属肿瘤医院委员会",
  "复旦大学附属眼耳鼻喉科医院团委",
];
function shouldClassify(name) {
  return classify_names.includes(name);
}

const workTypeClassify = () => {
  /**
   * 生成是否是职业青年团员人数表
   */

  const data = require("./tzb_list.json");

  const map = data
    .filter(({ 支部类型 }) => {
      return 支部类型 !== "06BYBTZB";
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
    .reduce((acc, item) => {
      if (!acc.has(item.二级组织名)) {
        acc.set(item.二级组织名, [0, 0]);
      }
      if (shouldClassify(item.二级组织名)) {
        if (
          item.支部名.includes("学生") ||
          item.支部名.includes("本科生") ||
          item.支部名.includes("硕") ||
          item.支部名.includes("研究生") ||
          item.支部名.includes("博") ||
          item.支部名.includes("规培生")
        ) {
          acc.set(item.二级组织名, [
            acc.get(item.二级组织名)[0] + item.组织人数,
            acc.get(item.二级组织名)[1],
          ]);
        } else {
          acc.set(item.二级组织名, [
            acc.get(item.二级组织名)[0],
            acc.get(item.二级组织名)[1] + item.组织人数,
          ]);
        }
      } else {
        acc.set(item.二级组织名, [
          acc.get(item.二级组织名)[0] + item.组织人数,
          acc.get(item.二级组织名)[1],
        ]);
      }
      return acc;
    }, new Map());

  const list = [];
  map.forEach((value, key) => {
    list.push({
      二级组织名: key,
      学生人数: value[0],
      职业青年人数: value[1],
    });
  });
  return list;
};

const list = workTypeClassify();

writeJSON2Chart(list, path.resolve(__dirname, "out-work-classify.xlsx"));
console.log(">> 推出 <<\n");

module.exports = {
  shouldClassify,
  workTypeClassify,
};
