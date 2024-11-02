const Application = require("../models/Application");
const Student = require("../models/Student");
const Instructor = require("../models/Instructor");
const { validationResult } = require("express-validator");
const { COURSES_LESSONS } = require("../consts");

class applicationController {
  async getApplication(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Middleware errors while getting application",
          errors,
        });
      }
      const id = req.params.id;
      const application = await Application.findById(id);
      if (!application) {
        return res
          .status(400)
          .json({ message: `Не могу найти заявку с id ${id}` });
      }
      return res.json(application);
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json({ message: "Ошибка во время поиска заявки", error: e.message });
    }
  }

  async addApplication(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Application add middleware error", errors });
      }
      const { phone } = req.body;
      const isReged = await Application.findOne({ phone });
      if (isReged) {
        return res
          .status(400)
          .json({ message: "Данный номер уже был указан в заявках" });
      } else if (await Student.findOne({ phone })) {
        return res
          .status(400)
          .json({ message: "Данный телефон указан у ученика" });
      } else if (await Instructor.findOne({ phone })) {
        return res
          .status(400)
          .json({ message: "Данный телефон привязан к инструктору" });
      }
      const last_application = await Application.find()
        .sort({ _id: -1 })
        .limit(1);
      req.body.number = last_application[0]
        ? last_application[0].number + 1
        : 1;
      const application = new Application(req.body);
      await application.validate();
      await application.save();
      return res.json({ message: "Заявка успешно создана" });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Ошибка во время добавления заявки",
        error: e.message,
      });
    }
  }

  async editApplication(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Middleware error while updating application",
          errors,
        });
      }
      const isReged = await Application.findOne(
        { _id: req.params.id },
        "-_id -__v"
      );
      if (!isReged) {
        return res.status(400).json({ message: "Данная заявка не существует" });
      }
      for (let key in req.body) {
        if (key === "fio") {
          for (let fioKey in req.body.fio) {
            isReged._doc.fio[fioKey] = req.body.fio[fioKey];
          }
        } else {
          isReged._doc[key] = req.body[key];
        }
      }
      console.log(isReged._doc);
      if (isReged._doc.income !== 0) {
        isReged._doc.maxLessons = COURSES_LESSONS[mergedObj.chosenCourse];
        const student = new Student(isReged._doc);
        await student.validate();
        await student.save();
        await Application.findOneAndUpdate(
          { _id: req.params.id },
          { $set: { isActive: false } },
          { runValidators: true }
        );
        return res.json({
          message: "Заявка успешно изменена",
        });
      }
      await Application.findOneAndUpdate(
        { _id: req.params.id },
        { $set: isReged._doc },
        { runValidators: true }
      );
      return res.json({ message: "Заявка успешно изменена" });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Ошибка во время обновления заявки",
        error: e.message,
      });
    }
  }

  async getApplicationList(req, res) {
    try {
      const { filter = {}, pagination = {} } = req.body;
      const answer = await Application.find(
        filter,
        "creationDate number fio phone filial chosenCourse offerStatus regDate income _id",
        pagination
      );
      return res.json(answer);
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Ошибка во время получения списка заявок",
        error: e.message,
      });
    }
  }
}

module.exports = new applicationController();
