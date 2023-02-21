const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  adminName: String,
  adminID: String,
});
