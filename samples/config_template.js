// application setting
const CONFIG = {
  clientId: '',
  clientSecret: '',
  params: {},
};

// user information
const USER = {
  userId: '',
  userPass: '',
};

if (typeof window === 'undefined') {
  module.exports.CONFIG = CONFIG;
  module.exports.USER = USER;
}
