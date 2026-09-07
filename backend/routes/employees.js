const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { User, Leave } = require('../models');

router.use(authMiddleware);

const serializeUser = (user) => {
  const data = user.toJSON();
  return { ...data, _id: data.id };
};

const defaultLeaveBalance = {
  annual: 30,
  sick: 10,
  personal: 5,
};

router.get('/', async (req, res) => {
  try {
    const requester = await User.findByPk(req.user.userId);
    const where = requester.role === 'employee' ? { id: requester.id } : {};
    const employees = await User.findAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['name', 'ASC']],
    });

    res.json({
      success: true,
      employees: employees.map(serializeUser),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const requester = await User.findByPk(req.user.userId);
    if (requester.role === 'employee' && requester.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Employees can only view their own profile',
      });
    }

    const employee = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    res.json({
      success: true,
      employee: serializeUser(employee),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.post('/', roleMiddleware('manager', 'hr', 'admin'), async (req, res) => {
  try {
    const { name, email, role, title, department, avatar, managerId } = req.body;

    if (!name || !email || !title || !department) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, title, and department are required',
      });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An employee with this email already exists',
      });
    }

    const employee = await User.create({
      name,
      email,
      password: 'password123',
      role: role || 'employee',
      title,
      department,
      avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4F46E5&color=fff`,
      managerId: managerId || null,
      leaveBalance: defaultLeaveBalance,
    });

    res.status(201).json({
      success: true,
      employee: serializeUser(employee),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.put('/:id', roleMiddleware('manager', 'hr', 'admin'), async (req, res) => {
  try {
    const employee = await User.findByPk(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    const { name, email, role, title, department, avatar, managerId } = req.body;

    if (!name || !email || !title || !department) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, title, and department are required',
      });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing && existing.id !== employee.id) {
      return res.status(400).json({
        success: false,
        message: 'Another employee already uses this email',
      });
    }

    await employee.update({
      name,
      email,
      role,
      title,
      department,
      avatar,
      managerId: managerId || null,
    });

    res.json({
      success: true,
      employee: serializeUser(employee),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.delete('/:id', roleMiddleware('manager', 'hr', 'admin'), async (req, res) => {
  try {
    const employee = await User.findByPk(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    if (employee.id === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete the account you are currently using',
      });
    }

    await Leave.destroy({ where: { employeeId: employee.id } });
    await employee.destroy();

    res.json({
      success: true,
      message: 'Employee deleted',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
