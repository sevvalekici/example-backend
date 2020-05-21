const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  itemslist:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'menuItem',
        // require: true,
    }
],
  totalCost: {
    type: Number,
  },
  orderTime: {
    type: Date, 
    default: Date.now
  },
  status: {
    type: String, 
    enum : ['received','delivery', 'completed'], 
    default: 'received' 
},
});

module.exports = mongoose.model('Orders', orderSchema);