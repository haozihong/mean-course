const express = require("express");
const multer = require("multer");
const router = express.Router();

const Post = require("../models/post");
const checkAuth = require("../middleware/check-auth");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error("invalid mime type");
    cb(error, "backend/images"); // path relative to server.js file
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' +  ext);
  },
});

router.post(
  "/",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res) => {
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
    });
  }
);

router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res) => {
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
        if (result.nModified > 0) {
          res.status(200).json({ message: "Update successful!" });
        } else {
          res.status(401).json({ message: "Not authorized!" });
        }
      });
  }
);

router.get("/", (req, res) => {
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
  }).then((documents) => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: documents,
      maxPosts: postsCount,
    });
  });
});

router.get("/:id", (req, res) => {
  Post.findById(req.params.id).then((foundPost) => {
    if (foundPost) {
      res.status(200).json(foundPost);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then((result) => {
    console.log(result);
    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Post deleted!" });
    } else {
      res.status(401).json({ message: "Not authorized!" });
    }
  });
});

module.exports = router;
