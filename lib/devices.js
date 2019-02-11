'use strict';

const request = require('./api-request');

const pageSize = 500;

function getAllDevices(tenant) {
  return new Promise(resolve => {
    getDevices(tenant, 1).then(devices => {
      getLastCommunications(tenant).then(comms => {
        resolve({
          tenantId: tenant,
          devices: mergeComms(devices, comms)
        });
      });
    });
  });
}

function outputMap(device) {
  return {
    deviceId: device.deviceId,
    enabled: device.enabled
  };
}

function mergeComms(devices, comms) {
  const merged = [];
  devices.forEach(device => {
    merged.push({
      deviceId: device.deviceId,
      enabled: device.enabled,
      lastCommunication: comms[device.deviceId] || ''
    });
  });
  return merged;
}

function getLastCommunications(tenant) {
  return new Promise(resolve => {
    request
      .get(`tenants/${tenant}/last-communications`)
      .then(response => {
        const devices = response.devices;
        const output = {};
        for (const property in devices) {
          if (devices.hasOwnProperty(property)) {
            output[property] = devices[property].timestamp;
          }
        }
        resolve(output);
      });
  });
}

function getDevices(tenant, pageNo, previousResults) {
  const results = previousResults || [];
  return new Promise(resolve => {
    request.get(`tenants/${tenant}/devices?pageNo=${pageNo}&pageSize=${pageSize}`).then(response => {
      const devices = response.devices.map(outputMap);
      if (!devices.length) {
        return resolve(results);
      }
      return resolve(getDevices(tenant, pageNo + 1, results.concat(devices)));
    });
  });
}

module.exports = {
  getDevices: getAllDevices,
  getLastCommunications
};
