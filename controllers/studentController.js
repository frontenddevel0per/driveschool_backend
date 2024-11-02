const Student = require("../models/Student");
const { validationResult } = require("express-validator");
const { COURSES_LESSONS } = require("../consts");
const telegramBot = require("../telegramBot");
const TgId = require("../models/TgId");

class studentController {
  async getStudent(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Middleware errors while getting student",
          errors,
        });
      }
      const id = req.params.id;
      const student = await Student.findById(id);
      if (!student) {
        return res
          .status(400)
          .json({ message: `Не могу найти студента с id ${id}` });
      }
      return res.json(student);
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json({ message: "Ошибка во время поиска студента", error: e.message });
    }
  }

  async editStudent(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Middleware error while updating student",
          errors,
        });
      }
      const student = await Student.findOne(
        { _id: req.params.id },
        "-_id -__v"
      );
      if (!student) {
        return res
          .status(400)
          .json({ message: "Данный студент не существует" });
      }
      if (
        !!req.body.chosenCourse &&
        req.body.chosenCourse !== student._doc.chosenCourse &&
        !req.body.maxLessons
      ) {
        req.body.maxLessons =
          student._doc.maxLessons -
          COURSES_LESSONS[student._doc.chosenCourse] +
          COURSES_LESSONS[req.body.chosenCourse];
      }
      for (let key in req.body) {
        if (key === "fio") {
          for (let fioKey in req.body.fio) {
            student._doc.fio[fioKey] = req.body.fio[fioKey];
          }
        } else if (key !== "lessons") {
          student._doc[key] = req.body[key];
        }
      }
      await Student.findOneAndUpdate(
        { _id: req.params.id },
        { $set: student._doc },
        { runValidators: true }
      );
      if (student._doc.instructor !== student._doc.instructor) {
        const studentTg = await TgId.findOne({ mongo_id: req.params.id });
        const oldInstructorTg =
          student._doc.instructor !== null
            ? await TgId.findOne({ mongo_id: student._doc.instructor })
            : null;
        const newInstructorTg =
          req.body.instructor !== null
            ? await TgId.findOne({ mongo_id: req.body.instructor })
            : null;
        if (req.body.instructor === null) {
          !!studentTg
            ? telegramBot.sendMessage(
                studentTg.tg_id,
                "Вам убрали инструктора."
              )
            : null;

          !!oldInstructorTg
            ? await telegramBot.sendMessage(
                oldInstructorTg.tg_id,
                `У вас убрали ученика ${Object.values(student._doc.fio).join(
                  " "
                )}.`
              )
            : null;
        } else if (student._doc.instructor === null) {
          !!studentTg
            ? telegramBot.sendMessage(
                studentTg.tg_id,
                "Вам приставили инструктора."
              )
            : null;
          !!newInstructorTg
            ? await telegramBot.sendMessage(
                newInstructorTg.tg_id,
                `Вам приставили ученика ${Object.values(student._doc.fio).join(
                  " "
                )}.`
              )
            : null;
        } else {
          !!studentTg
            ? await telegramBot.sendMessage(
                studentTg.tg_id,
                "Вам поменяли инструктора."
              )
            : null;
          !!newInstructorTg
            ? await telegramBot.sendMessage(
                newInstructorTg.tg_id,
                `Вам приставили ученика ${Object.values(student._doc.fio).join(
                  " "
                )}.`
              )
            : null;
          !!oldInstructorTg
            ? await telegramBot.sendMessage(
                oldInstructorTg.tg_id,
                `У вас убрали ученика ${Object.values(student._doc.fio).join(
                  " "
                )}.`
              )
            : null;
        }
      }
      return res.json({ message: "Студент успешно изменён" });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Ошибка во время обновления студента",
        error: e.message,
      });
    }
  }

  async getStudentList(req, res) {
    try {
      const { filter = {}, pagination = {} } = req.body;
      const answer = await Student.find(
        filter,
        "creationDate number fio phone filial chosenCourse offerStatus regDate income _id",
        pagination
      );
      console.log(answer);
      return res.json(answer);
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Ошибка во время получения списка учеников",
        error: e.message,
      });
    }
  }
}

module.exports = new studentController();
