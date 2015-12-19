var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tenantSchema = new Schema({
  clientNo: { type: Number, required: true, unique: true },
  authKey: { type: String, required: true },
  name:   { type: String, required: true },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

tenantSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.updated = Date.now;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created = currentDate;

  next();
});

var User = mongoose.model('Tenant', tenantSchema);

module.exports = User;