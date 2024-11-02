const { Schema, model } = require("mongoose");

const Admin = new Schema({
  isActive: { type: Boolean, required: true, default: true },
  username: { type: String, required: true, unique: true, immutable: true },
  password: { type: String, required: true },
  fio: {
    type: {
      firstname: { type: String, required: true },
      lastname: { type: String, required: true },
      patronomic: { type: String, required: true },
    },
    required: true,
  },
});

module.exports = model("Admin", Admin);
