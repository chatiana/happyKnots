const path = require('path');
//3rd party modules
const express = require ('express');
const bodyParser = require ('body-parser');
const mongoose = require ('mongoose');

const errorController = require('./controllers/error')
const User = require('./models/user');

const app = express();

//View Engine Setup
app.set('view engine', 'ejs'); //hbs = handlebars , pug, ejs
app.set('views', 'views');

//routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

//find user with Id
app.use((req, res, next) => {
  User.findById('5f1848443fc02a16c9d6f671')
  .then(user => {
    //console.log("DISPLAY USERCART", user.cart);
   // if (!user.cart) {
   //   console.log("No cart.");
   //   user.cart = { items: [] };
   // }
     req.user = user;
     next();
  })
  .catch((err) => console.log(err));
});

//middleware
app.use('/admin', adminRoutes); 
//app.use('/about', aboutRoutes); 
app.use(shopRoutes);
app.use(authRoutes);

// catch 404 and forward to error handler
app.use(errorController.get404);

mongoose
  .connect('mongodb+srv://user_1:niceday20@cluster0.mdz56.mongodb.net/shop?retryWrites=true&w=majority')
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



