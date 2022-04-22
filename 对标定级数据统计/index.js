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
  return dJson.map((item) => {
    return {
      组织名称: item.组织名称,
      star5: +item["五星级团（总）支部数量"],
      star4: +item["四星级团（总）支部数量"],
      star3: +item["三星级团（总）支部数量"],
      star2: +item["后进团（总）支部数量"],
      star1: +item["软弱涣散团（总）支部数量"],
      评价数: +item["已开展自评的团（总）支部数量"],
    };
  });
}

function writeJSON2Chart(data, filepath) {
  console.log("生成 excel 表...\n");
  const basic = XLSX.readFile(path.resolve(__dirname, BASIC));

  basic.Sheets[basic.SheetNames[0]] = XLSX.utils.json_to_sheet(data, {
    header: [],
  });

  XLSX.writeFile(basic, path.resolve(__dirname, filepath));
  console.log(`生成 ${filepath};\n`);
}

function findJsonFile(dir) {
  let files = fs.readdirSync(dir);
  return files
    .map(function (filename) {
      if (!filename.includes(".xlsx")) return [];
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

function getObjectByName(list, name) {
  return list.find(({ leagueName }) => leagueName === name);
}
function getSelfStar(starStr, self, childrenList) {
  return (
    self[starStr] - childrenList.reduce((acc, item) => acc + item[starStr], 0)
  );
}
function getTitleByTypeId(leagueTypeId) {
  return leagueTypeId === "01TZB" || leagueTypeId === "06BYBTZB"
    ? "支部名"
    : leagueTypeId === "02TZZ"
    ? "团总支名"
    : leagueTypeId === "03TW" || leagueTypeId === "04TGW"
    ? "团委名"
    : "其他";
}

function getChildrenStarList(tree, excludesLevel = []) {
  if (excludesLevel.includes(tree.leagueTypeId)) return [];
  const key = getTitleByTypeId(tree.leagueTypeId);
  if (!map.has(tree.leagueId)) return [];
  const DBDJ = map.get(tree.leagueId);
  return DBDJ.map((item) => {
    const selfTree = getObjectByName(tree.children, item.组织名称);
    const selfKey = getTitleByTypeId(selfTree.leagueTypeId);
    let selfStar5 = 0;
    let selfStar4 = 0;
    let selfStar3 = 0;
    let selfStar2 = 0;
    let selfStar1 = 0;
    if (item.评价数 > 1) {
      const childrenStarList = getChildrenStarList(selfTree, excludesLevel);
      selfStar5 = getSelfStar("star5", item, childrenStarList);
      selfStar4 = getSelfStar("star4", item, childrenStarList);
      selfStar3 = getSelfStar("star3", item, childrenStarList);
      selfStar2 = getSelfStar("star2", item, childrenStarList);
      selfStar1 = getSelfStar("star1", item, childrenStarList);
      return [
        {
          ...item,
          [key]: tree.leagueFullName,
          [selfKey]: selfTree.leagueFullName,
          type: selfTree.leagueTypeId,
          组织简称: item.组织名称,
          selfStar5,
          selfStar4,
          selfStar3,
          selfStar2,
          selfStar1,
        },
      ].concat(
        childrenStarList.map((item) => {
          if (item[key] !== undefined) return item;
          return { ...item, [key]: tree.leagueFullName };
        })
      );
    } else {
      selfStar5 = item.star5;
      selfStar4 = item.star4;
      selfStar3 = item.star3;
      selfStar2 = item.star2;
      selfStar1 = item.star1;
      return {
        ...item,
        [key]: tree.leagueFullName,
        [selfKey]: selfTree.leagueFullName,
        type: selfTree.leagueTypeId,
        组织简称: item.组织名称,
        selfStar5,
        selfStar4,
        selfStar3,
        selfStar2,
        selfStar1,
      };
    }
  }).flat();
}

const tzbTree = require("../tzb_tree/tzb_tree.json");
const treeList = getChildrenStarList(tzbTree, ["01TZB", "06BYBTZB"]);
const tzzList = treeList.flat();
console.log("参评组织数:", tzzList.length);

const filtered = tzzList.filter((item) => {
  if (item.selfStar5 === 1 || item.selfStar4 === 1) {
    return true;
  } else {
    return false;
  }
});
console.log("五星/四星组织数:", filtered.length);
const result = filtered.map((item) => ({
  团委名: item.团委名,
  团总支名: item.团总支名,
  支部名: item.支部名,
  组织简称: item.组织简称,
  星级: item.selfStar5 === 1 ? "五星级" : "四星级",
}));

const collegeFiveMap = new Map();
const collegeFourMap = new Map();
tzbTree.children.forEach(({ leagueFullName }) => {
  if (!collegeFiveMap.has(leagueFullName)) {
    collegeFiveMap.set(leagueFullName, 0);
  }
  if (!collegeFourMap.has(leagueFullName)) {
    collegeFourMap.set(leagueFullName, 0);
  }
});
for (const { 团委名, 星级 } of result) {
  if (!collegeFiveMap.has(团委名)) {
    collegeFiveMap.set(团委名, 0);
  }
  if (星级 === "五星级") {
    collegeFiveMap.set(团委名, collegeFiveMap.get(团委名) + 1);
    continue;
  }
  if (!collegeFourMap.has(团委名)) {
    collegeFourMap.set(团委名, 0);
  }
  if (星级 === "四星级") {
    collegeFourMap.set(团委名, collegeFourMap.get(团委名) + 1);
    continue;
  }
}
const collegeFiveList = [];
collegeFiveMap.forEach((value, key) => {
  collegeFiveList.push({
    团委名: key,
    五星级团组织数量: value,
  });
});

const collegeFourList = [];
collegeFourMap.forEach((value, key) => {
  collegeFourList.push({
    团委名: key,
    四星级团组织数量: value,
  });
});

// writeJSON2Chart(result, "./out.xlsx");

writeJSON2Chart(collegeFiveList, "./out_五星级团组织.xlsx");

writeJSON2Chart(collegeFourList, "./out_四星级团组织.xlsx");

console.log(">> 推出 <<\n");
// });
