const request = require('./request');

// export function getWXUserInfo() {
//   return request('get', '/api/fudan/wx/login');
// }

// export function getRankingList({ type }) {
//   return request('get', '/rank', { type });
// }

// export function playGame({ openid, type }) {
//   return request('post', '/play', { openid, type });
// }

// export function invite({ openid, code }) {
//   return request('post', '/invite', { openid, code });
// }

// export function getQuestion(token, page = 1, limit = 20) {
//   return request(
//     'get',
//     `/api/fudan/volunteer/exam/list?page=${page}&limit=${limit}`,
//     {},
//     token,
//   );
// }

// export function getScore({ openid, questionId, choice, costTime }) {
//   return request('post', '/score', { openid, questionId, choice, costTime });
// }

// export function getTeamInfo(page = 1, limit = 50) {
//   return request('get', `/api/fudan/volunteer/team/list?page=${page}&limit=${limit}`);
// }

function saveUserInfo({ username, mobile, userId, teamId }) {
  return request('post', '/api/fudan/volunteer/appuser/save', {
    username,
    mobile,
    userId,
    teamId,
  });
}

// export function saveAnswer({ userId, examAnswer, examId }, token) {
//   return request(
//     'post',
//     '/api/fudan/volunteer/answer/save',
//     [{ userId, examAnswer, examId }],
//     token,
//   );
// }

// export function personalRank(token) {
//   return request('post', '/api/fudan/volunteer/answer/personRank', {}, token);
// }

// export function teamRank(token) {
//   return request('post', '/api/fudan/volunteer/answer/teamRank', {}, token);
// }

module.exports = {
  saveUserInfo,
};
