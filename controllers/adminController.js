const { validationResult } = require("express-validator");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");

class authController {
  async registerAdmin(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Register admin middleware error", errors });
      }
      const { username, password, fio } = req.body;
      const isReged = await Admin.findOne({ username });
      if (isReged) {
        return res
          .status(400)
          .json({ message: "Администратор с таким именем уже существует" });
      }
      const hashedPassword = bcrypt.hashSync(password, 7);
      const admin = new Admin({
        username,
        password: hashedPassword,
        fio,
      });
      await admin.validate();
      await admin.save();
      return res.json({ message: "Администратор успешно создан" });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Ошибка во время регистрации администратора",
        error: e.message,
      });
    }
  }

  async editAdmin(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Edit admin middleware error", errors });
      }
      const isReged = await Admin.findOne({ _id: req.params.id }, "-_id -__v");
      if (!isReged) {
        return res
          .status(400)
          .json({ message: `Админа с id ${req.params.id} не существует` });
      }
      if (req.body.password) {
        req.body.password = bcrypt.hashSync(req.body.password, 7);
      }
      await Admin.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { runValidators: true }
      );
      return res.json({ message: "Администратор успешно изменён" });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Ошибка во время изменения администратора",
        error: e.message,
      });
    }
  }
}

module.exports = new authController();
