const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { authMiddleware } = require('../middleware/auth');
const { Leave, User } = require('../models');

router.use(authMiddleware);

const serializeLeave = (leave) => {
  const data = leave.toJSON();
  return {
    ...data,
    _id: data.id,
    employeeId: data.employee ? { ...data.employee, _id: data.employee.id } : data.employeeId,
    approverId: data.approver ? { ...data.approver, _id: data.approver.id } : data.approverId,
  };
};

router.get('/', async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.role === 'employee') {
      const myLeaves = await Leave.findAll({
        where: { employeeId: req.user.userId },
        order: [['createdAt', 'DESC']],
        limit: 5,
      });

      const stats = {
        balance: user.leaveBalance,
        totalUsed: 0,
        pending: 0,
      };

      myLeaves.forEach((leave) => {
        if (leave.status === 'approved') {
          stats.totalUsed += leave.numberOfDays;
        } else if (leave.status === 'pending') {
          stats.pending += leave.numberOfDays;
        }
      });

      return res.json({
        success: true,
        dashboard: {
          role: 'employee',
          user: user.toJSON(),
          leaveBalance: stats.balance,
          totalUsed: stats.totalUsed,
          pendingRequests: stats.pending,
          recentLeaves: myLeaves.map(serializeLeave),
        },
      });
    }

    if (user.role === 'manager') {
      const employees = await User.findAll({
        where: { managerId: req.user.userId },
        attributes: ['id', 'name', 'email', 'department'],
      });
      const employeeIds = employees.map((employee) => employee.id);

      const pendingLeaves = await Leave.findAll({
        where: {
          employeeId: { [Op.in]: employeeIds },
          status: 'pending',
        },
        include: [{ model: User, as: 'employee', attributes: ['id', 'name', 'email', 'department'] }],
        order: [['createdAt', 'DESC']],
      });

      const today = new Date();
      const approvedLeaves = await Leave.findAll({
        where: {
          employeeId: { [Op.in]: employeeIds },
          status: 'approved',
          startDate: { [Op.lte]: today },
          endDate: { [Op.gte]: today },
        },
      });

      return res.json({
        success: true,
        dashboard: {
          role: 'manager',
          user: user.toJSON(),
          teamMetrics: {
            totalEmployees: employees.length,
            onLeave: approvedLeaves.length,
            pendingApprovals: pendingLeaves.length,
          },
          pendingLeaves: pendingLeaves.map(serializeLeave),
          teamSize: employees.length,
        },
      });
    }

    const allLeaves = await Leave.findAll({
      include: [{ model: User, as: 'employee', attributes: ['id', 'name', 'email', 'department'] }],
      order: [['createdAt', 'DESC']],
    });

    const allUsers = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'department', 'leaveBalance', 'managerId'],
      order: [['name', 'ASC']],
    });
    const leaveStats = {
      total: allLeaves.length,
      approved: 0,
      pending: 0,
      rejected: 0,
    };
    const leaveTypeBreakdown = {
      casual: 0,
      medical: 0,
      earned: 0,
    };
    const roleBreakdown = {};
    const departmentBreakdown = {};

    allLeaves.forEach((leave) => {
      leaveStats[leave.status]++;
      leaveTypeBreakdown[leave.leaveType] += leave.numberOfDays;
    });

    allUsers.forEach((employee) => {
      roleBreakdown[employee.role] = (roleBreakdown[employee.role] || 0) + 1;
      const department = employee.department || 'Unassigned';
      departmentBreakdown[department] = (departmentBreakdown[department] || 0) + 1;
    });

    return res.json({
      success: true,
      dashboard: {
        role: user.role,
        user: user.toJSON(),
        totalEmployees: allUsers.length,
        leaveStats,
        leaveTypeBreakdown,
        roleBreakdown,
        departmentBreakdown,
        employees: allUsers.map((employee) => {
          const data = employee.toJSON();
          return { ...data, _id: data.id };
        }),
        recentLeaves: allLeaves.slice(0, 10).map(serializeLeave),
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
