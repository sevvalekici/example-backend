const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  }
});

menuSchema.virtual('menuitems', {
  ref: 'MenuItem',
  localField: '_id',
  foreignField: 'refMenu'
})

module.exports = mongoose.model('Menu', menuSchema);