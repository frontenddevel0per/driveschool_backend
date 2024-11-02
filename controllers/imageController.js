const Instructor = require("../models/Instructor");
const { validationResult } = require("express-validator");
const Image = require("../models/Image");

class imageController {
  async addImage(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Middleware error while adding image", errors });
      }
      const { img } = req.body;
      if (!img) {
        return res.status(400).json({ message: "Не указан img" });
      }
      const instructor = await Instructor.findOne({ _id: req.params.id });
      if (!instructor) {
        return res.status(400).json({
          message: `Не могу найти инструктора с id ${req.params.id}`,
        });
      }
      if (!!instructor.img) {
        return res.status(400).json({
          message: `У инструктора с id ${req.params.id} уже есть картинка`,
        });
      }
      const newImage = await Image.create({
        image: img,
        instructorId: req.params.id,
      });
      await newImage.save({ validateBeforeSave: true });
      instructor.img = newImage._id;
      instructor.save({ validateBeforeSave: true });
      return res.json({
        message: "Картинка успешно добавлена инструктору",
      });
    } catch (e) {
      return res.status(500).json({
        message: "Ошибка во время добавления картинки",
        error: e.message,
      });
    }
  }

  async getImage(req, res) {
    try {
      const image = await Image.findOne({ _id: req.params.id });
      if (!image) {
        return res
          .status(400)
          .json({ message: `Не могу найти картинку с id ${req.params.id}` });
      }
      return res.status(200).json(image.image);
    } catch (e) {
      return res
        .status(500)
        .json({ message: "Ошибка во время поиска картинки", error: e.message });
    }
  }

  async editImage(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Middleware error while editing image", errors });
      }
      const { img } = req.body;
      if (!img) {
        return res.status(400).json({ message: "Не был передан параметр id" });
      }
      const image = await Image.findOne({ _id: req.params.id });
      if (!image) {
        return res.status(400).json({
          message: `Не могу найти картинку с id ${req.params.id}`,
        });
      }
      image.image = img;
      await image.save({ validateBeforeSave: true });
      return res.json({
        message: "Картинка успешно изменена",
      });
    } catch (e) {
      return res.status(500).json({
        message: "Ошибка во время изменения картинки",
        error: e.message,
      });
    }
  }
}

module.exports = new imageController();
