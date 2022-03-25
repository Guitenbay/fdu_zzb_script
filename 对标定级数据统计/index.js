// const { tree2tzzList } = require("../api");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

/**
 * 生成团支部对标定级表
 */
const BASIC = "../basic.xlsx";
const OUT = "./out.xlsx";

function readChart2JSON(filepath) {
  if (!fs.existsSync(filepath)) {
    console.log("Error: not file " + filepath);
    return {};
  }
  const data = XLSX.readFile(filepath);

  const dJson = XLSX.utils.sheet_to_json(data.Sheets[data.SheetNames[0]], {
    skipHeader: true,
  });
  return dJson
    .map((item) => {
      return {
        组织名称: item.组织名称,
        五星级: +item["五星级团（总）支部数量"],
        四星级: +item["四星级团（总）支部数量"],
      };
    })
    .filter(
      (item) =>
        (!item.组织名称.includes("团总支") &&
          item["五星级"] === 1 &&
          item["四星级"] === 0) ||
        (item["五星级"] === 0 && item["四星级"] === 1)
    );
}

function writeJSON2Chart(data) {
  console.log("生成 excel 表...\n");
  const basic = XLSX.readFile(path.resolve(__dirname, BASIC));

  basic.Sheets[basic.SheetNames[0]] = XLSX.utils.json_to_sheet(data, {
    header: ["团委名", "团总支名", "支部名", "星级"],
  });

  XLSX.writeFile(basic, path.resolve(__dirname, OUT));
  console.log("生成 out.xlsx;\n");
}

function findJsonFile(dir) {
  let files = fs.readdirSync(dir);
  return files
    .map(function (filename) {
      if (!filename.includes('.xlsx')) return [];
      let fPath = path.resolve(dir, filename);
      let stat = fs.statSync(fPath);
      if (stat.isDirectory() === true) {
        return findJsonFile(fPath);
      }
      if (stat.isFile() === true) {
        return fPath;
      }
    })
    .flat();
}

const dir = path.resolve(__dirname, `download`);

const excels = findJsonFile(dir);

const map = new Map();
excels.forEach((filename) => {
  const id = filename.replace(/^.*\/out_([^\/\.]+)\.xlsx$/, (_, p1) => p1);
  const json = readChart2JSON(filename);
  map.set(id, json);
});

// console.log(map);

function getFullName(list, name) {
  const res = list.find(({ leagueName }) => leagueName === name);
  return res ? res.leagueFullName : '未知';
}

function getStarList(tree, excludesLevel = []) {
  if (excludesLevel.includes(tree.leagueTypeId)) return [];
  const key =
    tree.leagueTypeId === "01TZB" || tree.leagueTypeId === "06BYBTZB"
      ? "支部名"
      : tree.leagueTypeId === "02TZZ"
      ? "团总支名"
      : tree.leagueTypeId === "03TW" || tree.leagueTypeId === "04TGW"
      ? "团委名"
      : "其他";
  if (!map.has(tree.leagueId)) return [];
  const DBDJ = map.get(tree.leagueId);
  const res = DBDJ.map((item) => {
    return {
      [key]: tree.leagueFullName,
      支部名: getFullName(tree.children, item.组织名称),
      星级: item.五星级 === 1 ? "五星级" : "四星级",
    };
  });
  // 如果有下级组织，继续查找
  if (Array.isArray(tree.children) && tree.children.length > 0) {
    const result = tree.children.map((tree) => {
      const list = getStarList(tree, excludesLevel);
      return list;
    });
    const list = result.flat();
    return res.concat(list.map((item) => ({ ...item, [key]: tree.leagueFullName })));
  } else {
    return res;
  }
}

const tzbTreeList = require("../tzb_tree/tzb_tree.json");
const treeList = tzbTreeList.map((tree) => {
  const list = getStarList(tree, ["01TZB", "06BYBTZB"]);
  return list;
});
const tzzList = treeList.flat();
console.log(tzzList.length);

// const result = [];

// let startIndex = 0;
// for (let i = startIndex; i < tzzList.length; i++) {
//   const filepath = path.resolve(dir, "out_" + tzzList[i].ID + ".xlsx");
//   const DBDJ = readChart2JSON(filepath);

//   // console.log(tzzList[i], DBDJ);

//   result.push.apply(result, (
//     DBDJ.map((item) => {
//       return {
//         ...tzzList[i],
//         支部名: item.组织名称,
//         星级: item.五星级 === 1 ? "五星级" : "四星级",
//       };
//     })
//   ));
//   console.log(
//     `${i + 1}/${(((i + 1) * 100) / tzzList.length).toFixed(2)}%: ${filepath}`
//   );
// }

writeJSON2Chart(tzzList);

console.log(">> 推出 <<\n");
// });
