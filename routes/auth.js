var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local');

const user = {username:"sudeep", email:"sudeep.ghag@gmail.com"};
const router = express.Router();

console.log('-----auth-----');

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

passport.use(new LocalStrategy((username, password, cb) => {
    console.log('-----auth----- passport.localstrategy');
    if (username!=user.username) {
        console.log('-----auth----- passport.localstrategy.username not matching');
        return cb(null, false, { message: 'Incorrect username or password.' });    
    }
    if (password!="letmein") { 
        console.log('-----auth----- passport.localstrategy.password not matching');
        return cb(null, false, { message: 'Incorrect username or password.' }); 
    }
    console.log('-----auth----- passport.localstrategy.username-password match found');
    return cb(null, user);
    }
));

passport.serializeUser(function(user, cb) {
    console.log('-----auth----- __passport.serializeUser__');
    console.log(user);
    process.nextTick(function() {
      cb(null, { id: user.email, username: user.username });
    });
});
  
passport.deserializeUser(function(user, cb) {
    console.log('-----auth----- __passport.deserializeUser');
    console.log(user);    
    process.nextTick(function() {
      return cb(null, user);
    });
});

router.post('/login/password', extractRedirectURL, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));


router.get('/logout', (req, res)=>{
    res.cookie('redirect_url', '/');
    req.session.destroy();
    res.redirect('/');    
});

function extractRedirectURL(req, res, next){
    res.cookie('redirect_url', req.session.redirect_url);
    next();
}//extractRedirectURL

module.exports = router;