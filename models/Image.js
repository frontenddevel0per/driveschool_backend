const { Schema, model } = require("mongoose");

const Image = new Schema({
  image: { type: String, required: true },
  instructorId: { type: Schema.Types.ObjectId, required: true, unique: true },
});

module.exports = model("Image", Image);
