const user = require("../models/user");

exports.getLogin = (req, res, next) => {
 // const isLoggedIn = req.get('Cookie').split(';')[0].trim().split('=')[1];
  console.log(req.session.isLoggedIn);
    res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      isAuthenticated: false
    });
  };
 
  exports.postLogin = (req, res, next) => {
    user.findById('5f1848443fc02a16c9d6f671')
    .then(user => {
      req.session.isLoggedIn = true; //Expires=, Max-age=, Domain=, Secure, HttpOnly
      req.session.user = user;
      req.session.save(err => {
        console.log(err);
        res.redirect('/');
      });
    })
    .catch(err => console.log(err));
  };
  
  exports.postLogout = (req, res, next) => {
    req.session.destroy (() => {
     // console.log(err);
      res.redirect('/');
    });
  };

  exports.getRegister = (req, res, next) => {
     console.log(req.session.isLoggedIn);
       res.render('auth/register', {
         path: '/register',
         pageTitle: 'Register',
         isAuthenticated: false
       });
     };

     exports.postRegister = (req, res, next) => {
     }