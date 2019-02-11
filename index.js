/* eslint no-console: off, no-sync: off, import/no-nodejs-modules: off */

'use strict';

const inquirer = require('inquirer');
const ProgressBar = require('progress');
const prompt = inquirer.createPromptModule();
const auth = require('./lib/access-token');
const request = require('./lib/api-request');
const tenants = require('./lib/tenants');
const devices = require('./lib/devices');
const fs = require('fs');
const json2csv = require('json2csv').parse;

const environment = 'production';
const environmentPrefix = `https://management-api-us-east-1-${environment}.hub.bitbrew.com/v1`;

auth.setConfiguration({
  uriPrefix: environmentPrefix
});

request.setConfiguration({
  uriPrefix: environmentPrefix
});

prompt([{
    type: "input",
    name: "username",
    message: "Enter your production admin username"
  },{
    type: "password",
    name: "password",
    message: "Enter the password for this account"
  },{
    type: 'input',
    name: 'filename',
    message: 'Name the results file',
    default: 'output.csv'
  }]
).then(answers => {
    auth.getToken(answers).then(token => {
      console.log(`Successfully logged in to ${environment}`);
      request.setToken(token);

      tenants.getTenants().then(tenantList => {

        const bar = new ProgressBar(
          'Tenants processed :current :bar',
          { total: tenantList.length }
        );

        const promises = [];

        tenantList.forEach(tenant => {
          promises.push(devices.getDevices(tenant.name).then(result => {
            bar.tick();
            return result;
          }));
        });

        Promise.all(promises)
          .then(devicesData => writeCsv(answers.filename, devicesData));
      });
    }).catch(err => {
      console.err(`Failed to log in. Error ${err}`);
    });
});

function flattenDeviceData(devicesData) {
  const output = [];
  devicesData.forEach(tenantDevices => {
    tenantDevices.devices.forEach(device => {
      output.push({
        tenantId: tenantDevices.tenantId,
        deviceId: device.deviceId,
        enabled: device.enabled,
        lastCommunication: device.lastCommunication
      });
    });
  });
  return output;
}

function writeCsv(filename, devicesData) {
  const csvFields = ['tenantId', 'deviceId', 'enabled', 'lastCommunication'];
  const csvOpts = { csvFields };
  const csv = json2csv(flattenDeviceData(devicesData), csvOpts);
  console.log(`Results collected, writing results to ${filename}`);
  fs.writeFileSync(filename, csv);
}
