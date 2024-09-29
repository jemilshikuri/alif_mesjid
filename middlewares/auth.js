function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/admin/login');
  }
  
  module.exports = { isAuthenticated };
  