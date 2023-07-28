const mysql = require("mysql");
const jwt = require("jsonwebtoken");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "new-password",
  database: "PEETCODE",
});
const verify = (req, res, next) => {
  try {
    const cookieString = req.headers.cookie;
    const cookies = cookieString.split("; ");
    let token = null;
    for (const cookie of cookies) {
      if (cookie.startsWith("token=")) {
        token = cookie.split("=")[1];
        break;
      }
    }
    if (!token) {
      return res.json({
        message: "No token",
      });
    }
    jwt.verify(token, "ANEESH", (err, result) => {
      if (err) {
        return res.status(400).json({ message: err });
      }
      req.user = result;
      return res.status(200).send(req.user);
    });
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
};

module.exports = { verify };
