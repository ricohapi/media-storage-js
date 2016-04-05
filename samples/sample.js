'use strict';
/*
 * Copyright (c) 2016 Ricoh Company, Ltd. All Rights Reserved.
 * See LICENSE for more information
 */

const AuthClient = require('../src/ricohapi-mstorage').AuthClient;
const MStorage = require('../src/ricohapi-mstorage').MStorage;
const CONFIG = require('./config').CONFIG;

const client = new AuthClient(CONFIG.clientId, CONFIG.clientSecret, CONFIG.params);
client.setResourceOwnerCreds(CONFIG.userId, CONFIG.userPass);
const mstorage = new MStorage(client, CONFIG.params);
mstorage.connect()
  .then(() => {
    console.log('connect completed');
    return mstorage.list();
  })
  .then(list => {
    console.log(list);
  })
  .then(() => console.log('finished'))
  .catch(e => console.log(e))
