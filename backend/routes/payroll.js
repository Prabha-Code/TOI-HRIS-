const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { PayrollRun } = require('../models');

router.use(authMiddleware);

const serializeRun = (run) => {
  const data = run.toJSON();
  return {
    ...data,
    _id: data.id,
    grossPay: Number(data.grossPay),
  };
};

router.get('/', roleMiddleware('hr', 'admin'), async (req, res) => {
  try {
    const runs = await PayrollRun.findAll({ order: [['dueDate', 'DESC']] });
    res.json({ success: true, payrollRuns: runs.map(serializeRun) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', roleMiddleware('hr', 'admin'), async (req, res) => {
  try {
    const { month, employees, grossPay, status, dueDate } = req.body;

    if (!month || !dueDate) {
      return res.status(400).json({ success: false, message: 'Month and due date are required' });
    }

    const run = await PayrollRun.create({
      month,
      employees: Number(employees) || 0,
      grossPay: Number(grossPay) || 0,
      status: status || 'Draft',
      dueDate,
    });

    res.status(201).json({ success: true, payrollRun: serializeRun(run) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', roleMiddleware('hr', 'admin'), async (req, res) => {
  try {
    const run = await PayrollRun.findByPk(req.params.id);
    if (!run) {
      return res.status(404).json({ success: false, message: 'Payroll run not found' });
    }

    const { month, employees, grossPay, status, dueDate } = req.body;
    await run.update({
      month,
      employees: Number(employees) || 0,
      grossPay: Number(grossPay) || 0,
      status,
      dueDate,
    });

    res.json({ success: true, payrollRun: serializeRun(run) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', roleMiddleware('hr', 'admin'), async (req, res) => {
  try {
    const run = await PayrollRun.findByPk(req.params.id);
    if (!run) {
      return res.status(404).json({ success: false, message: 'Payroll run not found' });
    }

    await run.destroy();
    res.json({ success: true, message: 'Payroll run deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
