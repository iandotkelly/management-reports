# BitBrew Platform Management Reports

## Features

Currently this application will query the BitBrew production environment for all Tenants and devices and
output a CSV file of all devices, with the enabled status and last-communicated time.

## Dependencies

This application requires node.js version 8 or above.

## Install

```sh
$ git clone git@github.com:iandotkelly/management-reports
$ cd management-reports
$ npm install
```

At some point I'll package this so it can be installed and run from npm.

## Run

From within the installed directory

```sh
$ node index.js
```

The application will prompt you for username and password on the production environment.


Copyright (C) BitBrew Inc, 2019
