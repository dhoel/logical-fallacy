const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
    "userName": String,
    "googleId": {type:String, required:true},
    "accessToken": {type:String, required:true},
});

const User = mongoose.model('User', userSchema);

module.exports = User;
