const { Schema, model } = require("mongoose");

const Tg_id = new Schema({
  tg_id: { type: Number, required: true, unique: true },
  role: { type: String, required: true },
  mongo_id: { type: Schema.Types.ObjectId, required: true },
});

module.exports = model("Tg_id", Tg_id);
