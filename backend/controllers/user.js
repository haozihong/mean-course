const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.createUser = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: "User created!",
          })
        })
        .catch(err => {
          res.status(500).json({
            message: "Invalid authentication credentials!",
          });
        });
    });
};

exports.userLogin = (req, res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed! (User doesn't exist)"
        });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(result => {
          if (!result) {
            return res.status(401).json({
              message: "Auth failed! (Incorrect password)"
            });
          }
          const token = jwt.sign(
            { email: user.email, userId: user._id },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
          );
          res.status(200).json({
            token: token,
            expiresIn: 3600,
            userId: user._id,
          });
        });
    })
    .catch(err => {
      return res.status(401).json({ message: "Invalid authentication credentials!" });
    });
};
