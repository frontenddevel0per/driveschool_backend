const Role = require("../models/Role");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { secret, refresh_secret } = require("../config");

const generateAccessToken = (id) => {
  const payload = {
    id,
  };
  return jwt.sign(payload, secret, { expiresIn: "2h" });
};

const generateRefreshToken = (id, fingerprint) => {
  const payload = {
    id,
    fingerprint,
  };
  return jwt.sign(payload, refresh_secret, { expiresIn: "14d" });
};

class authController {
  async login(req, res) {
    try {
      const { username, password, fingerprint } = req.body;
      if (!(username && password && fingerprint)) {
        return res.status(400).json({
          message: `Не указаны поля: ${[
            "username",
            "password",
            "fingerprint",
          ].filter((key) => !(key in req.body))}`,
        });
      }
      const user = await Admin.findOne({ username });
      if (!user) {
        return res
          .status(402)
          .json({ message: `Пользователь ${username} не найден` });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(403).json({ message: "Неверный пароль" });
      }
      const token = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id, fingerprint);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
        // domain: ".app.localhost,driveculture.ru/", // Restrict to localhost + domain
        secure: true, // Only transmit over HTTPS
        sameSite: "none", // Allow cross-site cookies
      });
      res.cookie("accessToken", token, {
        httpOnly: true,
        maxAge: 2 * 60 * 60 * 1000, // 2 hours
        secure: true,
        sameSite: "none", // Allow cross-site cookies
      });
      return res.json();
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json({ message: "Ошибка во время логина", error: e.message });
    }
  }

  async token(req, res) {
    try {
      const { fingerprint } = req.body;
      if (!fingerprint) {
        return res.status(400).json({ message: "Не указан fingerprint" });
      }

      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ message: "Не отправлен refresh токен" });
      }

      jwt.verify(refreshToken, refresh_secret, (err, decoded) => {
        if (err) {
          return res
            .status(403)
            .json({ message: "Некорректный refresh токен" });
        }

        if (decoded.fingerprint !== fingerprint) {
          return res.status(400).json({ message: "Неверный fingerprint" });
        }

        const token = generateAccessToken(decoded.id);
        res.cookie("accessToken", token, {
          httpOnly: true,
          maxAge: 2 * 60 * 60 * 1000, // 2 hours
          secure: true,
          sameSite: "none", // Allow cross-site cookies
        });
        return res.json();
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Ошибка во время обновления access токена",
        error: e.message,
      });
    }
  }
}

module.exports = new authController();
