"use strict";
/* jshint node: true */

var mongoose = require("mongoose");

//Define the Mongoose Schema for a Comment.
const favoriteSchema = new mongoose.Schema({
  file_name: { type: String },
});
var userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  location: String,
  description: String,
  occupation: String,
  login_name: String,
  password: String,
  favourites: [favoriteSchema],
},
{ versionKey: false });

//Create a Mongoose Model for a User using the userSchema.
var User = mongoose.model("User", userSchema);

//Make this available to our application.
module.exports = User;
