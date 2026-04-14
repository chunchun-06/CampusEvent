const pool = require('../config/db');

const findByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

const findById = async (id) => {
  const [rows] = await pool.query(
    'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0];
};

const createUser = async (name, email, hashedPassword, role = 'student') => {
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, hashedPassword, role]
  );
  return result.insertId;
};

const getAllUsers = async () => {
  const [rows] = await pool.query(
    'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
  );
  return rows;
};

module.exports = { findByEmail, findById, createUser, getAllUsers };
