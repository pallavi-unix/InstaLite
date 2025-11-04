"use strict";

const mongoose = require("mongoose");

//Define the Mongoose Schema for a Comment.
const commentSchema = new mongoose.Schema({
  comment: String,
  date_time: { type: Date, default: Date.now },
  user_id: mongoose.Schema.Types.ObjectId,
},
{ versionKey: false });

const likesSchema = new mongoose.Schema({
  user_id: String,
});

const visibilitySchema = new mongoose.Schema({
  user_id: String,
});

//Define the Mongoose Schema for a Photo.
const photoSchema = new mongoose.Schema({
  file_name: String,
  date_time: { type: Date, default: Date.now },
  user_id: mongoose.Schema.Types.ObjectId,
  comments: [commentSchema],
  likes: [likesSchema],
  visibility: [visibilitySchema],
},
{ versionKey: false });

//Create a Mongoose Model for a Photo using the photoSchema.
const Photo = mongoose.model("Photo", photoSchema);

//Make this available to our application.
module.exports = Photo;
