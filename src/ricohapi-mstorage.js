'use strict';
/*
 * Copyright (c) 2016 Ricoh Company, Ltd. All Rights Reserved.
 * See LICENSE for more information
 */

const AuthClient = require('ricohapi-auth').AuthClient;
const rp = require('request-promise');
const fs = require('fs');
const httpsProxyAgent = require('https-proxy-agent');

const MSTORAGE_ENDPOINT = 'https://mss.ricohapi.com/v1/media';

class MStorage {

  _defaultOpt() {
    return this._client.getAccessToken()
      .then(token => Promise.resolve({
        method: 'GET',
        uri: MSTORAGE_ENDPOINT,
        headers: {
          'Authorization': 'Bearer ' + token,
        }
      }));
  }

  constructor(client, params) {
    this._client = client;

    let defaults = {};
    if (params && params.proxy) {
      defaults = { agent: httpsProxyAgent(params.proxy) };
    }
    this._r = rp.defaults(defaults);
  }

  connect() {
    if (this._client === undefined) throw new Error('state error: no client');

    return this._client.session(AuthClient.SCOPES.MStorage)
      .then(() => this._token = this._client.accessToken);
  }

  list(param) {
    return this._defaultOpt()
      .then(opt => {
        if (param) {
          if (param.after) {
            opt.uri = `${opt.uri}?after=${param.after}`;
            if (param.limit) {
              opt.uri = `${opt.uri}&limit=${param.limit}`;
            }
          } else if (param.limit) {
            opt.uri = `${opt.uri}?limit=${param.limit}`;
          }
        }
        return this._r(opt);
      });
  }

  upload(path) {
    if (path === undefined) throw new Error('parameter error');

    return this._defaultOpt()
      .then(opt => {
        opt.method = 'POST';
        opt.headers['Content-Type'] = 'image/jpeg';
        opt.body = fs.readFileSync(path);
        return this._r(opt);
      });
  }

  downloadTo(id, path) {
    if (id === undefined) throw new Error('parameter error');
    if (path === undefined) throw new Error('parameter error');

    return this._defaultOpt()
      .then(opt => {
        opt.uri = `${MSTORAGE_ENDPOINT}/${id}/content`;
        opt.encoding = null;
        opt.resolveWithFullResponse = true;
        return this._r(opt);
      })
      .then(ret => fs.writeFile(path, new Buffer(ret.body)));
  }

  info(id) {
    if (id === undefined) throw new Error('parameter error');

    return this._defaultOpt()
      .then(opt => {
        opt.uri = `${MSTORAGE_ENDPOINT}/${id}`;
        return this._r(opt);
      });
  }

  meta(id) {
    if (id === undefined) throw new Error('parameter error');

    return this._defaultOpt()
      .then(opt => {
        opt.uri = `${MSTORAGE_ENDPOINT}/${id}/meta`;
        return this._r(opt);
      });
  }

  delete(id) {
    if (id === undefined) throw new Error('parameter error');

    return this._defaultOpt()
      .then(opt => {
        opt.method = 'DELETE';
        opt.uri = `${MSTORAGE_ENDPOINT}/${id}`;
        return this._r(opt);
      });
  }
}

exports.MStorage = MStorage;
exports.AuthClient = AuthClient;
