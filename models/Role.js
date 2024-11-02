const { Schema, model } = require("mongoose");

const Role = new Schema({
  value: { type: String, unique: true, default: "STUDENT" },
});

module.exports = model("Role", Role);
