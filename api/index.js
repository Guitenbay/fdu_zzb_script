const shell = require("shelljs");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

shell.config.silent = true;
const { COOKIE } = require("../COOKIE.json");

function wait(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

async function getAllTZBPersonNumberInfo(id, page) {
  await wait(2000);
  console.log(id, page, "GET TZB Person pending...");
  const json =
    shell.exec(`curl --location --request POST 'https://zhtj.youth.cn/v1/center/tuanyuantw/memberCountList' \
  --header 'Cookie: ${COOKIE}' \
  --form 'queryLeagueId="${id}"' \
  --form 'queryLeagueTypeId="03TW"' \
  --form 'page="${page}"'`).stdout;
  try {
    const resp = JSON.parse(json);
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
  const json =
    shell.exec(`curl --location --request POST 'https://zhtj.youth.cn/v1/center/tuanyuan/tglist' \
    --header 'Cookie: ${COOKIE}' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "curUserId": "ADFLwIE5jxMFbPwkW2fi8g==",
        "curLeagueId": "kewYH7OhwH7Lilh-efvOEQ==",
        "queryContent": "",
        "gender": "-1",
        "identityCardNo": "",
        "queryLeagueId": "${id}",
        "curPage": "1"
    }'`).stdout;
  // console.log(json);
  try {
    const resp = JSON.parse(json);
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
  const json =
    shell.exec(`curl --location --request POST 'https://zhtj.youth.cn/v1/center/tuanyuantw/list' \
    --header 'Cookie: ${COOKIE}' \
    --form 'queryLeagueId="${id}"' \
    --form 'queryLeagueTypeId="${typeId}"' \
    --form 'sectionName="first"'`).stdout;
  try {
    const resp = JSON.parse(json);
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
  await wait(2000);
  console.log(id, "GET TZBList pending...");
  const json =
    shell.exec(`curl --location --request POST 'https://zhtj.youth.cn/v1/center/getorgtree' \
    --header 'Cookie: ${COOKIE}' \
    --form 'queryLeagueId="${id}"'`).stdout;
  try {
    const resp = JSON.parse(json);
    if (resp.retCode === 1000) {
      const list = resp.results.leagueList;
      if (list === undefined) {
        console.log(`Error: ${id}`);
        return [];
      }
      return Promise.all(
        list.map(async ({ leagueId, leagueFullName, leagueTypeId }) => {
          if (
            leagueTypeId === "02TZZ" ||
            leagueTypeId === "03TW" ||
            leagueTypeId === "04TGW"
          ) {
            const nextList = await getAllTZBTreeList(leagueId);
            return {
              leagueId,
              leagueFullName,
              leagueTypeId,
              children: nextList,
            };
          } else {
            return {
              leagueId,
              leagueFullName,
              leagueTypeId,
            };
          }
        })
      );
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
  const json =
    shell.exec(`curl --location --request POST 'https://zhtj.youth.cn/v1/center/getorgtree' \
    --header 'Cookie: ${COOKIE}' \
    --form 'queryLeagueId="${id}"'`).stdout;
  try {
    const resp = JSON.parse(json);
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
      Cookie:
        "_csrf=EMo4XhBufA0yQTRlNdfjRdID6rritVtB; zhtjWeb_SessionName__=MTY0ODAzMzgzNXxOd3dBTkVOSU4wZElWVUUyUWs1RVNrNDNObE5LU1VGUFVreEdURTlVTXpkS1VrVklNMGxWV1UwelJVOVlOVVJMVEZwRFJrNVNTMEU9fDmxt4u8d5vR5YY71Iju2eYpUprQpd0KL6LmMbfkY67C; Hm_lpvt_969516094b342230ceaf065c844d82f3=1648033826; Hm_lvt_969516094b342230ceaf065c844d82f3=1648016191,1648019694,1648020881,1648033826; zhtj_cookie=91349450; __jsluid_h=9b6d3e1d8c0a2df81952dcbe07224599; __jsluid_s=1c5072aab9c54980551c7b7a0580b627; _csrf=EMo4XhBufA0yQTRlNdfjRdID6rritVtB",
    },
  };

  return axios(config)
    .then(function (response) {
      if (response.data.retCode === 1000) {
        // console.log(response.data.results);
        console.log("已登录");
        return true;
      } else {
        console.log(response.data.retMsg);
        return false;
      }
    })
    .catch(function (error) {
      console.log(error);
      return false;
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
