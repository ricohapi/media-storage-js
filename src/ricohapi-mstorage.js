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
    this._RE_USERMETA = /^user\.([A-Za-z0-9_\-]{1,32})$/;
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
    if (param.filter) {
      return this._req({
        method: 'post',
        url: '/media/search',
        headers: { 'Content-Type': 'text/plain' },
        data: JSON.stringify({
          search_version: '2016-06-01',
          query: param.filter,
        }),
      });
    }
    const arr = [];
    if (param.after) arr.push(`after=${param.after}`);
    if (param.limit) arr.push(`limit=${param.limit}`);
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
        fs.writeFileSync(path, new Buffer(ret));
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

  meta(id, scope) {
    if (id === undefined) throw new Error('parameter error');

    if (scope === undefined) {
      const opt = {
        method: 'get',
        url: `/media/${id}/meta`,
      };
      return this._req(opt);
    }
    const match = this._RE_USERMETA.exec(scope);
    if (match) {
      const opt = {
        method: 'get',
        url: `/media/${id}/meta/user/${match[1]}`,
      };
      return this._req(opt);
    }
    if ((scope !== 'user') && (scope !== 'exif') && (scope !== 'gpano')) {
      throw new Error('parameter error');
    }
    const opt = {
      method: 'get',
      url: `/media/${id}/meta/${scope}`,
    };
    return this._req(opt);
  }

  addMeta(id, meta) {
    if (meta === undefined) throw new Error('parameter error');
    if (meta.length > 10) throw new Error('parameter error');

    const promises = [];
    Object.keys(meta).forEach(key => {
      const match = this._RE_USERMETA.exec(key);
      if (!match) throw new Error('parameter error');
      if (typeof meta[key] !== 'string') throw new Error('parameter error');
      const utf8len = encodeURIComponent(meta[key]).replace(/%../g, 'x').length;
      if ((utf8len === 0) || (utf8len > 1024)) throw new Error('parameter error');
      const opt = {
        method: 'put',
        url: `/media/${id}/meta/user/${match[1]}`,
        headers: { 'Content-Type': 'text/plain' },
        data: meta[key],
      };
      promises.push(this._req(opt));
    });
    return Promise.all(promises);
  }

  removeMeta(id, scope) {
    if (scope === undefined) throw new Error('parameter error');

    if (scope === 'user') {
      const opt = {
        method: 'delete',
        url: `/media/${id}/meta/user`,
      };
      return this._req(opt);
    }
    const match = this._RE_USERMETA.exec(scope);
    if (match) {
      const opt = {
        method: 'delete',
        url: `/media/${id}/meta/user/${match[1]}`,
      };
      return this._req(opt);
    }
    return Error('parameter error');
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
