const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split("Bearer ")[1];
    jwt.verify(token, "secret_this_should_be_longre");
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed" });
  }
};
