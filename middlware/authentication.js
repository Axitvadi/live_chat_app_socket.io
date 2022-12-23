const isAuthentication = (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      res.redirect("/login");
    }
};
const isNotAuthentication = (req, res, next) => {
    if (!req.session.user) {
      next();
    } else {
      res.redirect("/chatpage");
    }
};

module.exports = { isAuthentication, isNotAuthentication };
