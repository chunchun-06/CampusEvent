const { getAllDepartments, getDepartmentById, createDepartment, deleteDepartment } = require('../models/departmentModel');

const listDepartments = async (req, res) => {
  const departments = await getAllDepartments();
  res.json(departments);
};

const addDepartment = async (req, res) => {
  const { name } = req.body;
  if (!name || name.trim().length < 2) {
    return res.status(400).json({ message: 'Department name must be at least 2 characters.' });
  }
  const id = await createDepartment(name.trim());
  res.status(201).json({ id, name: name.trim() });
};

const removeDepartment = async (req, res) => {
  const { id } = req.params;
  const dept = await getDepartmentById(id);
  if (!dept) return res.status(404).json({ message: 'Department not found.' });
  await deleteDepartment(id);
  res.json({ message: 'Department deleted successfully.' });
};

module.exports = { listDepartments, addDepartment, removeDepartment };
