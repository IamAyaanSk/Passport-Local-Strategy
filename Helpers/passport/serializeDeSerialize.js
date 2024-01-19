const users = require("../../models/users");

const serialize = (authenticatedUser, done) => {
  const authenticatedUserId = authenticatedUser.id;
  done(null, authenticatedUserId);
};

const deserialize = (authenticatedUserId, done) => {
  const findUser = users.find((user) => user.id === authenticatedUserId);
  const authenticatedUser = {
    id: findUser.id,
    userName: findUser.userName,
    email: findUser.email,
  };
  done(null, authenticatedUser);
};

module.exports = {
  serialize,
  deserialize,
};
