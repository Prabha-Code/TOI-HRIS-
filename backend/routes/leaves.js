const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Employee routes
router.get('/', leaveController.getAllLeaves);
router.post('/request', leaveController.requestLeave);
router.get('/my-leaves', leaveController.getMyLeaves);
router.get('/stats', leaveController.getLeaveStats);
router.put('/:id', leaveController.updateLeave);
router.delete('/:id', leaveController.deleteLeave);

// Manager routes
router.get('/pending', roleMiddleware('manager', 'hr'), leaveController.getPendingRequests);
router.post('/approve', roleMiddleware('manager', 'hr'), leaveController.approveLeave);
router.post('/reject', roleMiddleware('manager', 'hr'), leaveController.rejectLeave);

module.exports = router;
