// routes/adminRoutes.js
import express from 'express';
import { loginAdmin, getAllComplaints, updateComplaintStatus } from '../controllers/adminController.js';
import { protectAdmin } from '../middlewares/adminAuth.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/complaints', protectAdmin, getAllComplaints);
router.put('/complaints/:id/status', protectAdmin, updateComplaintStatus);

export default router;
