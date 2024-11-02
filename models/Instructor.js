const { Schema, model } = require("mongoose");

const Instructor = new Schema({
  isActive: { type: Boolean, required: true, default: true },
  fio: {
    type: {
      firstname: { type: String, required: true },
      lastname: { type: String, required: true },
      patronomic: { type: String, requied: true },
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
  reviews: { type: Array, default: [] },
  weekSchema: {
    type: {
      mon: { type: Boolean, default: false },
      tue: { type: Boolean, default: false },
      wed: { type: Boolean, default: false },
      thu: { type: Boolean, default: false },
      fri: { type: Boolean, default: false },
      sat: { type: Boolean, default: false },
      sun: { type: Boolean, default: false },
    },
    requied: true,
  },
  car: { type: String, default: "" },
  licenseDate: { type: Number, required: true },
  lessons: {
    type: Schema.Types.Mixed,
    default: {},
    required: true,
  },
  img: { type: Schema.Types.ObjectId, default: null },
});

module.exports = model("Instructor", Instructor);
