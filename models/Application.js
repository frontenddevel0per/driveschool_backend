const { Schema, model } = require("mongoose");

const checkFio = (fio) => {
  const expectedkeys = ["lastname", "firstname", "patronomic", "_id"];
  let fioKeys = Object.keys(fio);
  return fioKeys.every((e) => {
    console.log(e);
    return expectedkeys.includes(e);
  });
};

const Application = new Schema({
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
});

module.exports = model("Application", Application);
