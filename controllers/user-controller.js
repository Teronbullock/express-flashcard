const { asyncHandler } = require('../lib/utils');
const Users = require('../models/users-model');


// get user register
module.exports.getUserRegister = (req, res, next) => {
  res.render('register', { route: 'register' });
};

// post user register
module.exports.postUserRegister = asyncHandler(
  async (req, res) => {
    const formData = {
      user_name: req.body.user_name,
      user_email: req.body.user_email,
      user_pass: req.body.user_pass,
    };

    if (
      formData.user_name &&
      formData.user_email &&
      formData.user_pass &&
      req.body.user_confirm_pass
    ) {
      // confirm that user typed same password twice
      if (formData.user_pass !== req.body.user_confirm_pass) {  
        let err = new Error('Passwords do not match.');
        err.status = 400;
        return next(err);
      }

      // use schema method to insert document into PSQL 
        await Users.create(formData);

        res.render('register', { userRegistered: 'yes' });

        console.log('User registered successfully.');
        return;

    } else {
      let err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    }
  }
);

// get user login
module.exports.getUserLogin = (req, res, next) => {
  res.render('login');
};


// post user login
module.exports.postUserLogin = asyncHandler( 
  async (req, res, next) => {

    if (req.body.user_name && req.body.user_pass) {
      Users.authenticate(
        req.body.user_name,
        req.body.user_pass,
        (error, user) => {

          if (error || !user) {
            const err = new Error('Wrong username or password.');
            err.status = 401;
            return next(err);
          } else {
            req.session.userID = user.ID;

            req.session.save((err) => {
              if (err) {
                console.log('Error saving session: ', err);
                return next(err);
              }
              console.log('User logged in successfully.');
              return res.redirect(`/home/${user.ID}`);
            });
            
          }
        }
      );
    
    } else {
      let err = new Error('Email and password are required.');
      err.status = 401;
      return next(err);
    }

  },
  'Error logging in: ',
  401
);


// get user logout
module.exports.getUserLogOut = (req, res, next) => {
  if (req.session) {
    // delete session obj
    req.session.destroy( (err) => {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });

  } 

};

// get user home redirect
module.exports.getUserHomeRedirect = asyncHandler(
  async (req, res, next) => {

    res.redirect(`/home/${req.session.userID}`);
  },
  'Error retrieving user data: ',
  500
);

// get user home
module.exports.getUserHome = asyncHandler(
  async (req, res, next) => {
    res.render('home', { route: 'home' });
  },
  'Error retrieving user data: ',
  500
);

// get user profile
module.exports.getUserProfile = asyncHandler(
  async (req, res, next) => {

    const user = await Users.findByPk(req.params.userID);
    const data = {
      user_name: user.user_name,
      user_email: user.user_email,
    };
  

    res.render('profile', data);
  },
  'Error retrieving user data: ',
  500
);

// put user profile
module.exports.putEditProfile = asyncHandler(
  async (req, res, next) => {
    const { email, old_password, password, confirm_password  } = req.body;
    const userID = req.params.userID;
    const formData = {};

    if (!email && !old_password && !password && !confirm_password) {
      const err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    }

    const user = await Users.findOne({ where: { ID: userID }}, { raw: true });
    const oldPasswordMath = Users.comparePassword(userID, old_password, user.user_pass);


    if (!oldPasswordMath ) {
      const err = new Error('Old password is incorrect.');
      err.status = 400;
      return next(err);
    }

 
    if (password !== confirm_password) {
      const err = new Error('Passwords do not match.');
      err.status = 400;
      return next(err);
    }

    formData.user_pass = password;
    formData.user_email = email;

    const updatedUser = await Users.update(formData, {
      where: { ID: userID }, 
      raw: true,
      individualHooks: true,
    });

  
    if (updatedUser[0] === 0) {
      const err = new Error('User not found.');
      err.status = 400;
      return next(err);
    } else {

      console.log('User updated successfully.');
      res.redirect(`/profile/${userID}`);
    }
    
    

  },
  'Error updating user data: ',
  500
);
