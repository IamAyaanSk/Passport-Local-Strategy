const bcrypt = require("bcrypt");
const users = require("../../models/users");

const passportAuthConfig = async (email, password, done) => {
  try {
    const findUser = users.find((user) => user.email === email);

    if (!findUser) {
      return done(null, false, {
        message: "User not found! Please Register",
      });
    }

    const comparePassword = await bcrypt.compare(password, findUser.password);

    if (!comparePassword) {
      return done(null, false, {
        message: "Email or Password is incorrect",
      });
    }

    const authenticatedUser = {
      id: findUser.id,
      userName: findUser.userName,
      email: findUser.email,
    };

    done(null, authenticatedUser);
  } catch (error) {
    done(error, false);
  }
};

module.exports = passportAuthConfig;
