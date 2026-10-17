const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  product_name: {
    type: String,
    required: true,
  },
  product_category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  price: {
    type: Number,
  },
  description: {
    type: String,
  },
  image: {
    type: String
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Product", productSchema);