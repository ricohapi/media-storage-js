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
          expect(RQStub.firstCall.args[0].url).to.have.string('/media?after=123');
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
          expect(RQStub.firstCall.args[0].url).to.have.string('/media?limit=321');
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
          expect(RQStub.firstCall.args[0].url).to.have.string('/media?after=123&limit=321');
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
