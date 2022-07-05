const path = require("path");
const express = require('express');
const cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');
// Importing file-store module
const filestore = require("session-file-store")(session)

const app = express();
const approuter = require("./routes/approuter");
const authrouter = require("./routes/auth");

// set the view engine to ejs
app.set('view engine', 'ejs');
//set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.authenticate('session'));

//bind router
app.use((req,res,next)=>{ 
  console.log(req.method + ' / req.originalUrl: '+ req.originalUrl + ' / . redirect_url: ' + req.session.redirect_url + ' / req.query.redir: ' + req.query.redir);
  console.log('req.cookies.redirect_url: ' + req.cookies.redirect_url);
  console.log('req.sessionID: '+ req.sessionID);  
  console.log('req.isAuthenticated(): '+ req.isAuthenticated());
  res.locals.passport = req.session.passport;
  if (req.originalUrl==req.cookies.redirect_url) {
    req.cookies.redirect_url='/';
  }
  // req.session.redirect_url = req.cookies.redirect_url;
  // res.locals.redirect_url = req.session.redirect_url;
  console.log(req.session);
  next();
}); //logging

app.use('/', approuter);
app.use('/', authrouter);

// error for pages/uri not served by this app
app.use('/', (req, res, next) => {
  res.status(404);
  res.render('pages/error', { errorcode:"404", error: "Page Not Found !!!" });
});

//bind error handllers
app.use(logErrors);
app.use(clientErrorHandler);

const PORT = process.env.HTTP_PORT|5000;
app.listen(PORT);
console.log(`Server is listening on port ${PORT}`);

// --- Error Handingling functions ---

// --- 1. Generic Error Logging ---
function logErrors (err, req, res, next) {
  console.error(err.stack);
  next(err);
}

// --- 2. api/code error handler ---
function clientErrorHandler (err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' });
  }else if(err){
    res.status(500);
    res.render('pages/error', { errorcode:"500", error: err });
  }else {
    next(err);
  }
}

