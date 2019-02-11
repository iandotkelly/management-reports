'use strict';

const request = require('./api-request');

function getTenants() {
  return new Promise(resolve => {
    request.get('tenants').then(data => {
      resolve(data.filter(tenant => tenant.enabled).map(tenant => ({
          name: tenant.name,
          properName: tenant.properName
      })));
    });
  });
}

module.exports = {
  getTenants
};
