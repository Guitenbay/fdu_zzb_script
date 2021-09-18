const { extend } = require("umi-request");

const request = extend({
  timeout: 60000, // 6s * 10
});

const createHandleResponse = ({ retCode, retMsg, results }) => {
  console.log(results);
  if (retCode !== 1000) {
    if (console) console.error(retMsg ?? `获取 ${url} 数据失败`);
    return null;
  } else {
    return results ?? true;
  }
};

function getTWList(data, cookie) {
  return request
    .post("https://zhtj.youth.cn/v1/center/getorgtree", {
      data,
      requestType: "form",
      headers: {
        Cookie: cookie,
      },
    })
    .then(createHandleResponse);
}

module.exports = {
  getTWList,
  getTZBList,
};
