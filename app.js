const path = require('path');

const express = require ('express');
const bodyParser = require ('body-parser');
const expressHbs =  require('express-handlebars');

const app = express();

app.set('view engine', 'ejs'); //hbs = handlebars , pug, ejs
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res, next) => {
    res.status(404).render('404', { pageTitle:'Page not found' })
})

app.listen(3300); //node will keep this running to listen for incomming req