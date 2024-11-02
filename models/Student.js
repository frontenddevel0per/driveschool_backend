const { Schema, model } = require("mongoose");

const Student = new Schema({
  isActive: { type: Boolean, required: true, default: true },
  number: { type: Number, required: true, unique: true, immutable: true },
  fio: {
    type: {
      firstname: { type: String, required: true },
      lastname: { type: String, required: true },
      patronomic: { type: String, required: true },
    },
    required: true,
  },
  phone: { type: Number, required: true, unique: true },
  creationDate: {
    type: Number,
    required: true,
    default: Math.floor(new Date() / 1000),
    immutable: true,
  },
  regDate: {
    type: Number,
    required: true,
    default: Math.floor(new Date() / 1000),
    immutable: true,
  },
  filial: { type: String, required: true, match: /^(Межда|Озерки)$/ },
  chosenCourse: {
    type: String,
    required: true,
    match: /^(Мото A|A\+B|Профи|Оптима|Экспресс|Эконом)$/,
  },
  maxLessons: { type: Number, required: true },
  cpp: { type: String, required: true, match: /^(МКПП|АКПП)$/ },
  typeOfTraining: { type: String, required: true, match: /^(Онлайн|Очно)$/ },
  offerStatus: {
    type: String,
    required: true,
    match:
      /^(Новая заявка|В обработке|Не отвечает|Думает|Скоро придет|Записался\(ась\) на обучение|Завершил обучение)$/,
  },
  issueDate: { type: Number },
  paymentType: { type: String, required: true, match: /^(Наличка|Безнал)$/ },
  income: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  comment: { type: String, default: "" },
  instructor: { type: Schema.Types.ObjectId, default: null },
  lessons: {
    type: {
      done: { type: Array, default: [] },
      upcoming: { type: Array, default: [] },
    },
    required: true,
  },
  reviews: { type: Array, default: [] },
});

module.exports = model("Student", Student);
