const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let PostModel = {};

const convertId = mongoose.Types.ObjectId;
const setBody = (body) => _.escape(body).trim();

const PostSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true,
    set: setBody,
  },

  likes: {
    type: Number,
    min: 0,
    required: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

PostSchema.statics.toAPI = (doc) => ({
  body: doc.body,
  likes: doc.likes,
  owner: doc.owner,
});

PostSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return PostModel.find(search).select('body likes').lean().exec(callback);
};

PostSchema.statics.findByPostId = async (postId) => {
  console.log(postId);
  return PostModel.findById(postId);
};

PostModel = mongoose.model('Post', PostSchema);

module.exports.PostModel = PostModel;
module.exports.PostSchema = PostSchema;
