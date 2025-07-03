import Complaint from '../models/Complaint.js';
// import { sendNotification } from '../utils/sendNotification.js';

// Create Complaint
export const createComplaint = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized: User not found in token" });
    }

    const { title, description, category, severity, location, address } = req.body;
    const loc = location ? JSON.parse(location) : null;
    const media = req.file ? [`/uploads/${req.file.filename}`] : [];

    const complaint = await Complaint.create({
      title,
      description,
      category,
      severity,
      address,
      media,
      createdBy: req.user.id, // ✅ consistent id
      location: loc
        ? {
            type: 'Point',
            coordinates: [loc.coordinates[0], loc.coordinates[1]],
          }
        : undefined,
    });

    res.status(201).json(complaint);
  } catch (err) {
    console.error("❌ Complaint Creation Error:", err);
    res.status(500).json({ message: 'Failed to create complaint', error: err.message });
  }
};

// Get All Complaints
export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('createdBy', 'name email')
      .populate('comments.user', 'name')
      .populate('assignedTo', 'name')
      .populate('verifiers', 'name');

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get complaints', error: err.message });
  }
};

// Admin - Mark as Resolved
export const markAsResolved = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    complaint.verificationStatus = "Pending";
    complaint.status = 'In Progress';
    complaint.isResolved = true; // ✅ This is critical!

    await complaint.save();
    res.json({ message: 'Marked for resolution. Awaiting user confirmation.' });
  } catch (err) {
    res.status(500).json({ message: 'Error marking resolved', error: err.message });
  }
};


// Admin - Manually Change Status
export const updateComplaintStatus = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status is required' });

    if (status === 'Resolved') {
      complaint.status = 'In Progress';
      complaint.verificationStatus = 'Pending';
      await complaint.save();
      return res.json({
        message: 'Resolution in progress – awaiting user confirmation.',
        complaint
      });
    }

    complaint.status = status;
    await complaint.save();

    res.json({ message: 'Status updated ✅', complaint });
  } catch (err) {
    res.status(500).json({ message: 'Status update error 😵', error: err.message });
  }
};

// User - Confirm / Reject Complaint Resolution
export const verifyResolution = async (req, res) => {
  const { feedback } = req.body;

  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

const userId = (req.user._id || req.user.id).toString(); // ✅ Safe for both cases

    // 🚫 Only the user who created the complaint can verify
    if (complaint.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Only the complainant can verify this complaint' });
    }

    if (complaint.verificationStatus === "Confirmed") {
      return res.status(403).json({ message: 'Already confirmed' });
    }

    if (feedback === 'Rejected') {
      complaint.isResolved = false;
      complaint.verificationStatus = 'Rejected';
      complaint.status = 'In Progress';
      await complaint.save();
      return res.json({ message: 'Rejected by user ❌' });
    }

    if (feedback === 'Confirmed') {
      complaint.isResolved = true;
      complaint.status = 'Resolved';
      complaint.verificationStatus = 'Confirmed';
      await complaint.save();
      return res.json({ message: 'Thanks for verifying!', status: complaint.verificationStatus });
    }

    return res.status(400).json({ message: 'Invalid feedback' });
  } catch (err) {
    res.status(500).json({ message: 'Verification error', error: err.message });
  }
  console.log("🧪 verifyResolution hit for:", req.params.id);
console.log("User ID from token:", req.user);
console.log("Feedback received:", req.body.feedback);

};


// Upvote Toggle
export const upvoteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    const userId = req.user.id;
    const alreadyVoted = complaint.upvotes.includes(userId);

    if (alreadyVoted) {
      complaint.upvotes.pull(userId);
    } else {
      complaint.upvotes.push(userId);
    }

    await complaint.save();

    req.app.get('io').emit('voteUpdate', {
      complaintId: complaint._id.toString(),
    });

    res.json({ message: alreadyVoted ? 'Vote removed 👎' : 'Voted 👍', votes: complaint.upvotes.length });
  } catch (err) {
    res.status(500).json({ message: 'Voting error 🛑', error: err.message });
  }
};

// Commenting
export const addComment = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    const { text } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    complaint.comments.push({
      user: req.user.id,
      text: text.trim(),
      createdAt: new Date(),
    });

    await complaint.save();
    await complaint.populate({ path: 'comments.user', select: 'name' });

    res.status(201).json(complaint.comments.at(-1));
  } catch (err) {
    res.status(500).json({ message: 'Failed to add comment', error: err.message });
  }
};

// Geo Nearby
export const getNearbyComplaints = async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;
    const complaints = await Complaint.find({
      location: {
        $geoWithin: {
          $centerSphere: [[parseFloat(lng), parseFloat(lat)], parseFloat(radius) / 6378.1],
        },
      },
    });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: 'Geo query failed 🌍', error: err.message });
  }
};

// Heatmap
export const getHeatmapData = async (req, res) => {
  try {
    const complaints = await Complaint.find();

    const heatData = complaints.map(c => ({
      lat: c.location.coordinates[1],
      lng: c.location.coordinates[0],
      intensity:
        (c.severity * 1.5) +
        ((Date.now() - c.createdAt) / (1000 * 60 * 60 * 24) * 1.2) +
        (c.upvotes.length * 1.3),
    }));

    res.json(heatData);
  } catch (err) {
    res.status(500).json({ message: 'Heatmap error', error: err.message });
  }
};

// Get User Complaints
export const getUserComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ createdBy: req.user.id })
      .populate('comments.user', 'name')
      .populate('verifiers', 'name');

    res.json(complaints);
  } catch (err) {
    console.error("❌ Failed to get user complaints:", err);
    res.status(500).json({ message: 'Failed to fetch user complaints', error: err.message });
  }
};
