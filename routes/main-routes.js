const express = require('express');
const router = express.Router();
const { 
  midCheckUsersAuth,
  midCheckUserAuthRedirect
 } = require('../middleware');

const { 
  getUserRegister,
  postUserRegister,
  getUserLogin,
  postUserLogin,
  getUserLogOut,
  getUserHomeRedirect,
  getUserProfile,
  putEditProfile
} = require('../controllers/user-controller');

const {
  getAddCard,
  postAddCard,
  getEditCard,
  putEditCard,
  deleteCard,
  getViewCards
} = require('../controllers/card-controller');

const {
  getSets,
  getCreateSet,
  postCreateSet,
  getSet,
  getEditSet,
  postEditSet,
  deleteSet
} = require('../controllers/set-controller');


// GET / route
module.exports = router.get('/', (req, res) => {
  res.render('index', { bodyClass: 'index' });
});

// user route
router.get('/register', getUserRegister);
router.post('/register', postUserRegister);
router.get('/login', getUserLogin);
router.post('/login', postUserLogin);
router.get('/logout', getUserLogOut);
router.get('/home', midCheckUsersAuth, getUserHomeRedirect);
router.get('/home/:userID', midCheckUsersAuth, midCheckUserAuthRedirect, getSets);
router.get('/profile/:userID', midCheckUsersAuth, midCheckUserAuthRedirect, getUserProfile);
router.put('/profile/:userID', midCheckUsersAuth, midCheckUserAuthRedirect, putEditProfile);

// set routes
router.get('/create-set', midCheckUsersAuth, getCreateSet);
router.post('/create-set', midCheckUsersAuth, postCreateSet);
router.get('/set/:setID', midCheckUsersAuth, getSet);
router.get('/set/:setID/edit', midCheckUsersAuth, getEditSet);
router.post('/set/:setID/edit', midCheckUsersAuth, postEditSet);
router.delete('/set/:setID/delete', midCheckUsersAuth, deleteSet);

// card routes
router.get('/set/:setID/card/add', midCheckUsersAuth, getAddCard);
router.post('/set/:setID/card/add', midCheckUsersAuth, postAddCard);
router.get('/set/:setID/card/:cardID/edit', midCheckUsersAuth, getEditCard);
router.put('/set/:setID/card/:cardID/edit', midCheckUsersAuth, putEditCard);
router.delete('/set/:setID/card/:cardID/delete', midCheckUsersAuth, deleteCard);

// cards route
router.get('/set/:setID/cards', midCheckUsersAuth, getViewCards);