const path = require('path');
//3rd party modules
const express = require ('express');
const bodyParser = require ('body-parser');
const mongoose = require ('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);


const errorController = require('./controllers/error')
const User = require('./models/user');

//DB Connection
const MONGODB_URI = 'mongodb+srv://user_1:niceday20@cluster0.mdz56.mongodb.net/shop';

const app = express();
const store = new MongoDBStore({  //constant:store , constructor:MongoDBStore
  uri: MONGODB_URI,
  collection: 'sessions'
});

//View Engine Setup
app.set('view engine', 'ejs'); //hbs = handlebars , pug, ejs
app.set('views', 'views');

//routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store }) //session will not be saved in everyrequest.
);

//find user with Id
app.use((req, res, next) => {  //to pass these data to all of the rendered views
  if (!req.session.user) { //if no user store to a session, next. will only run if we have a session
    return next();
  }
  User.findById(req.session.user._id) //findById provided by mangoose
  .then(user => {
    //console.log("DISPLAY USERCART", user.cart);
   // if (!user.cart) {
   //   console.log("No cart.");
   //   user.cart = { items: [] };
   // }
     req.user = user; //storing mongoose model from session into req.user enables all mongoose model method to work
     next();
  })
  .catch((err) => console.log(err));
});

//middleware
app.use('/admin', adminRoutes); 
app.use(shopRoutes);
app.use(authRoutes);

// catch 404 and forward to error handler
app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    User.findOne().then(user =>{
      if(!user){
        const user = new User({
          name:'Tati',
          email: 'tati@mail.com',
          cart:{
            items:[]
          }
        });
        user.save();
      }
    });
     app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });



