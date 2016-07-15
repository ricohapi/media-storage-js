const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;

const proxyquire = require('proxyquire');
const sinon = require('sinon');

const RQStub = sinon.stub().returns(
  Promise.resolve({
    data: {
      abc: 'def',
      body: 10,
    }
  })
);

const RQStubB = sinon.stub().returns(
  Promise.resolve({
    data: 3,
  })
);

const AXStub = sinon.stub().returns({
  request: RQStub,
  defaults: {},
});

const AuthClientStub = sinon.stub().returns({
  session: () => Promise.resolve({
    accessToken: 'atoken',
  }),
  getAccessToken: () => Promise.resolve('atoken2'),
});

const M = proxyquire('../src/ricohapi-mstorage', {
  'ricohapi-auth': {
    AuthClient: {
      SCOPES: {
        MStorage: 'scope1',
      },
    },
  },
  'axios': {
    create: AXStub,
  },
  'fs': {
    readFileSync: sinon.stub(),
    writeFile: sinon.stub(),
  },
});

const MStorage = M.MStorage;

beforeEach(() => {
  AuthClientStub.reset();
  AXStub.reset();
  RQStub.reset();
  RQStubB.reset();
});

describe('MStorage', () => {
  describe('constructor()', () => {
    it('success', () => {
      const a = new AuthClientStub();
      const m = new MStorage(a);
      expect(m._client).is.not.undefined;
    });
  });

  describe('connect()', () => {
    it('success', () => {
      const a = new AuthClientStub();
      const m = new MStorage(a);
      return m.connect()
        .then(() => {
          expect(m._token).has.string('atoken');
        });
    });

    it('state error', done => {
      const m = new MStorage();
      try {
        m.connect()
      } catch (e) {
        expect(e.toString()).to.have.string('state error');
        done();
      }
    });
  });

  describe('info()', () => {
    it('success', () => {
      const a = new AuthClientStub();
      const m = new MStorage(a);
      return m.connect()
        .then(() => m.info('id1'))
        .then(ret => {
          expect(RQStub.firstCall.args[0].method).to.have.string('get');
          expect(RQStub.firstCall.args[0].url).to.have.string('/media/id1');
          expect(ret.abc).to.have.string('def');
        });
    });

    it('parameter error', done => {
      const a = new AuthClientStub();
      const m = new MStorage(a);
      m.connect()
        .then(() => {
          try {
            m.info();
          } catch (e) {
            expect(e.toString()).to.have.string('parameter error');
            done();
          }
        });
    });
  });

  describe('meta()', () => {
    it('success', () => {
      const a = new AuthClientStub();
      const m = new MStorage(a);
      return m.connect()
        .then(() => m.meta('id1'))
        .then(ret => {
          expect(RQStub.firstCall.args[0].method).to.have.string('get');
          expect(RQStub.firstCall.args[0].url).to.have.string('/media/id1/meta');
          expect(ret.abc).to.have.string('def');
        });
    });

    it('success user', () => {
      const a = new AuthClientStub();
      const m = new MStorage(a);
      return m.connect()
        .then(() => m.meta('id1', 'user'))
        .then(ret => {
          expect(RQStub.firstCall.args[0].method).to.have.string('get');
          expect(RQStub.firstCall.args[0].url).to.have.string('/media/id1/meta/user');
          expect(ret.abc).to.have.string('def');
        });
    });

    it('success user.key', () => {
      const a = new AuthClientStub();
      const m = new MStorage(a);
      return m.connect()
        .then(() => m.meta('id1', 'user.key1'))
        .then(ret => {
          expect(RQStub.firstCall.args[0].method).to.have.string('get');
          expect(RQStub.firstCall.args[0].url).to.have.string('/media/id1/meta/user/key1');
          expect(ret.abc).to.have.string('def');
        });
    });

    it('success exif', () => {
      const a = new AuthClientStub();
      const m = new MStorage(a);
      return m.connect()
        .then(() => m.meta('id1', 'exif'))
        .then(ret => {
          expect(RQStub.firstCall.args[0].method).to.have.string('get');
          expect(RQStub.firstCall.args[0].url).to.have.string('/media/id1/meta/exif');
          expect(ret.abc).to.have.string('def');
        });
    });

    it('success gpano', () => {
      const a = new AuthClientStub();
      const m = new MStorage(a);
      return m.connect()
        .then(() => m.meta('id1', 'gpano'))
        .then(ret => {
          expect(RQStub.firstCall.args[0].method).to.have.string('get');
          expect(RQStub.firstCall.args[0].url).to.have.string('/media/id1/meta/gpano');
          expect(ret.abc).to.have.string('def');
        });
    });

    it('parameter error', done => {
      const a = new AuthClientStub();
      const m = new MStorage(a);
      m.connect()
        .then(() => {
          try {
            m.meta();
          } catch (e) {
            expect(e.toString()).to.have.string('parameter error');
            done();
          }
        });
    });


    it('parameter error(not user)', done => {
      const a = new AuthClientStub();
      const m = new MStorage(a);
      m.connect()
        .then(() => {
          try {
            m.meta('id1', 'tame');
          } catch (e) {
            expect(e.toString()).to.have.string('parameter error');
            done();
          }
        });
    });
  });


  describe('delete()', () => {
    it('success', () => {
      const a = new AuthClientStub();
      const m = new MStorage(a);
      return m.connect()
        .then(() => m.delete('id1'))
        .then(ret => {
          expect(RQStub.firstCall.args[0].method).to.have.string('delete');
          expect(RQStub.firstCall.args[0].url).to.have.string('/media/id1');
          expect(ret.abc).to.have.string('def');
        });
    });

    it('parameter error', done => {
      const a = new AuthClientStub();
      const m = new MStorage(a);
      m.connect()
        .then(() => {
          try {
            m.delete();
          } catch (e) {
            expect(e.toString()).to.have.string('parameter error');
            done();
          }
        });
    });
  });

  describe('addMeta()', () => {
    it('success', () => {
      const a = new AuthClientStub();
      const m = new MStorage(a);
      return m.connect()
        .then(() => m.addMeta('idx', { 'user.key1': 'value' }))
    });

    it('parameter error(key)', () => {
      const a = new AuthClientStub();
      const m = new MStorage(a);
      m.connect()
        .then(() => {
          try {
            m.addMeta('id1', { 'key1': 'val1' });
          } catch (e) {
            expect(e.toString()).to.have.string('parameter error');
            done();
          }
        });
    });

    it('parameter error', () => {
      const a = new AuthClientStub();
      const m = new MStorage(a);
      m.connect()
        .then(() => {
          try {
            m.addMeta('id2');
          } catch (e) {
            done();
          }
        });
    });

  });

  describe('removeMeta()', () => {
    it('success', () => {
      const a = new AuthClientStub();
      const m = new MStorage(a);
      return m.connect()
        .then(() => m.removeMeta('idx', 'user'))
        .then(ret => {
          expect(RQStub.firstCall.args[0].method).to.have.string('delete');
          expect(RQStub.firstCall.args[0].url).to.have.string('/media/idx/meta/user');
          expect(ret.abc).to.have.string('def');
        });
    });


    it('success with key', () => {
      const a = new AuthClientStub();
      const m = new MStorage(a);
      return m.connect()
        .then(() => m.removeMeta('idx', 'user.key'))
        .then(ret => {
          expect(RQStub.firstCall.args[0].method).to.have.string('delete');
          expect(RQStub.firstCall.args[0].url).to.have.string('/media/idx/meta/user/key');
          expect(ret.abc).to.have.string('def');
        });
    });

    it('parameter error', () => {
      const a = new AuthClientStub();
      const m = new MStorage(a);
      m.connect()
        .then(() => {
          try {
            m.removeMeta();
          } catch (e) {
            expect(e.toString()).to.have.string('parameter error');
            done();
          }
        });
    });

    it('parameter error(range)', () => {
      const a = new AuthClientStub();
      const m = new MStorage(a);
      m.connect()
        .then(() => {
          try {
            m.removeMeta('idxx');
          } catch (e) {
            expect(e.toString()).to.have.string('parameter error');
            done();
          }
        });
    });

    it('unsupported', () => {
      const a = new AuthClientStub();
      const m = new MStorage(a);
      m.connect()
        .then(() => {
          try {
            m.removeMeta('id11', 'exif');
          } catch (e) {
            expect(e.toString()).to.have.string('unsupported now');
            done();
          }
        });
    });
  });

  describe('list()', () => {
    it('success', () => {
      const a = new AuthClientStub();
      const m = new MStorage(a);
      return m.connect()
        .then(() => m.list())
        .then(ret => {
          expect(RQStub.firstCall.args[0].method).to.have.string('get');
          expect(RQStub.firstCall.args[0].url).to.have.string('/media');
          expect(ret.abc).to.have.string('def');
        });
    });

    it('success with after', () => {
      const a = new AuthClientStub();
      const m = new MStorage(a);
      return m.connect()
        .then(() => m.list({ after: '123' }))
        .then(ret => {
          expect(RQStub.firstCall.args[0].method).to.have.string('get');
          expect(RQStub.firstCall.args[0].url).to.have.string('/media');
          expect(RQStub.firstCall.args[0].params.after).to.have.string('123');
          expect(ret.abc).to.have.string('def');
        });
    });

    it('success with limit', () => {
      const a = new AuthClientStub();
      const m = new MStorage(a);
      return m.connect()
        .then(() => m.list({ limit: '321' }))
        .then(ret => {
          expect(RQStub.firstCall.args[0].method).to.have.string('get');
          expect(RQStub.firstCall.args[0].url).to.have.string('/media');
          expect(RQStub.firstCall.args[0].params.limit).to.have.string('321');
          expect(ret.abc).to.have.string('def');
        });

    });

    it('success with after&limit', () => {
      const a = new AuthClientStub();
      const m = new MStorage(a);
      return m.connect()
        .then(() => m.list({ after: '123', limit: '321' }))
        .then(ret => {
          expect(RQStub.firstCall.args[0].method).to.have.string('get');
          expect(RQStub.firstCall.args[0].url).to.have.string('/media');
          expect(RQStub.firstCall.args[0].params.after).to.have.string('123');
          expect(RQStub.firstCall.args[0].params.limit).to.have.string('321');
          expect(ret.abc).to.have.string('def');
        });
    });

    it('success with filter', () => {
      const a = new AuthClientStub();
      const m = new MStorage(a);
      return m.connect()
        .then(() => m.list({ filter: { 'k123': 'value' } }))
        .then(ret => {
          expect(RQStub.firstCall.args[0].method).to.have.string('post');
          expect(RQStub.firstCall.args[0].url).to.have.string('/media/search');
          expect(RQStub.firstCall.args[0].data.search_version).to.have.string("2016-07-08");
          expect(RQStub.firstCall.args[0].data.query.k123).to.have.string("value");
          expect(ret.abc).to.have.string('def');
        });
    });

  });

  describe('upload()', () => {
    it('success', () => {
      const a = new AuthClientStub();
      const m = new MStorage(a);
      return m.connect()
        .then(() => m.upload('a.jpg'))
        .then(ret => {
          expect(RQStub.firstCall.args[0].method).to.have.string('post');
          expect(RQStub.firstCall.args[0].url).to.have.string('/media');
          expect(RQStub.firstCall.args[0].headers['Content-Type']).to.have.string('image/jpeg');
          expect(ret.abc).to.have.string('def');
        });
    });

    it('parameter error', () => {
      const a = new AuthClientStub();
      const m = new MStorage(a);
      m.connect()
        .then(() => {
          try {
            m.upload();
          } catch (e) {
            expect(e.toString()).to.have.string('parameter error');
            done();
          }
        });
    });
  });

  describe('downloadTo()', () => {
    it('success', () => {
      const a = new AuthClientStub();
      const m = new MStorage(a);
      m._r.request = RQStubB;
      return m.connect()
        .then(() => m.downloadTo('id1', 'b.jpg'))
        .then(ret => {
          expect(RQStubB.firstCall.args[0].method).to.have.string('get');
          expect(RQStubB.firstCall.args[0].responseType).to.have.string('arraybuffer');
          expect(RQStubB.firstCall.args[0].url).to.have.string('/media/id1/content');
        });
    });
    it('parameter error', () => {
      const a = new AuthClientStub();
      const m = new MStorage(a);
      m.connect()
        .then(() => {
          try {
            m.downloadTo('12');
          } catch (e) {
            expect(e.toString()).to.have.string('parameter error');
            done();
          }
        });

    });
  });

  describe('download()', () => {
    it('success', () => {
      const a = new AuthClientStub();
      const m = new MStorage(a);
      m._r.request = RQStubB;
      return m.connect()
        .then(() => m.download('id1'))
        .then(ret => {
          expect(RQStubB.firstCall.args[0].method).to.have.string('get');
          expect(RQStubB.firstCall.args[0].responseType).to.have.string('stream');
          expect(RQStubB.firstCall.args[0].url).to.have.string('/media/id1/content');
        });
    });

    it('success for blob', () => {
      const a = new AuthClientStub();
      const m = new MStorage(a);
      m._r.request = RQStubB;
      return m.connect()
        .then(() => m.download('id1', 'blob'))
        .then(ret => {
          expect(RQStubB.firstCall.args[0].method).to.have.string('get');
          expect(RQStubB.firstCall.args[0].responseType).to.have.string('blob');
          expect(RQStubB.firstCall.args[0].url).to.have.string('/media/id1/content');
        });
    });

    it('parameter error', () => {
      const a = new AuthClientStub();
      const m = new MStorage(a);
      m.connect()
        .then(() => {
          try {
            m.download();
          } catch (e) {
            expect(e.toString()).to.have.string('parameter error');
            done();
          }
        });
    });
  });



});
