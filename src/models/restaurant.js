const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  address: {
    type: String,
    default: '42 Maslak'
  },
  district: {
    type: String,
    default: 'Maslak'
  },
  city: {
    type: String,
    default: 'İstanbul'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

restaurantSchema.virtual('users', {
  ref: 'User',
  localField: '_id',
  foreignField: 'restaurant'
})
restaurantSchema.virtual('menus', {
  ref: 'Menu',
  localField: '_id',
  foreignField: 'restaurant'
})

module.exports = mongoose.model('Restaurant', restaurantSchema);