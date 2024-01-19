const logoutController = (req, res) => {
  req.logOut((err) => {
    if (err) {
      res.status(500);
      res.send("Server Error!!!");
    }
    res.redirect("/login");
  });
};

module.exports = logoutController;
