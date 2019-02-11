'use strict';

const FormData = require('form-data');
const axios = require('axios');

let uriPrefix = 'http://localhost:12451/v1';
let clientId = '0f1b01d3-36d2-4d28-9867-8e467c957b01';

function tokenUri() {
  return `${uriPrefix}/token`;
}

function setConfiguration(config) {
  uriPrefix = config.uriPrefix || uriPrefix;
  clientId = config.clientId || clientId;
}

function getToken(credentials) {
  const formData = new FormData();
  formData.append('grant_type', 'password');
  formData.append('username', credentials.username);
  formData.append('password', credentials.password);
  formData.append('client_id', clientId);

  return new Promise((resolve, reject) => {
    axios.post(tokenUri(), formData, {
      headers: formData.getHeaders()
    })
    .then((response) => {
      resolve(response.data.accessToken);
    })
    .catch((err) => {
      reject(`${err.response.status} ${err.response.statusText}`);
    });
  });
}

module.exports = {
  setConfiguration,
  getToken
};
