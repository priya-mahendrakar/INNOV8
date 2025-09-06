const Product = require('../models/product');

exports.createProduct = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, description, category, price, imageUrl } = req.body;

    if (!title || !category || !price) {
      return res.status(400).json({ message: 'Title, category, and price are required' });
    }

    const newProductId = await Product.createProduct(userId, title, description, category, price, imageUrl || 'placeholder.png');
    res.status(201).json({ message: 'Product created', productId: newProductId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { category, keyword } = req.query;
    const products = await Product.getProducts(category, keyword);
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const userId = req.user.userId;
    const productId = req.params.id;
    const { title, description, category, price, imageUrl } = req.body;

    const updated = await Product.updateProduct(productId, userId, title, description, category, price, imageUrl || 'placeholder.png');
    if (!updated) return res.status(403).json({ message: 'Not authorized or product not found' });

    res.json({ message: 'Product updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const userId = req.user.userId;
    const productId = req.params.id;

    const deleted = await Product.deleteProduct(productId, userId);
    if (!deleted) return res.status(403).json({ message: 'Not authorized or product not found' });

    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserProducts = async (req, res) => {
  try {
    const userId = req.user.userId;
    const products = await Product.getUserProducts(userId);
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
