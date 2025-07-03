import express from 'express';
import upload from '../middlewares/upload.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import Complaint from '../models/Complaint.js'; // ✅ FIXED: Complaint model import

import {
  createComplaint,
  getAllComplaints,
  getNearbyComplaints,
  getHeatmapData,
  upvoteComplaint,
  markAsResolved,
  verifyResolution,
  addComment,
  updateComplaintStatus,
  getUserComplaints,
} from '../controllers/complaintController.js';

const router = express.Router();

// 🔘 Create new complaint (with file upload)
router.post('/', verifyToken, upload.single('media'), createComplaint);

// 🔘 Get all complaints
router.get('/', getAllComplaints);

// 🔘 Get complaints near a location
router.get('/nearby', getNearbyComplaints);

// 🔘 Heatmap data
router.get('/heatmap-data', getHeatmapData);

// 🔘 Get complaints created by logged-in user
router.get('/my', verifyToken, getUserComplaints);

// 🔘 Get complaints that need verification by user
router.get('/to-verify', verifyToken, async (req, res) => {
  try {
    const complaints = await Complaint.find({
      isResolved: true,
      verificationStatus: 'Pending',
      verifiers: { $ne: req.user._id },
    }).populate('verifiers', '_id name');

    res.json(complaints);
  } catch (err) {
    console.error('❌ /to-verify route error:', err);
    res.status(500).json({ message: "Failed to fetch complaints needing verification" });
  }
});

// 🔘 Upvote / Un-upvote
router.put('/:id/upvote', verifyToken, upvoteComplaint);

// 🔘 Add a comment
router.post('/:id/comments', verifyToken, addComment);

// 🔘 Admin: mark as resolved (awaiting verification)
router.put('/:id/resolve', verifyToken, markAsResolved);

// 🔘 Admin: update complaint status manually
router.put('/:id/status', verifyToken, updateComplaintStatus);

// 🔘 User: verify or reject resolution
router.put('/:id/verify', verifyToken, verifyResolution);

export default router;
