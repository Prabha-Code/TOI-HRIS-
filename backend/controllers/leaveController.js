const { Leave, User } = require('../models');

const serializeUser = (user) => {
  if (!user) {
    return null;
  }

  const data = typeof user.toJSON === 'function' ? user.toJSON() : user;
  return { ...data, _id: data.id };
};

const serializeLeave = (leave) => {
  const data = typeof leave.toJSON === 'function' ? leave.toJSON() : leave;
  return {
    ...data,
    _id: data.id,
    employeeId: data.employee ? serializeUser(data.employee) : data.employeeId,
    approverId: data.approver ? serializeUser(data.approver) : data.approverId,
  };
};

// Calculate number of days between two dates (excluding weekends)
const calculateWorkingDays = (startDate, endDate) => {
  let count = 0;
  const current = new Date(startDate);
  
  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 0 = Sunday, 6 = Saturday
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
};

exports.requestLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    // Validation
    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (!['annual', 'sick', 'personal'].includes(leaveType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid leave type'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return res.status(400).json({
        success: false,
        message: 'Start date must be before end date'
      });
    }

    // Calculate working days
    const numberOfDays = calculateWorkingDays(start, end);

    // Get employee
    const employee = await User.findByPk(req.user.userId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Check leave balance
    const availableLeaves = employee.leaveBalance[leaveType] || 0;
    if (numberOfDays > availableLeaves) {
      return res.status(400).json({
        success: false,
        message: `Insufficient ${leaveType} leave balance. Available: ${availableLeaves}, Requested: ${numberOfDays}`
      });
    }

    // Create leave request
    const leave = await Leave.create({
      employeeId: req.user.userId,
      leaveType,
      startDate: start,
      endDate: end,
      numberOfDays,
      reason,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Leave request submitted successfully',
      leave: serializeLeave(leave)
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.findAll({
      where: { employeeId: req.user.userId },
      include: [{ model: User, as: 'approver', attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      leaves: leaves.map(serializeLeave)
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getAllLeaves = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);
    const where = user && user.role === 'employee' ? { employeeId: req.user.userId } : {};

    const leaves = await Leave.findAll({
      where,
      include: [
        { model: User, as: 'employee', attributes: ['id', 'name', 'email', 'role', 'title', 'department', 'avatar', 'leaveBalance'] },
        { model: User, as: 'approver', attributes: ['id', 'name', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      leaves: leaves.map(serializeLeave)
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getPendingRequests = async (req, res) => {
  try {
    const leaves = await Leave.findAll({
      where: { status: 'pending' },
      include: [{ model: User, as: 'employee', attributes: ['id', 'name', 'email', 'department'] }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      leaves: leaves.map(serializeLeave)
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.approveLeave = async (req, res) => {
  try {
    const { leaveId, approverNotes } = req.body;

    const leave = await Leave.findByPk(leaveId);
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Leave request is already processed'
      });
    }

    // Update leave status
    await leave.update({
      status: 'approved',
      approverId: req.user.userId,
      approverNotes: approverNotes || '',
      approvedAt: new Date()
    });

    // Update employee leave balance
    const employee = await User.findByPk(leave.employeeId);
    const currentBalance = { ...employee.leaveBalance };
    currentBalance[leave.leaveType] = Math.max(0, currentBalance[leave.leaveType] - leave.numberOfDays);
    await employee.update({ leaveBalance: currentBalance });

    res.json({
      success: true,
      message: 'Leave approved successfully',
      leave: serializeLeave(leave)
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.updateLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    const leave = await Leave.findByPk(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending leave requests can be edited'
      });
    }

    const user = await User.findByPk(req.user.userId);
    const canEdit = leave.employeeId === req.user.userId || ['manager', 'hr', 'admin'].includes(user.role);

    if (!canEdit) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (!['annual', 'sick', 'personal'].includes(leaveType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid leave type'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return res.status(400).json({
        success: false,
        message: 'Start date must be before end date'
      });
    }

    const numberOfDays = calculateWorkingDays(start, end);
    const employee = await User.findByPk(leave.employeeId);
    const availableLeaves = employee.leaveBalance[leaveType] || 0;

    if (numberOfDays > availableLeaves) {
      return res.status(400).json({
        success: false,
        message: `Insufficient ${leaveType} leave balance`
      });
    }

    await leave.update({ leaveType, startDate: start, endDate: end, numberOfDays, reason });

    res.json({
      success: true,
      leave: serializeLeave(leave)
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findByPk(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    const user = await User.findByPk(req.user.userId);
    const canDelete = leave.employeeId === req.user.userId || ['manager', 'hr', 'admin'].includes(user.role);

    if (!canDelete) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (leave.status === 'approved') {
      const employee = await User.findByPk(leave.employeeId);
      const currentBalance = { ...employee.leaveBalance };
      currentBalance[leave.leaveType] = (currentBalance[leave.leaveType] || 0) + leave.numberOfDays;
      await employee.update({ leaveBalance: currentBalance });
    }

    await leave.destroy();

    res.json({
      success: true,
      message: 'Leave request deleted'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.rejectLeave = async (req, res) => {
  try {
    const { leaveId, approverNotes } = req.body;

    const leave = await Leave.findByPk(leaveId);
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Leave request is already processed'
      });
    }

    // Update leave status
    await leave.update({
      status: 'rejected',
      approverId: req.user.userId,
      approverNotes: approverNotes || '',
      approvedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Leave rejected',
      leave: serializeLeave(leave)
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getLeaveStats = async (req, res) => {
  try {
    const employee = await User.findByPk(req.user.userId);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Get leave stats
    const allLeaves = await Leave.findAll({ where: { employeeId: req.user.userId } });
    
    const stats = {
      balance: employee.leaveBalance,
      total: {
        annual: 0,
        sick: 0,
        personal: 0
      },
      approved: {
        annual: 0,
        sick: 0,
        personal: 0
      },
      pending: {
        annual: 0,
        sick: 0,
        personal: 0
      },
      rejected: {
        annual: 0,
        sick: 0,
        personal: 0
      }
    };

    allLeaves.forEach(leave => {
      stats.total[leave.leaveType] += leave.numberOfDays;
      stats[leave.status][leave.leaveType] += leave.numberOfDays;
    });

    res.json({
      success: true,
      stats
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
