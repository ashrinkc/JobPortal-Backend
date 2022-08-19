const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  // const cookie = req.header.cookie;
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json("You are not authenticated");
  }
  const token = authorization.replace("Bearer ", "");

  try {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({error : err});
      }
      req.user = decoded;
      next();
    });
  } catch (err) {
    return errorResponse({ status: 500, message: err.message, res });
  }
}

module.exports = verifyToken;
