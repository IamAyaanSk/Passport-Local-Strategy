const bcrypt = require("bcrypt");
const crypto = require("crypto");
const users = require("../models/users");

const registerController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400);
      req.flash("registerFlash", "Enter email and password");
      res.render("register", { message: req.flash("registerFlash") });
      return;
    }

    const findUser = users.find((user) => user.email === req.body.email);

    if (findUser) {
      res.status(400);
      req.flash("registerFlash", "Email already exist");
      res.render("register", { message: req.flash("registerFlash") });
      return;
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    users.push({
      id: crypto.randomUUID(),
      userName: req.body.userName,
      email: req.body.email,
      password: hashedPassword,
      profilePicture:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    });

    res.status(201);
    res.redirect("/login");
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

module.exports = registerController;
