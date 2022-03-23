// const shell = require("shelljs");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");

// shell.config.silent = true;
const { COOKIE } = require("../COOKIE.json");

function wait(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

async function getAllTZBPersonNumberInfo(id, page) {
  await wait(2000);
  console.log(id, page, "GET TZB Person pending...");
  const data = new FormData();
  data.append("queryLeagueId", id);
  data.append("queryLeagueTypeId", "03TW");
  data.append("page", page);

  const config = {
    method: "post",
    url: "https://zhtj.youth.cn/v1/center/tuanyuantw/memberCountList",
    headers: {
      Cookie: COOKIE,
      ...data.getHeaders(),
    },
    data: data,
  };

  try {
    const { data: resp } = await axios(config);
    if (resp.retCode === 1000) {
      const tzbResp = resp.results;
      if (tzbResp.childMemberCompletionDegreeInfoList === null) {
        console.log(id, "break;");
        return [];
      } else {
        const nextList = await getAllTZBPersonNumberInfo(id, page + 1);
        return tzbResp.childMemberCompletionDegreeInfoList
          .map(({ leagueName, leagueMemberCount }) => ({
            组织名: leagueName,
            组织人数: leagueMemberCount,
          }))
          .concat(nextList);
      }
    } else {
      console.log(json);
      return null;
    }
  } catch (e) {
    console.error(`Error: ${id}, page: ${page}`);
    return null;
  }
}

async function getTGBListByQueryLeagueId(id) {
  // await wait(2000);
  console.log(id, "GET TGBList pending...");
  const data = JSON.stringify({
    curUserId: "ADFLwIE5jxMFbPwkW2fi8g==",
    curLeagueId: "kewYH7OhwH7Lilh-efvOEQ==",
    queryContent: "",
    gender: "-1",
    identityCardNo: "",
    queryLeagueId: id,
    curPage: "1",
  });

  const config = {
    method: "post",
    url: "https://zhtj.youth.cn/v1/center/tuanyuan/tglist",
    headers: {
      Cookie: COOKIE,
      "Content-Type": "application/json",
    },
    data: data,
  };

  try {
    const { data: resp } = await axios(config);
    if (resp.retCode === 1000) {
      return resp.results;
    } else {
      console.log(json);
      return null;
    }
  } catch (e) {
    console.error(`Error: ${id}`);
    return null;
  }
}

async function getTYListByQueryLeagueId(id, typeId) {
  // await wait(2000);
  console.log(id, "GET TYList pending...");

  const data = new FormData();
  data.append("queryLeagueId", id);
  data.append("queryLeagueTypeId", typeId);
  data.append("sectionName", "first");

  var config = {
    method: "post",
    url: "https://zhtj.youth.cn/v1/center/tuanyuantw/list",
    headers: {
      Cookie: COOKIE,
      ...data.getHeaders(),
    },
    data: data,
  };

  try {
    const { data: resp } = await axios(config);
    if (resp.retCode === 1000) {
      return resp.results;
    } else {
      console.log(json);
      return null;
    }
  } catch (e) {
    console.error(`Error: ${id}, ${typeId}`);
    return null;
  }
}

async function getAllTZBTreeList(id) {
  // await wait(1000);
  console.log(id, "GET TZBList pending...");

  const data = new FormData();
  data.append("queryLeagueId", id);

  const config = {
    method: "post",
    url: "https://zhtj.youth.cn/v1/center/getorgtree",
    headers: {
      Cookie: COOKIE,
      ...data.getHeaders(),
    },
    data: data,
  };

  try {
    const { data: resp } = await axios(config);
    if (resp.retCode === 1000) {
      const list = resp.results.leagueList;
      if (list === undefined) {
        console.log(`Error: ${id}`);
        return [];
      }
      const result = [];
      for (const { leagueId, leagueFullName, leagueTypeId } of list) {
        if (
          leagueTypeId === "02TZZ" ||
          leagueTypeId === "03TW" ||
          leagueTypeId === "04TGW"
        ) {
          const nextList = await getAllTZBTreeList(leagueId);
          result.push(
            {
              leagueId,
              leagueFullName,
              leagueTypeId,
              children: nextList,
            }
          );
        } else {
          result.push({
            leagueId,
            leagueFullName,
            leagueTypeId,
          });
        }
      }
      return result;
    } else {
      console.log(json);
      return null;
    }
  } catch (e) {
    console.error(`Error: ${id}`);
    return null;
  }
}

async function getTWListByQueryLeagueId(id) {
  await wait(2000);
  console.log(id, "GET TWList pending...");

  const data = new FormData();
  data.append("queryLeagueId", id);

  const config = {
    method: "post",
    url: "https://zhtj.youth.cn/v1/center/getorgtree",
    headers: {
      Cookie: COOKIE,
      ...data.getHeaders(),
    },
    data: data,
  };

  try {
    const { data: resp } = await axios(config);
    if (resp.retCode === 1000) {
      return resp.results;
    } else {
      console.log(json);
      return null;
    }
  } catch (e) {
    console.error(`Error: ${id}`);
    return null;
  }
}

async function postLoginInfo() {
  const config = {
    method: "post",
    url: "https://zhtj.youth.cn/v1/center/leaguehome",
    headers: {
      Cookie: COOKIE,
    },
  };

  return axios(config)
    .then(function (response) {
      if (response.data.retCode === 1000) {
        // console.log(response.data.results);
        console.log("已登录");
        return [true, response.data.results];
      } else {
        console.log(response.data.retMsg);
        return [false, null];
      }
    })
    .catch(function (error) {
      console.log(error);
      return [false, null];
    });
}

async function downloadTyListExcel(id, filename) {
  console.log(id, "GET TYExcel pending...");
  const config = {
    method: "get",
    url: `https://zhtj.youth.cn/v1/center/tuanweiexportmembers/${id}`,
    headers: {
      Cookie: COOKIE,
    },
    responseType: "stream",
  };

  const filepath = path.resolve(__dirname, `../ty_info_chart/download/`);
  if (!fs.existsSync(filepath)) {
    fs.mkdirSync(filepath);
  }
  const writer = fs.createWriteStream(
    path.resolve(filepath, `${filename}.xlsx`)
  );
  const response = await axios(config);
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on("finish", () => {
      console.log(`写入 ${filename}.xlsx 完成;\n`);
      resolve(true);
    });
    writer.on("error", (e) => {
      console.error(
        `Error: ${id}\n > 手动下载： https://zhtj.youth.cn/v1/center/tuanweiexportmembers/${id}`
      );
      console.log(e);
      reject(false);
    });
  });
}

function tree2tzbList(tree) {
  if (Array.isArray(tree.children) && tree.children.length > 0) {
    const result = tree.children.map((tree) => {
      const list = tree2tzbList(tree);
      return list;
    });
    const list = result.flat();
    const key =
      tree.leagueTypeId === "02TZZ"
        ? "团总支名"
        : tree.leagueTypeId === "03TW" || tree.leagueTypeId === "04TGW"
        ? "团委名"
        : "其他";
    return list.map((item) => ({ ...item, [key]: tree.leagueFullName }));
  } else {
    if (tree.leagueId === undefined) {
      return [
        {
          ID: undefined,
          支部类型: tree.leagueTypeId,
          支部名: tree.leagueFullName,
          组织人数: "未知",
        },
      ];
    }
    return {
      ID: tree.leagueId,
      支部名: tree.leagueFullName,
      支部类型: tree.leagueTypeId,
      组织人数: undefined,
    };
  }
}

module.exports = {
  wait,
  getAllTZBPersonNumberInfo,
  getAllTZBTreeList,
  getTWListByQueryLeagueId,
  getTGBListByQueryLeagueId,
  getTYListByQueryLeagueId,
  postLoginInfo,
  downloadTyListExcel,
  tree2tzbList,
};
