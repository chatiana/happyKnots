module.exports = (req, res, next) => {
  // make sure the user is logged in.
    if(!req.session.isLoggedIn){
        // redirect to login
        return res.redirect('/login')
      }
      next();
}


//middleware to handle admin loggin
/* module.exports = (roles) => {
  return (req, res, next) => {
      if (req.session.isLoggedIn) {
          if (roles.includes(req.user.role)) {
              return next();
          }
      }

      return res.redirect('/login')
  }

  In routes admin add:
  // users and admins can access route
  router.get('/products', isAuth(['user', 'admin']), adminController.getProducts);
 
  // only admins can access route
  router.get('/products', isAuth(['admin']), adminController.getProducts);
} */
