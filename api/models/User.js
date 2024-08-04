const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  bio: { type: String },
  interests: { type: [String] }, // Array of strings for interests
  genderPreference: { type: String, required: true },
  minAgePreference: { type: Number, required: true },
  maxAgePreference: { type: Number, required: true },
});

module.exports = mongoose.model("User", UserSchema);
