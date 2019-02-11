'use-strict';

const axios = require('axios');

let uriPrefix = 'http://localhost:12451/v1';
let accessToken = "";

function setConfiguration(config) {
  uriPrefix = config.uriPrefix || uriPrefix;
}

function setToken(newToken) {
  accessToken = `Bearer ${newToken}`;
}

function post(path, body) {
  return new Promise(resolve => {
    axios.post(`${uriPrefix}/${path}`, body, {
      headers: {
        Authorization: accessToken
      }
    }).then(response => resolve(response.data));
  });
}

function get(path) {
  return new Promise(resolve => {
    axios.get(`${uriPrefix}/${path}`, {
      headers: {
        Authorization: accessToken
      }
    }).then(response => resolve(response.data));
  });
}

module.exports = {
  setConfiguration,
  setToken,
  get,
  post
};
