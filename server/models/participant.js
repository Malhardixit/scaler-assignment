const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  participantName: String,
  participantID: String,
  // interviews:[interview]
});

const participant = mongoose.model("participant", participantSchema);

module.exports = participant;
