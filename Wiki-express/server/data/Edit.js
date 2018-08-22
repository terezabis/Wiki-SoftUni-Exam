const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

let editSchema = new mongoose.Schema({
    author: { type: ObjectId, ref: 'User', required: true },
    article: { type: ObjectId, ref: 'Article', required: true },
    creationDate: { type: Date, default: Date.Now, required: true },
    content:  { type: String, required: true }
  });

  module.exports = mongoose.model('Edit', editSchema);