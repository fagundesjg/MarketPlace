const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth");
const { promisify } = require("util");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token not provided" });
  }

  // formato do token é 'Beader <token>'
  const [, token] = authHeader.split(" ");

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    // adiciona a variavel userID para cada requisição!
    req.userId = decoded.id;
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Token invalid" });
  }
};
