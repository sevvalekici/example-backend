const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  refMenu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
    //required: true
  },
  description: {
    type: String,
  },
  cost: {
    type: Number,
    required: true,
  },
  itemType: {
    type: String,
    enum : ['drink','food'], 
    default: 'food' 
  },
  pic: {
    type: Buffer
  }
});

itemSchema.methods.toJSON = function () {
    const item = this
    const itemObject = item.toObject()

    delete itemObject.pic

    return itemObject
}
module.exports = mongoose.model('MenuItem', itemSchema);