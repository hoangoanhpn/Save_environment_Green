// const mongoose = require('mongoose');
//
// const Schema = mongoose.Schema;
//
// const PetUserSchema = new Schema({
//    username: String,
//     email: {type: String,
//         lowercase: true,
//         unique: true,
//         required: [true, "Không được bỏ trống"],
//         match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
//             index: true},
//     password: {type: String,
//         required: [true, "Không được bỏ trống"],
//         //match: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{8,})$/,
//         index: true},
//     birthday: String,
//     occupation: String,
//     phone: Number,
//     address: String,
//     token: String,
//     resetToken: String,
//     resetTokenExpires: Date,
//     gender: String,
//     vaccine: [{type: mongoose.Schema.Types.ObjectId, ref: 'Vaccine'}],
//     pets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pets' }],
//     comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comments'}],
//     posts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Posts'}]
// });
//
// const PetUser = mongoose.model('PetUsers', PetUserSchema);
//
// module.exports = PetUser;
