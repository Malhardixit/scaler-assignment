const mongoose = require("mongoose");

const interViewSchema = new mongoose.Schema({
  participantsName: { type: [String], required: true },
  participantID: [
    {
      type: String,
      required: true,
    },
  ],

  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
});

const Interview = mongoose.model("Interview", interViewSchema);

module.exports = Interview;
