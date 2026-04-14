const pool = require('../config/db');

const getAllDepartments = async () => {
  const [rows] = await pool.query('SELECT * FROM departments ORDER BY name');
  return rows;
};

const getDepartmentById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM departments WHERE id = ?', [id]);
  return rows[0];
};

const createDepartment = async (name) => {
  const [result] = await pool.query('INSERT INTO departments (name) VALUES (?)', [name]);
  return result.insertId;
};

const deleteDepartment = async (id) => {
  await pool.query('DELETE FROM departments WHERE id = ?', [id]);
};

module.exports = { getAllDepartments, getDepartmentById, createDepartment, deleteDepartment };
