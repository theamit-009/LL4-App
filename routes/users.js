var express = require('express');
var router = express.Router();
const pool = require('../db/dbConfig');
var passport = require('passport');
const ensureAuthenticated = require('../config/auth');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



router.get('/login',(request,response)=>{
  response.render('login');
})

router.post('/login',passport.authenticate('local', {
  successRedirect: '/users/dashboard',
  failureRedirect: '/users/login',
  failureFlash: true
}),(request,response)=>{
  const {email,password} = request.body;
  console.log('email : '+email+' passoword '+password);
  let errors = [];

  if (!email || !password) {
    errors.push({ msg: 'Please enter all fields' });
  }
  
  pool.query('SELECT Id,Name FROM salesforce.Contact',(error,result)=>{
    if(error){
      console.log('error');
    }
    console.log('Result Records '+JSON.stringify(result.rows));
  }) 

  if(errors.length >0 ){
    response.render('login',{errors})
  }
  else{
    //response.send('authentication is under process');
    request.flash('success_msg','Hello You are in dashboard !');
    response.redirect('/users/dashboard');
  }
  
}) 

router.get('/dashboard',(request,response)=>{
  if(request.isAuthenticated()){
    var name = request.user.name;
    var email = request.user.email;
    console.log('name in dashboard'+name);
    console.log('email in dashboard'+email);
    response.render('dashboard',{name:name,email:email});
  }
  else
  {
    request.flash('error_msg', 'Please log in first to proceed further !');
    response.redirect('/users/login');
  }
  
});

router.get('/forgotpassword',(request,response)=>{
  var verifyDiv = false;
  var sendOtpDiv = true;
  response.render('forgotpassword',{verifyDiv:verifyDiv,sendOtpDiv:sendOtpDiv});
});

router.get('/getemailforotp',(request,response)=>{
  var email = request.body.email;
  var verifyDiv = true;
  var sendOtpDiv = false;
  response.render('forgotpassword',{verifyDiv:verifyDiv,sendOtpDiv:sendOtpDiv});
});

router.get('/logout', (request, response) => {
  request.logout();
  request.flash('success_msg', 'You are logged out');
  response.redirect('/users/login');
});


module.exports = router;
