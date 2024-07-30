const { Schema, model } = require("mongoose");
const CommentSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  likes: [{ type: Schema.Types.ObjectId }],
});

const PostSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  myFile: String,
  comments: [CommentSchema],
  likes: [{ type: Schema.Types.ObjectId }],
});

const post = model("post", PostSchema);

module.exports = post;
