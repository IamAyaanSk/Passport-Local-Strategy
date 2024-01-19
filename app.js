const express = require("express");
const app = express();
const port = 3000;

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");

const {
  serialize,
  deserialize,
} = require("./Helpers/passport/serializeDeSerialize");
const passportAuthConfig = require("./Helpers/passport/passportConfig");

const loginController = require("./controllers/loginController");
const logoutController = require("./controllers/logoutController");
const registerController = require("./controllers/registerController");

const checkIsAuthenticated = require("./middlewares/checkIsAuthenticated");

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(flash());

app.use(
  session({
    secret: "my-super-secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({ usernameField: "email" }, passportAuthConfig));

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

app.get("/dashboard", checkIsAuthenticated, (req, res) => {
  res.render("dashboard", { userName: req.user.userName });
});

app.get("/logout", logoutController);

app.listen(port, () => console.log(`Server listening on Port ${port}`));
