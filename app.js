const express = require ('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const routesIndex = require ('./routes/index');
const usersIndex = require ('./routes/users');
const mongoose = require ('mongoose');
const flash = require ('connect-flash');
const session = require ('express-session');
const passport = require('passport');

//Passport config
require('./config/passport')(passport);

//DB config
const db = require ('./config/keys').MongoURI;

//Connect mongoose
mongoose.connect(db,{useNewUrlParser:true})
    .then(() => console.log('Mongodb connect...'))
    .catch(err => console.log(err));

//Bodyparser
app.use(express.urlencoded({extended:false}));

//Express Session
app.use(session({
    secret: '0secret',
    resave: true,
    saveUninitialized: true,
    // cookie: {secure: true}
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

//Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//EJS
app.use(expressLayouts);
app.set('view engine','ejs');


//Router
app.use('/', routesIndex);
app.use('/users', usersIndex);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log('Server started on port ${PORT}'));
