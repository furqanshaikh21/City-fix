import express from 'express';
import upload from '../middlewares/upload.js'; // multer config
import {
  createComplaint,
  getAllComplaints,
  getNearbyComplaints,
  getHeatmapData,
  upvoteComplaint,
  markAsResolved,
  verifyResolution,
} from '../controllers/complaintController.js';

const router = express.Router();

// Use upload.single('media') to handle single file upload from frontend form
router.post('/', upload.single('media'), createComplaint);

router.get('/', getAllComplaints);

router.get('/nearby', getNearbyComplaints);

router.get('/heatmap-data', getHeatmapData);

router.put('/:id/upvote', upvoteComplaint);

router.put('/:id/resolve', markAsResolved);

router.put('/:id/verify', verifyResolution);

export default router;
