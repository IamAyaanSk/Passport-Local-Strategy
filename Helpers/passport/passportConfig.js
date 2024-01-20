const bcrypt = require("bcrypt");
const crypto = require("crypto");

const users = require("../../models/users");

const passportLocalAuthConfig = async (email, password, done) => {
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

const passportGoogleAuthConfig = async function (
  accessToken,
  refreshToken,
  profile,
  done
) {
  try {
    const findUser = users.find((user) => user.googleId === profile.id);
    const checkEmailExists = users.find(
      (user) => user.email === profile.emails[0].value
    );

    if (!findUser && checkEmailExists) {
      return done(null, false, {
        message: "User with email already Exists login with password",
      });
    }
    if (findUser) {
      return done(null, findUser);
    }

    if (!findUser) {
      const dummyPassword = await bcrypt.hash(crypto.randomUUID(), 10);
      const createUser = {
        id: crypto.randomUUID(),
        userName: profile.name.givenName,
        email: profile.emails[0].value,
        password: dummyPassword,
        profilePicture: profile.photos[0].value,
        googleId: profile.id,
      };

      users.push(createUser);

      done(null, createUser);
    }
  } catch (error) {
    done(error, false);
  }
};
module.exports = {
  passportLocalAuthConfig,
  passportGoogleAuthConfig,
};
