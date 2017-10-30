const axios = require('axios');

const dialogFlowConfig = require('../../configs/dialogFlow');

const sendMessage = (query, sessionId) => {
  let url = dialogFlowConfig.url;

  let headers = {
    'Authorization': `Bearer ${dialogFlowConfig.clientKey}`,
    'Content-Type': 'application/json; charset=utf-8'
  };

  let body = {
    sessionId: sessionId,
    lang: 'en',
    query: query
  };

  axios({
    url: url,
    method: 'post',
    headers: headers,
    data: body
  })
  .then(res => {
    console.log(res.data);
  })
  .catch(err => console.log(err));
}

module.exports = {
  sendMessage
};
