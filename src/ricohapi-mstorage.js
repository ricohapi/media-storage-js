'use strict';
/*
 * Copyright (c) 2016 Ricoh Company, Ltd. All Rights Reserved.
 * See LICENSE for more information
 */

const AuthClient = require('ricohapi-auth').AuthClient;
const axios = require('axios');
const fs = require('fs');

class MStorage {

  _req(opt) {
    return new Promise((resolve, reject) => {
      this._client.getAccessToken()
        .then(token => {
          const ropt = opt;
          if (opt.headers) {
            ropt.headers.Authorization = `Bearer ${token}`;
          } else {
            ropt.headers = { Authorization: `Bearer ${token}` };
          }
          return this._r.request(ropt);
        })
        .then(ret => resolve(ret.data))
        .catch(reject);
    });
  }

  constructor(client, params) {
    this._client = client;

    const defaults = {
      baseURL: 'https://mss.ricohapi.com:443/v1',
    };
    if (params && params.agent) {
      defaults.agent = params.agent;
    }
    this._r = axios.create(defaults);
  }

  connect() {
    if (this._client === undefined) throw new Error('state error: no client');

    return this._client.session(AuthClient.SCOPES.MStorage)
      .then(result => {
        this._token = result.accessToken;
        return Promise.resolve();
      });
  }

  list(param) {
    if (!param) {
      return this._req({
        method: 'get',
        url: '/media',
      });
    }
    const arr = [];
    if (param.after) {
      arr.push(`after=${param.after}`);
    }
    if (param.limit) {
      arr.push(`limit=${param.limit}`);
    }
    return this._req({
      method: 'get',
      url: `/media?${arr.join('&')}`,
    });
  }

  download(id, type) {
    if (id === undefined) throw new Error('parameter error');
    const rtype = type || 'stream';

    const opt = {
      method: 'get',
      url: `/media/${id}/content`,
      responseType: rtype,
    };
    return this._req(opt);
  }

  downloadTo(id, path) {
    if (path === undefined) throw new Error('parameter error');

    const opt = {
      method: 'get',
      url: `/media/${id}/content`,
      responseType: 'arraybuffer',
    };
    return this._req(opt)
      .then(ret => {
        fs.writeFile(path, new Buffer(ret));
      });
  }

  upload(path) {
    if (path === undefined) throw new Error('parameter error');

    const opt = {
      method: 'post',
      url: '/media',
      headers: { 'Content-Type': 'image/jpeg' },
      data: fs.readFileSync(path),
    };
    return this._req(opt);
  }

  info(id) {
    if (id === undefined) throw new Error('parameter error');

    const opt = {
      method: 'get',
      url: `/media/${id}`,
    };
    return this._req(opt);
  }

  meta(id) {
    if (id === undefined) throw new Error('parameter error');

    const opt = {
      method: 'get',
      url: `/media/${id}/meta`,
    };
    return this._req(opt);
  }

  delete(id) {
    if (id === undefined) throw new Error('parameter error');

    const opt = {
      method: 'delete',
      url: `/media/${id}`,
    };
    return this._req(opt);
  }
}

exports.MStorage = MStorage;
exports.AuthClient = AuthClient;
