const express = require("express");
const app = express();
const port = 3000;

require("dotenv").config();

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const flash = require("connect-flash");

const {
  serialize,
  deserialize,
} = require("./Helpers/passport/serializeDeSerialize");
const {
  passportLocalAuthConfig,
  passportGoogleAuthConfig,
} = require("./Helpers/passport/passportConfig");

const loginController = require("./controllers/loginController");
const logoutController = require("./controllers/logoutController");
const registerController = require("./controllers/registerController");

const checkIsAuthenticated = require("./middlewares/checkIsAuthenticated");

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(flash());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy({ usernameField: "email" }, passportLocalAuthConfig)
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    passportGoogleAuthConfig
  )
);

passport.serializeUser(serialize);

passport.deserializeUser(deserialize);

app.get("/", (req, res) => {
  res.redirect("/dashboard");
});

app.get("/register", (req, res) => {
  res.render("register", { message: req.flash("registerFlash") });
});

app.post("/register", registerController);

app.get("/login", loginController);

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/dashboard",
    failureFlash: true,
  })
);

app.get("/dashboard", checkIsAuthenticated, (req, res) => {
  res.render("dashboard", { user: req.user });
});

app.get("/logout", logoutController);

app.listen(port, () => console.log(`Server listening on Port ${port}`));
