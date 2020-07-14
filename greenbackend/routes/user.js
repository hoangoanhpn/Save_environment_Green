// const express = require('express');
// const router = express.Router();
//
// const UsersController = require('../controllers/userscontroller');
//
// const checkAuth = require('../auth/auth');
//
// router.route('/').get(UsersController.getUsers);
//
// router.route('/register').post(UsersController.newUser);
//
// router.route('/login').post(UsersController.loginUser);
//
// router.route('/login/forgotpassword')
//     .post(UsersController.forgotPasswordtoGmail);
//
// router.route('/login/forgotpassword/verify')
//     .post(UsersController.forgotPasswordCheck);
//
// router.route('/:userId')
//     .get(checkAuth, UsersController.getSpecificUser)
//     .put(checkAuth, UsersController.updateUser)
//     .delete(checkAuth, UsersController.deleteUser);
//
// router.route(':userId/location')
//     .get(checkAuth, UsersController.getLocation);
//
// router.route('/:userId/changepassword')
//     .post(checkAuth, UsersController.changePassword);
//
// router.route('/:userId/logout')
//     .get(checkAuth, UsersController.logoutUser);
//
// module.exports = router;