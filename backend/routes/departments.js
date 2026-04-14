const express = require('express');
const router = express.Router();
const { listDepartments, addDepartment, removeDepartment } = require('../controllers/departmentController');
const { verifyToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roles');

router.get('/', listDepartments);
router.post('/', verifyToken, requireAdmin, addDepartment);
router.delete('/:id', verifyToken, requireAdmin, removeDepartment);

module.exports = router;
