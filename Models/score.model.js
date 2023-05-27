const mongoose = require("mongoose");

const scoreSchema = mongoose.Schema({
  userID: String,
  score: String,
  accuracy: String,
});

const ScoreModel = mongoose.model("score", scoreSchema);

module.exports = ScoreModel;
