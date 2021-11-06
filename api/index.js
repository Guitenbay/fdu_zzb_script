const shell = require("shelljs");

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
    } else return null;
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
  console.log(json);
  try {
    const resp = JSON.parse(json);
    if (resp.retCode === 1000) {
      return resp.results;
    } else return null;
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
  console.log(json);
  try {
    const resp = JSON.parse(json);
    if (resp.retCode === 1000) {
      return resp.results;
    } else return null;
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
          if (leagueTypeId === "02TZZ" || leagueTypeId === "03TW" || leagueTypeId === "04TGW") {
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
    } else return null;
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
    } else return null;
  } catch (e) {
    console.error(`Error: ${id}`);
    return null;
  }
}

module.exports = {
  wait,
  getAllTZBPersonNumberInfo,
  getAllTZBTreeList,
  getTWListByQueryLeagueId,
  getTGBListByQueryLeagueId,
  getTYListByQueryLeagueId,
};
