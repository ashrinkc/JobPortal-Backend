const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const cookie = req.header.cookie;
  const {authorization} = req.headers;
  console.log(authorization);

  // if (cookie) {
  //   const token = cookie.split("=")[1];
  //   jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
  //     if (err) {
  //       res.status(403).json("Token is not valid");
  //       req.user = user;
  //       next();
  //     }
  //   });
  // } 
  if(authorization){
    next();
  }
  else {
    return res.status(401).json("You are not authenticated");
  }
}

module.exports = verifyToken;
