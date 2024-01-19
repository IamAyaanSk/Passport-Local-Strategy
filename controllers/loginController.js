const loginController = (req, res) => {
  if (!req.isAuthenticated()) {
    res.render("login", { message: req.flash("error") });
    return;
  }
  res.redirect("/dashboard");
};

module.exports = loginController;
