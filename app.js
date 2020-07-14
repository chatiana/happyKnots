const path = require('path');
//3rd party modules
const express = require ('express');
const bodyParser = require ('body-parser');

const errorController = require('./controllers/error')

const app = express();

//View Engine Setup
app.set('view engine', 'ejs'); //hbs = handlebars , pug, ejs
app.set('views', 'views');

//routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
//const homeRoutes = require('./routes/index');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes); 
app.use(shopRoutes);
//app.use(homeRoutes);

// catch 404 and forward to error handler
app.use(errorController.get404);

app.listen(3000); //node will keep this running to listen for incomming req


