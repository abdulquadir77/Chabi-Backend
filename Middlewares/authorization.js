const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
  const token = req.headers?.authorization.split(" ")[1];
  if (token) {
    const decode = jwt.verify(token, "hush");
    if (decode) {
      const userID = decode.userID;
      req.body.userID = userID;
      next();
    } else {
      res.send("Please Login Again");
    }
  } else {
    res.send("Please Login Again");
  }
};

module.exports = authentication;
