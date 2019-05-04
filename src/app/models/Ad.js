const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const Ad = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  author: {
    // se quiser colocar relacionamento hasMany, era só colocar author: [{..}]
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  purchasedBy: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

Ad.plugin(mongoosePaginate);

module.exports = mongoose.model("Ad", Ad);
