const XLSX = require("xlsx");
const path = require("path");

const BASIC = "../basic.xlsx";

function writeJSON2Chart(data, outputFile) {
  console.log("生成 excel 表...\n");
  const basic = XLSX.readFile(path.resolve(__dirname, BASIC));
  // const resultArr = data.reduce((acc, item) => {
  //   return acc.concat(
  //     item.tzbs.map((tzb) => ({ ...tzb, 二级团组织: item.tw }))
  //   );
  // }, []);

  basic.Sheets[basic.SheetNames[0]] = XLSX.utils.json_to_sheet(data, {
    // header: ["团委名", "团总支名", "支部名", "其他", "组织人数"],
    header: [],
  });

  XLSX.writeFile(basic, path.resolve(__dirname, outputFile));
  console.log(`生成 ${outputFile};\n`);
}

module.exports = {
  writeJSON2Chart,
};
