const mongoose = require("mongoose");

const interViewSchema = new mongoose.Schema({
  participants: [String],
  participantID: [String],
  interviewID: String,
  date: Date,
  startTime: Date,
  endTime: Date,
});

const Interview = mongoose.model("Interview", interViewSchema);

module.exports = Interview;
