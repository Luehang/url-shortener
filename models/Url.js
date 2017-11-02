const mongoose = require('mongoose');
const { Schema } = mongoose;
mongoose.Promise = require('bluebird');

// create mongoose Schema to reference to
const urlSchema = new Schema({
  original_url: {type: String, require: true},
  short_url: {type: String, require: true}
});

urlSchema.methods.print = function () {
  const jsonObj = {
    "original_url": this.original_url,
    "short_url": this.short_url
  };
  return jsonObj;
}

// compiling Schema into a Model to construct new docs for representation
// and exporting module with node
module.exports = mongoose.model('Url', urlSchema);
