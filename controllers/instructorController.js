const Instructor = require("../models/Instructor");
const Application = require("../models/Application");
const { validationResult } = require("express-validator");

class instructorController {
  async getInstructor(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Middleware errors while getting instructor",
          errors,
        });
      }
      const id = req.params.id;
      const instructor = await Instructor.findById(id);
      if (instructor.img !== null) {
        instructor.img = Buffer.from(instructor.img, "binary").toString(
          "base64"
        );
      }
      if (!instructor) {
        return res
          .status(400)
          .json({ message: `Не удалось найти инструктора с id ${id}` });
      }
      return res.json(instructor);
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Ошибка во время поиска инструктора",
        error: e.message,
      });
    }
  }

  async addInstructor(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Ошибка при регистрации инструктора", errors });
      }
      const { phone } = req.body;
      const isRegedApplication = await Application.findOne({ phone });
      if (isRegedApplication) {
        return res.status(400).json({
          message: "Данный телефон уже указан с заявках",
        });
      }
      const isReged = await Instructor.findOne({ phone });
      if (isReged) {
        return res.status(400).json({
          message: "Инструктор с данным телефоном уже зарегистрирован",
        });
      }
      req.body.licenseDate = Math.floor(+new Date(req.body.licenseDate) / 1000);
      const user = new Instructor(req.body);
      await user.save();
      return res.json({ message: "Инструктор успешно создан" });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Ошибка при регистрации инструктора",
        error: e.message,
      });
    }
  }

  async updateInstructor(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Middleware error while updating instructor",
          errors,
        });
      }
      const isReged = await Instructor.findOne(
        { _id: req.params.id },
        "-_id -__v"
      );
      if (!isReged) {
        return res
          .status(400)
          .json({ message: "Данного инструктора не существует" });
      }
      if (req.body.licenseDate) {
        req.body.licenseDate = +new Date(req.body.licenseDate) / 1000;
      }
      for (let key in req.body) {
        if (key === "fio") {
          for (let fioKey in req.body.fio) {
            isReged._doc.fio[fioKey] = req.body.fio[fioKey];
          }
        } else if (key !== "lessons") {
          isReged._doc[key] = req.body[key];
        }
      }
      await Instructor.findOneAndUpdate(
        { _id: req.params.id },
        { $set: isReged._doc },
        { runValidators: true }
      );
      return res.json({ message: "Инструктор успешно обновлён" });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Ошибка во время обновления инструктора",
        error: e.message,
      });
    }
  }

  async getInstructorsList(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Middleware error while getting instructors list",
          errors,
        });
      }
      const { filter = {}, pagination = {} } = req.body;
      const answer = await Instructor.find(
        filter,
        "fio phone car _id",
        pagination
      );
      return res.json(answer);
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Ошибка во время получения списка инструкторов",
        error: e.message,
      });
    }
  }

  async getInstructorLessons(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Middleware error while getting instructor lessons",
          errors,
        });
      }
      const isReged = await Instructor.findOne(
        { _id: req.params.id },
        "-_id -__v"
      );
      if (!isReged) {
        return res
          .status(400)
          .json({ message: "Данный инструктор не существует" });
      }
      let response = { ...isReged._doc.lessons };
      for (let key in response) {
        for (let timestamp in response[key]) {
          if (
            response[key][timestamp] === "closed" ||
            response[key][timestamp] === "opened"
          ) {
            response[key][timestamp] = [];
          } else {
            response[key][timestamp] = [
              {
                ...response[key][timestamp],
                instructorId: req.params.id,
                instructorFio: isReged._doc.fio,
              },
            ];
          }
        }
      }
      return res.status(200).json(response);
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Ошибка во время получения уроков инструктора",
        error: e.message,
      });
    }
  }
}

module.exports = new instructorController();
