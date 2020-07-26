const path = require('path');
//3rd party modules
const express = require ('express');
const bodyParser = require ('body-parser');
const mongoose = require ('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require ('csurf'); //CSRF
const flash = require ('connect-flash');

const errorController = require('./controllers/error')
const User = require('./models/user');

//DB Connection
const MONGODB_URI = 'mongodb+srv://user_1:niceday20@cluster0.mdz56.mongodb.net/shop';

const app = express();
const store = new MongoDBStore({  //constant:store , constructor:MongoDBStore
  uri: MONGODB_URI,
  collection: 'sessions',
});
//CSRF
const csrfProtection = csrf();

//View Engine Setup
app.set('view engine', 'ejs'); //hbs = handlebars , pug, ejs
app.set('views', 'views');

//routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
//CSRF
app.use(csrfProtection);

//Connect-flash
app.use(flash());

//find user with Id
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});
//to pass these data to all of the rendered views
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

//middleware
app.use('/admin', adminRoutes); 
app.use(shopRoutes);
app.use(authRoutes);

// catch 404 and forward to error handler
app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true,  useUnifiedTopology: true })
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
