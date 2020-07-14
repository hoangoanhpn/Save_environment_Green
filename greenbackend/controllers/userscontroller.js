// const User = require('../models/User');
// const Pets = require('../models/Pets');
// const Images = require('../models/Posts');
//
// const dotenv = require('dotenv');
// const config = dotenv.config();
//
// const crypto = require('crypto');
// const bcrypt = require('bcryptjs');
// const saltNumber = bcrypt.genSaltSync();
// const jwt = require('jsonwebtoken');
//
// const multer = require('multer');
//
// //Save to database, unlink with the path
// //const fs = require('fs');
// //const { promisify } = require('util');
// //const unlinkAsync = promisify(fs.unlink);
//
// const upload = require('../routes/upload');
//
// const nodemailer = require('nodemailer');
//
// const waterfall = require('async-waterfall');
//
// module.exports = {
//     getUsers: async (req, res, next) => {
//         try {
//             const user = await User.find().populate('pets', 'images');
//             if (user < 1) {
//                 return res.status(200).json({
//                     message: 'No user created'
//                 })
//             } else {
//                 return res.status(200).json({
//                     message: 'Pet Users: ',
//                     user: user
//                 });
//             }
//         } catch (err) {
//             console.log('Error ' + err);
//             res.status(400).json({
//                 message: err
//             });
//         }
//     },
//
//     newUser: async (req, res, next) => {
//         User.findOne({email: req.body.email})
//             .then(user => {
//                 if (user) {
//                     console.log('Mail exists, try another email');
//                     return res.status(200).json({
//                         type: 'fail',
//                         message: "Mail exists, try another email"
//                     });
//                 } else {
//                     const password = req.body.password;
//                     if (password !== req.body.confirmpassword) {
//                         console.log('Password doesn\'t match, please type again');
//                         res.status(200).json({
//                             type: 'fail',
//                             message: 'Password doesn\'t match, please type again'
//                         });
//                     } else {
//                             bcrypt.hash(password, saltNumber, (err, hash) => {
//                                 if (err) {
//                                     console.log(err);
//                                     return res.status(200).json({
//                                         type: 'fail',
//                                         error: err
//                                     });
//                                 } else {
//                                     const user = new User({
//                                         username: req.body.username,
//                                         email: req.body.email,
//                                         password: hash
//                                     });
//                                     user
//                                         .save()
//                                         .then(result => {
//                                             console.log(result);
//                                             res.status(200).json({
//                                                 type: 'success',
//                                                 message: "User created successfully"
//                                             });
//                                         })
//                                         .catch(err => {
//                                             console.log(err);
//                                             res.status(504).json({
//                                                 error: err
//                                             });
//                                         });
//                                 }
//                             })
//                     }
//                 }
//             });
//     },
//
//     loginUser: async (req, res, next) => {
//         User.findOne({email: req.body.email})
//             .then(user => {
//                 if (user < 1) {
//                     console.log('Auth failed because email inexisted');
//                     return res.status(200).json({
//                         type: 'fail',
//                         message: 'Auth failed because email inexisted'
//                     });
//                 }
//                 bcrypt.compare(req.body.password, user.password, (err, result) => {
//                     if (err) {
//                         console.log('Auth failed, cannot compare');
//                         return res.status(200).json({
//                             type: 'fail',
//                             message: 'Auth failed, cannot compare'
//                         });
//                     }
//                     if (result) {
//                         const token = jwt.sign({
//                             email: user.email,
//                             userId: user._id
//                         }, process.env.JWT_KEY, {
//                             expiresIn: '24h'
//                         });
//                         user.token = token;
//                         console.log('User token: ' + user.token);
//                         user.save();
//                         return res.status(200).json({
//                             type: 'success',
//                             message: 'Welcome ' + user.username,
//                             id: user._id,
//                             token: token
//                         });
//                     }
//                     console.log('Wrong password, try again');
//                     return res.status(200).json({
//                         type: 'fail',
//                         message: 'Wrong password, try again'
//                     });
//                 })
//             })
//             .catch(err => {
//                 console.log(err);
//                 res.status(500).json({
//                     error: err
//                 });
//             });
//     },
//
//     forgotPasswordtoGmail: async (req, res, next) => {
//         waterfall([
//             function(done) {
//                 crypto.randomBytes(3, (err, buf) => {
//                     if (err) throw err;
//                     const token = buf.toString('hex');
//                     done(err, token)
//                 });
//             },
//
//             function (token, done) {
//                 User.findOne({email: req.body.email}, function (err, user) {
//                     if (!user) {
//                         return res.status(200).json({
//                             type: 'fail',
//                             message: 'No account with that email address exists'
//                         });
//                     }
//                     user.resetToken = token;
//                     user.resetTokenExpires = Date.now() + 360000; //1 hour
//
//                     user.save(function (err) {
//                         done (err, token, user)
//                     });
//                 });
//             },
//
//             function (token, user, done) {
//                 const transporter = nodemailer.createTransport({
//                     service: 'Gmail',
//                     auth: {
//                         user: process.env.GMAIL_USER,
//                         pass: process.env.GMAIL_PASSWORD
//                     }
//                 });
//
//                 const mailOptions = {
//                     from: '17520631@gm.uit.edu.vn',
//                     to: user.email,
//                     subject: 'Renew your password !!',
//                     text: 'Your verify string: ' + token
//                 };
//                 transporter.sendMail(mailOptions, function (err, data) {
//                     if (err) {
//                         console.log('Error occurs: %s', err);
//                         return res.status(401).json({
//                             error: err
//                         });
//                     } else {
//                         console.log('Email sent to ' + user.email + '. Please check your mail please ..');
//                         return res.status(200).json({
//                             type: 'success',
//                             message: 'Email sent to ' + user.email + '. Please check your mail please ..'
//                         });
//                     }
//                 });
//             }
//         ]);
//     },
//
//     //P7X5lBxoaS00OVoxNWHwNj1Ry8ydsnPw
//     forgotPasswordCheck: async (req, res, next) => {
//         User.findOne({email: req.body.email})
//             .then(user => {
//                 if (user.resetToken === undefined || user.resetTokenExpires === undefined) {
//                     return res.status(200).json({
//                         type: 'fail',
//                         message: 'You haven\'t send any verification to renew your password'
//                     });
//                 } else {
//                     if (Date.now > user.resetTokenExpires) {
//                         user.resetToken = undefined;
//                         user.resetTokenExpires = undefined;
//                         user.save();
//                         return res.status(200).json({
//                             type: 'fail',
//                             message: 'Sorry, your token expired date has been out of date. Please send your verify notification through url http://localhost/user/login/forgotpassword'
//                         });
//                     } else {
//                         if (req.body.token === user.resetToken) {
//                             user.password = bcrypt.hashSync(req.body.newpassword, saltNumber);
//                             user.resetToken = undefined;
//                             user.resetTokenExpires = undefined;
//                             user.save();
//                             return res.status(200).json({
//                                 type: 'success',
//                                 message: 'Your password has been changed successfully'
//                             });
//                         } else {
//                             return res.json({
//                                 error: 'Your token is incorrect, check your mail again!!!'
//                             });
//                         }
//                     }
//                 }
//             });
//     },
//
//     getSpecificUser: async (req, res, next) => {
//         try {
//             const userFind = await User.findById(req.params.userId);
//             console.log(userFind);
//             res.status(200).json({
//                 type: 'success',
//                 profile: userFind
//             });
//         } catch (err) {
//             console.log(err);
//             res.status(500).json({message: err});
//         }
//     },
//
//     updateUser: async (req, res, next) => {
//         try {
//             const updateUser = await User.findByIdAndUpdate(req.params.userId, req.body);
//             updateUser.save();
//             console.log(updateUser);
//             res.status(200).json({
//                 type: 'success',
//                 message: 'Update succeed'
//             });
//         } catch (err) {
//             console.log(err);
//             res.status(200).json({
//                 message: err
//             });
//         }
//     },
//
//     deleteUser: async (req, res, next) => {
//         try {
//             let i = 0;
//             const user = await User.findById(req.params.userId);
//             const userRemovePets = user.pets;
//             for (i; i < userRemovePets.length; i++) {
//                 userRemovePets.splice(i, 1);
//             }
//             user.save();
//
//             //Delete pets in collection Pets
//             const pets = await Pets.find({owner: req.params.userId}).remove();
//             //Delete images in collection Images
//             const images = await Images.find({takenby: req.params.userId}).remove();
//
//             const userDelete = await User.remove({_id: req.params.userId});
//             res.json(userDelete);
//         } catch (err) {
//             res.json({Message: err});
//         }
//     },
//
//     changePassword: async (req, res, next) => {
//         try{
//             const changeUserPassword = await User.findById(req.params.userId);
//             const oldPassword = req.body.oldpassword;
//             const newPassword = req.body.newpassword;
//             const confirmnewPassword = req.body.confirmpassword;
//             if (await bcrypt.compareSync(oldPassword, changeUserPassword.password)) {
//                 if (newPassword === confirmnewPassword) {
//                     changeUserPassword.password = await bcrypt.hashSync(newPassword, saltNumber);
//                     changeUserPassword.save();
//                     console.log('Change password successfully');
//                     return res.status(200).json({
//                         type: 'success',
//                         message: 'Change password successful'
//                     })
//                 } else {
//                     console.log('New password does not match');
//                     return res.status(200).json({
//                         type: 'fail',
//                         message: 'New password does not match'
//                     });
//                 }
//             } else {
//                 console.log('Old password does not match');
//                 return res.status(200).json({
//                     type: 'fail',
//                     message: 'Old password does not match'
//                 });
//             }
//         }
//         catch (err) {
//             console.log(err);
//             res.status(400).json(err);
//         }
//     },
//
//     getLocation: async (req, res, next) => {
//       try {
//           const userLocation = await User.findById(req.params.userId);
//
//       }
//       catch (err) {
//           //Bao loi
//       }
//     },
//
//     logoutUser: async (req, res, next) => {
//         try {
//             const logoutUser = await User.findById(req.params.userId);
//             logoutUser.token = undefined;
//             logoutUser.save();
//             return res.status(200).json({
//                 type: 'success',
//                 message: 'Log out successfully'
//             });
//         } catch (err) {
//             console.log(err);
//             res.status(401).json({
//                 error: err
//             });
//         }
//     }
// };