const jwt = require("jsonwebtoken");
const { secret } = require("../config");
const Admin = require("../models/Admin");

module.exports = function (req, res, next) {
  if (req.method === "OPTIONS") {
    next();
  }
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(403).json({ message: "Не был передан токен" });
    }
    const { id } = jwt.verify(token, secret);
    const isAdmin = Admin.findById(id);
    if (!isAdmin) {
      return res
        .status(400)
        .json({ message: "Вы не являетесь администратором" });
    }
    next();
  } catch (e) {
    console.log(e);
    return res.status(403).json({ message: "Некорректный токен" });
  }
};
