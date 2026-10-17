const mongoose = require("mongoose");
const Product = require("../models/product");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("product_category");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Could not load products." });
  }
};

const getProductById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID." });
    }

    const product = await Product.findById(req.params.id)
      .populate("product_category");

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Could not load product." });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      product_name,
      product_category,
      price,
      description,
      image,
      quantity,
      status,
    } = req.body;

    const product = await Product.create({
      product_name,
      product_category,
      price,
      description,
      image,
      quantity,
      status,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({
      message: error.name === "ValidationError"
        ? error.message
        : "Could not create product.",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID." });
    }

    const {
      product_name,
      product_category,
      price,
      description,
      image,
      quantity,
      status,
    } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        product_name,
        product_category,
        price,
        description,
        image,
        quantity,
        status,
      },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({
      message: error.name === "ValidationError"
        ? error.message
        : "Could not update product.",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID." });
    }

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.json({ message: "Product deleted." });
  } catch (error) {
    res.status(500).json({ message: "Could not delete product." });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};