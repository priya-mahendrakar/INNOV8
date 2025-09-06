const db = require('../db/connection');

const createProduct = async (userId, title, description, category, price, imageUrl) => {
  const [result] = await db.execute(
    'INSERT INTO products (user_id, title, description, category, price, image_url) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, title, description, category, price, imageUrl]
  );
  return result.insertId;
};

const getProducts = async (category, keyword) => {
  let query = 'SELECT * FROM products';
  const params = [];
  const conditions = [];
  if (category) {
    conditions.push('category = ?');
    params.push(category);
  }
  if (keyword) {
    conditions.push('title LIKE ?');
    params.push(`%${keyword}%`);
  }
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  const [rows] = await db.execute(query, params);
  return rows;
};

const getProductById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);
  return rows[0];
};

const updateProduct = async (productId, userId, title, description, category, price, imageUrl) => {
  const [result] = await db.execute(
    'UPDATE products SET title = ?, description = ?, category = ?, price = ?, image_url = ? WHERE id = ? AND user_id = ?',
    [title, description, category, price, imageUrl, productId, userId]
  );
  return result.affectedRows > 0;
};

const deleteProduct = async (productId, userId) => {
  const [result] = await db.execute('DELETE FROM products WHERE id = ? AND user_id = ?', [productId, userId]);
  return result.affectedRows > 0;
};

const getUserProducts = async (userId) => {
  const [rows] = await db.execute('SELECT * FROM products WHERE user_id = ?', [userId]);
  return rows;
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getUserProducts
};
