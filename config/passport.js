const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    if(user) return done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      if (err) return done(err);
      delete user._doc.password; 
      return done(null,user)
    });
  });

  passport.use(new LocalStrategy({
    usernameField:'email',
    passReqToCallback: true
  },async (req,email,password,done) => {

    console.log(email,password);
        User.findOne({email},(err,user) => {
          console.log("user", user);
            if(err) return done(err);
            if(!user) return done(null , false, req.flash('error','Please SingUp First'))
            return done(null,user)
        })}
  ))
};


