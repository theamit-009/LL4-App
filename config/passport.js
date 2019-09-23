const LocalStrategy = require('passport-local').Strategy;
const pool = require('../db/dbConfig');


module.exports = function(passport) {
    passport.use(
      new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        // Match user
              console.log('email inside  passport:'+email);
              console.log('password inside passport  :'+password);
              pool.query('SELECT sfid,Name,Email,Password__c FROM salesforce.Contact WHERE Email =$1',[email],(error,result)=>{
                    if(error)
                        throw error;
                    console.log('result '+result);
                    if(result.rows.length == 0){
                        return done(null,false,{message:'This email is not registered !'})
                    }
                    else if(result.rows.length > 1){
                        if(result.rows[0].Password__c == password){
                            return done(null, {email: 'aim.amit9@gmail.com', name: 'Amit'});
                        }
                        else{
                            return done(null,false,{message:'Password is incorrect !'})
                        }
                    }
              })
              
      })
    );

    passport.serializeUser(function(user, done) {
    done(null, user);
    });

    passport.deserializeUser(function(user, done) {
      done(null, user);
  });
};
