const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const BASIC = "../basic.xlsx";

const base_path = path.join(".", "data");
const files = fs.readdirSync(base_path);
const excels = files
  .map((file) => {
    if (file === ".DS_Store") return [];
    return {
      academy: file,
      excels: readExcel(path.join(base_path, file)),
    };
  })
  .flat();
// console.log(JSON.stringify(excels));
// const json = excels
//   .map(({ academy, excels }) =>
//     excels.map((excel) => ({ ...excel, 团委名: academy }))
//   )
//   .flat();
// writeJSON2Chart(json, "out.xlsx");

function writeJSON2Chart(data, outputFile) {
  console.log("生成 excel 表...\n");
  const basic = XLSX.readFile(path.resolve(__dirname, BASIC));

  basic.Sheets[basic.SheetNames[0]] = XLSX.utils.json_to_sheet(data, {
    header: ["团委名", "文件名", "行数"],
  });

  XLSX.writeFile(basic, path.resolve(__dirname, outputFile));
  console.log(`生成 ${outputFile};\n`);
}

function readExcel(dirname) {
  const files = fs.readdirSync(dirname);
  return files
    .map((file) => {
      if (file === ".DS_Store") return [];
      const filepath = path.join(dirname, file);
      const state = fs.lstatSync(filepath);
      if (state.isDirectory()) {
        return readExcel(filepath);
      } else {
        if (file.endsWith(".xlsx")) {
          const basic = XLSX.readFile(filepath);
          const rows = XLSX.utils.sheet_to_json(
            basic.Sheets[basic.SheetNames[0]],
            {
              header: 2,
            }
          );
          console.log(rows.length);
          return {
            文件名: file.split(".xlsx")[0],
            行数: rows.length - 1,
          };
        }
        return [];
      }
    })
    .flat();
}
