const axios = require('axios');

const BASE_URL = 'http://121.5.219.108';

const request = (method = 'GET', url = '', data = {}, token) => {
  let result;
  const path = BASE_URL + url;
  switch (method.toUpperCase()) {
    case 'GET':
      result = axios.get(path, {
        params: data,
        headers: token ? { token } : undefined,
      });
      break;
    default:
      result = axios({
        method,
        url: path,
        data,
        headers: token ? { token } : undefined,
      });
      break;
  }
  return result;
};

module.exports = request;
