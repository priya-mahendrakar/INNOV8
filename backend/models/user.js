const db = require('../db/connection');

const createUser = async (email, hashedPassword, username) => {
  const [result] = await db.execute(
    'INSERT INTO users (email, password, username) VALUES (?, ?, ?)',
    [email, hashedPassword, username]
  );
  return result.insertId;
};

const getUserByEmail = async (email) => {
  const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

const getUserById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
};

const updateUserProfile = async (id, username) => {
  const [result] = await db.execute(
    'UPDATE users SET username = ? WHERE id = ?',
    [username, id]
  );
  return result.affectedRows > 0;
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserProfile
};
