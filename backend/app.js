const express = require('express'),
      app = express();

app.use('/api/posts', (req, res, next) => {
  const posts = [
    { id: 'aslkj123jfod',
      title: 'First server-side post',
      content: 'This is coming from the server.'
    },
    { id: 'ekjas9819d',
      title: 'Second server-side post',
      content: 'This is coming from the server!'
    }
  ];
  res.status(200).json({
    message: 'Posts fetched successfully!',
    posts: posts
  });
});


module.exports = app;
