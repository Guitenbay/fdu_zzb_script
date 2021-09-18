const shell = require("shelljs");
const XLSX = require("xlsx");
const { getTWList } = require("../api");
const fs = require("fs");

/**
 * 在这里更新 COOKIE
 */
const COOKIE =
  "_csrf=wYuhnn4MbRWBksEXXNxZezzi0bwj11it; zhtjWeb_SessionName__=MTYzMTk2MTAwN3xOd3dBTkVkRE56VTBSa296V2xRME16ZEtUREpTTTFReVVFbFZXVnBCVjFWUk1rNUlWRXRWVUZWWFYwSkdSMUJYVVZwUlFVUkNTa0U9fCw-grqi5u_N6J_bqMcQxzkk7xbIJ4B78QVS4wc1hinc; Hm_lpvt_969516094b342230ceaf065c844d82f3=1631957142; Hm_lvt_969516094b342230ceaf065c844d82f3=1631842643,1631842836,1631843063,1631843895; wdcid=61ea7f5b77adfe63; Hm_lpvt_6b6f156e3a29eb21f7b51188949a9d4d=1631363215; Hm_lvt_6b6f156e3a29eb21f7b51188949a9d4d=1631363199; zhtj_cookie=67313298; __jsluid_s=086b70fdda34cd697604cf9416f5374f";

shell.config.silent = true;
const BASIC = "./basic.xlsx";
const OUT = "./out.xlsx";

async function createChart() {
  const twsResp = await getTWList(
    {
      queryLeagueId: "kewYH7OhwH7Lilh-efvOEQ==",
    },
    COOKIE
  );

  const tws = twsResp.leagueList.map(({ leagueId, leagueName }) => ({
    twId: leagueId,
    tw: leagueName,
  }));

  fs.writeFileSync("./tws.json", JSON.stringify(tws));

  const json = await Promise.all(
    tws.map(async ({ twId, tw }) => {
      const tzbInfos = await getAllTZBInfo(twId, 1);
      return {
        tw,
        tzbs: tzbInfos,
      };
    })
  );

  console.log("查询完成，结果写入文件 tw_tzb.json...\n");
  fs.writeFileSync("./tw_tzb.json", JSON.stringify(json));
  console.log("写入完成;\n");
  return json;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

async function getAllTZBInfo(id, page) {
  await wait(2000);
  console.log(id, page, "pending...");
  // const formData = new FormData();
  // formData.append("queryLeagueId", id);
  // formData.append("queryLeagueTypeId", "03TW");
  // formData.append("page", page);
  // const tzbResp = await getTZBList(formData);
  const json =
    shell.exec(`curl --location --request POST 'https://zhtj.youth.cn/v1/center/tuanyuantw/memberCountList' \
  --header 'Cookie: ${COOKIE}' \
  --form 'queryLeagueId="${id}"' \
  --form 'queryLeagueTypeId="03TW"' \
  --form 'page="${page}"'`).stdout;
  const resp = JSON.parse(json);
  const tzbResp = resp.results;
  if (tzbResp.childMemberCompletionDegreeInfoList === null) {
    console.log(id, "break;");
    return [];
  } else {
    const nextList = await getAllTZBInfo(id, page + 1);
    return tzbResp.childMemberCompletionDegreeInfoList
      .map(({ leagueName, leagueMemberCount }) => ({
        支部名: leagueName,
        支部人数: leagueMemberCount,
      }))
      .concat(nextList);
  }
}

function readJSON2Chart(data) {
  console.log("生成 excel 表...\n");
  const basic = XLSX.readFile(BASIC);
  const resultArr = data.reduce((acc, item) => {
    return acc.concat(
      item.tzbs.map((tzb) => ({ ...tzb, 二级团组织: item.tw }))
    );
  }, []);

  basic.Sheets[basic.SheetNames[0]] = XLSX.utils.json_to_sheet(resultArr, {
    header: ["二级团组织", "支部名", "支部人数"],
  });

  XLSX.writeFile(basic, OUT);
  console.log("生成 out.xlsx;\n");
}

const data = createChart();
// const data = require("./tw_tzb.json");

readJSON2Chart(data);

console.log(">> 推出 <<\n");
