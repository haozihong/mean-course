const Post = require("../models/post");

exports.createPost = (req, res) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId,
  });
  post.save().then((createdPost) => {
    res.status(201).json({
      message: "Post added successfully.",
      post: {
        id: createdPost._id,
        title: createdPost.title,
        content: createdPost.content,
        imagePath: createdPost.imagePath,
      },
    });
  })
  .catch(err => {
    return res.status(500).json({ message: "Creating a post failed!" });
  });
};

exports.updatePost = (req, res) => {
  let imagePath = req.file
    ? req.protocol + "://" + req.get("host") + "/images/" + req.file.filename
    : req.body.imagePath;
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
  });
  // will update when both condition are matched
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(err => {
      return req.status(500).json({ message: "Couldn't update post!" });
    });
};

exports.getPosts = (req, res) => {
  const pageSize = Number(req.query.pagesize);
  const currentPage = Number(req.query.page);
  const postQuery = Post.find();
  if (pageSize && currentPage) {
    // this way may have performance issues for extremely large database
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  let postsCount;
  Post.estimatedDocumentCount().then((count) => {
    postsCount = count;
    return postQuery;
  })
  .then((documents) => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: documents,
      maxPosts: postsCount,
    });
  })
  .catch(err => {
    return res.status(500).json({ message: "Fetching posts failed!" })
  });
};

exports.getPost = (req, res) => {
  Post.findById(req.params.id).then((foundPost) => {
    if (foundPost) {
      res.status(200).json(foundPost);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  })
  .catch(err => {
    return res.status(500).json({ message: "Fetching posts failed!" })
  });
};

exports.deletePost = (req, res) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then((result) => {
    console.log(result);
    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Post deleted!" });
    } else {
      res.status(401).json({ message: "Not authorized!" });
    }
  })
  .catch(err => {
    return res.status(500).json({ message: "Fetching posts failed!" })
  });
};
