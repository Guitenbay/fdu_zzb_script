const XLSX = require("xlsx");
// const { saveUserInfo } = require("./api");

const BASIC = "./basic.xlsx";
const DATA = "./data.xlsx";
const OUT = "./out.xlsx";

const basic = XLSX.readFile(BASIC);
const data = XLSX.readFile(DATA);

const dJson = XLSX.utils.sheet_to_json(data.Sheets[data.SheetNames[0]], {
  skipHeader: true,
});

const resultArr = [];

const dataList = dJson.map((item) => {
  return {
    姓名: item.姓名,
    青年大学习: item.青年大学习,
    本周参与的部门工作: item.本周参与的部门工作,
    本周是否参与培训: item.本周是否参与培训,
    本周工作收获与反思: item.本周工作收获与反思,
    工作参与度: item.工作参与度,
    工作效率: item.工作效率,
    工作态度: item.工作态度,
    // teamId: item.id,
    // username: item.姓名,
    // mobile: item.联系电话,
  };
});

// console.log(dataList);
// dataList.forEach((item) => {
//   saveUserInfo(item).then(() => {
//     console.log(`插入 ${JSON.stringify(item)}`);
//   });
// });

Object.entries(basic.Sheets).forEach(([key, value]) => {
  const bJson = XLSX.utils.sheet_to_json(value, { skipHeader: true });
  bJson.forEach((line, index, arr) => {
    dataList.forEach((item) => {
      if (item.姓名 === line.姓名) {
        arr[index] = {
          ...line,
          ...item,
        };
      }
    });
  });
  basic.Sheets[key] = XLSX.utils.json_to_sheet(bJson, {
    header: [
      "组别",
      "姓名",
      "青年大学习",
      "本周参与的部门工作",
      "本周是否参与培训",
      "本周工作收获与反思",
      "工作参与度",
      "工作效率",
      "工作态度",
    ],
  });
});

XLSX.writeFile(basic, OUT);

console.log(resultArr);
