const models = require('../models');

const { ForumPost } = models;

const makerPage = (req, res) => {
  ForumPost.PostModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), posts: docs });
  });
};

const makePost = (req, res) => {
  if (!req.body.body) {
    return res.status(400).json({ error: 'ERROR: Post requires text' });
  }
  /*
  let likes;
  if(!req.body.likes){
    likes = 0;
  } else {
    likes = req.body.likes;
  }*/

  const postData = {
    body: req.body.body,
    likes: req.body.likes,
    owner: req.session.account._id,
  };

  const newPost = new ForumPost.PostModel(postData);

  const postPromise = newPost.save();

  postPromise.then(() => res.json({ redirect: '/maker' }));

  postPromise.catch((err) => {
    console.log(err);
    // I believe this is the unique property error from the schema
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Same text error (fix this later)' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return postPromise;
};


const getPosts = (request, response) => {
  const req = request;
  const res = response;

  return ForumPost.PostModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ posts: docs });
  });
};

const likePost = async (req, res) => {
  const likedPost = await ForumPost.PostModel.findByPostId(req.body.id);

  likedPost.likes++;
  const savePromise = likedPost.save();
  savePromise.then(() => res.json({ body: likedPost.body, likes: likedPost.likes, owner: likedPost.owner }));

  savePromise.catch((err) => res.status(500).json({ err }));
};


module.exports.makerPage = makerPage;
module.exports.make = makePost;
module.exports.getPosts = getPosts;
module.exports.likePost = likePost;
