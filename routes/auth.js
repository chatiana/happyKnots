const express = require('express');

const authController = require('../controllers/auth');
//middleware to protect routes
const isAuth = require('../middleware/is-auth'); 

const router = express.Router();

router.get('/userdash', isAuth, authController.getUserDash);

router.get('/login', authController.getLogin);
router.get('/register',  authController.getRegister);
router.get('/reset', authController.getReset);

router.post('/login',  authController.postLogin);
router.post('/register',  authController.postRegister);
router.post('/logout',  authController.postLogout);
router.post('/reset',  authController.postReset);

module.exports = router;
