const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
  userName: String,
  questions: [],
  googleId: { type: String, required: true },
  accessToken: { type: String, required: true },
});

const questionSchema = mongoose.Schema({
  definition: { type: String, required: true },
  fallacy: { type: String, required: true },
  m: { type: Number, required: true },
});

userSchema.method.apiRepr = function () {
  return this.userName;
};

const User = mongoose.model('User', userSchema);
const Question = mongoose.model('Question', questionSchema);

module.exports = { User, Question };
