const mongoose = require('mongoose');

let articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    lockedStatus: { type: Boolean, default: false, required: true },
    creationDate: { type: Date, default: Date.now, required: true}
  });

  module.exports = mongoose.model('Article', articleSchema);