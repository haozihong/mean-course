const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Post = require("./models/post");

mongoose
  .connect(
    "mongodb+srv://zh_wdb:i0rXZisJMqHEXgoC@cluster0-axrvi.mongodb.net/mean-guide?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection fail!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader("Access-Control-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

app.post("/api/posts", (req, res, next) => {
  // const post = req.body;
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  post.save();
  console.log(post);
  res.status(201).json({
    message: "Post added successfully.",
  });
});

app.get("/api/posts", (req, res, next) => {
  const posts = [
    {
      id: "aslkj123jfod",
      title: "First server-side post",
      content: "This is coming from the server.",
    },
    {
      id: "ekjas9819d",
      title: "Second server-side post",
      content: "This is coming from the server!",
    },
  ];
  res.status(200).json({
    message: "Posts fetched successfully!",
    posts: posts,
  });
});

module.exports = app;
