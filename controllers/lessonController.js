const Student = require("../models/Student");
const Instructor = require("../models/Instructor");
const { validationResult } = require("express-validator");
const TgId = require("../models/TgId");
const sendMessage = require("../utils");

const createSchedule = () => {
  const schedule = {};
  const currentDate = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + i
    );
    const dateString = date
      .toISOString()
      .split("T")[0]
      .split("-")
      .reverse()
      .join("-");
    const timestamps = {};
    timestamps[
      new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - 1,
        10,
        0
      ).getTime() * 1e-3
    ] = [];
    timestamps[
      new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - 1,
        11,
        30
      ).getTime() * 1e-3
    ] = [];
    timestamps[
      new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - 1,
        13,
        0
      ).getTime() * 1e-3
    ] = [];
    timestamps[
      new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - 1,
        14,
        30
      ).getTime() * 1e-3
    ] = [];
    timestamps[
      new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - 1,
        16,
        0
      ).getTime() * 1e-3
    ] = [];
    timestamps[
      new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - 1,
        17,
        30
      ).getTime() * 1e-3
    ] = [];
    timestamps[
      new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - 1,
        19,
        0
      ).getTime() * 1e-3
    ] = [];
    schedule[dateString] = timestamps;
  }

  return schedule;
};

const isObject = (obj) => {
  return obj.constructor === Object && !!obj;
};

class lessonsController {
  async cancelLesson(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Middleware error while canceling lesson", errors });
      }
      const { instructor, timestamp } = req.body;
      if (!instructor || !timestamp) {
        return res
          .status(400)
          .json({ message: "В теле не указан instructor/timestamp" });
      }
      const isReged = await Instructor.findOne({ _id: instructor });
      if (!isReged) {
        return res.status(400).json({
          message: `Не могу найти инструктора с id ${instructor}`,
        });
      }
      let date = new Date(timestamp * 1000);
      date = date.toLocaleDateString("en-GB").replace(/\//gi, "-");
      const studentId =
        isReged._doc.lessons[date][timestamp.toString()].studentId;
      if (!studentId) {
        return res.status(400).json({
          message:
            "Ошибка во время отмены занятия, проверьте существует ли данный урок",
        });
      }
      const student = await Student.findOne({ _id: studentId });
      student.lessons.upcoming = student.lessons.upcoming.filter(
        (e) => e !== timestamp
      );
      await isReged.updateOne({
        $set: { [`lessons.${date}.${timestamp.toString()}`]: "closed" },
      });
      await student.save();
      const studentTg = (await TgId.findOne({ mongo_id: studentId })).tg_id;
      const instructorTg = (await TgId.findOne({ mongo_id: isReged._id }))
        .tg_id;
      await sendMessage(
        studentTg,
        `Администратор отменил вам занятие на ${new Date(
          timestamp * 1000
        ).toLocaleString()}`
      );
      await sendMessage(
        instructorTg,
        `Администратор отменил вам занятие на ${new Date(
          timestamp * 1000
        ).toLocaleString()}`
      );
      return res.json({ message: "Занятие было успешно отменено" });
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json({ message: "Ошибка во время отмены занятия", error: e.message });
    }
  }

  async getLessons(req, res) {
    try {
      const schedule = createSchedule();
      const instructors = await Instructor.find({ isActive: true });
      for (let instructor of instructors) {
        if ("lessons" in instructor) {
          for (let date in instructor.lessons) {
            if (!(date in schedule)) {
              continue;
            }
            for (let timestamp in instructor.lessons[date]) {
              if (
                isObject(instructor.lessons[date][timestamp]) &&
                timestamp in schedule[date]
              ) {
                schedule[date][timestamp].push({
                  ...instructor.lessons[date][timestamp],
                  instructorId: instructor._id,
                  instructorFio: instructor.fio,
                });
              }
            }
          }
        }
      }
      return res.status(200).json(schedule);
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json({ message: "Ошибка во время получения урока", error: e.message });
    }
  }
}

module.exports = new lessonsController();
