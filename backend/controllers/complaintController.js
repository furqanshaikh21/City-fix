import Complaint from '../models/Complaint.js';

export const createComplaint = async (req, res) => {
  try {
    const { title, description, category, severity, location, address } = req.body;

    const loc = location ? JSON.parse(location) : null;

    const media = req.file ? [`/uploads/${req.file.filename}`] : [];

    const complaint = await Complaint.create({
      title,
      description,
      category,
      severity,
      address, // <-- added here
      media,
      createdBy: req.user?.id || null,
      location: loc
        ? {
            type: 'Point',
            coordinates: [loc.coordinates[0], loc.coordinates[1]],
          }
        : undefined,
    });

    res.status(201).json(complaint);
  } catch (err) {
    console.error('Create Complaint Error:', err);
    res.status(500).json({ message: 'Failed to create complaint', error: err.message });
  }
};


// ... rest of your complaintController functions unchanged ...

export const getAllComplaints = async (req, res) => {
  const complaints = await Complaint.find().populate('createdBy', 'name role');
  res.json(complaints);
};

export const getNearbyComplaints = async (req, res) => {
  try {
    const { lat, lng, radius } = req.query; // radius in km

    const complaints = await Complaint.find({
      location: {
        $geoWithin: {
          $centerSphere: [
            [parseFloat(lng), parseFloat(lat)],
            parseFloat(radius) / 6378.1 // Earth radius in km
          ]
        }
      }
    });

    res.json(complaints);
  } catch (err) {
    console.error('🌍 Geo Query Error:', err);
    res.status(500).json({ message: 'Could not fetch nearby complaints bro 😢' });
  }
};

export const getHeatmapData = async (req, res) => {
  try {
    const complaints = await Complaint.find();

    const heatData = complaints.map(c => ({
      lat: c.location.coordinates[1],
      lng: c.location.coordinates[0],
      intensity:
        (c.severity * 1.5) +
        ((Date.now() - c.createdAt) / (1000 * 60 * 60 * 24) * 1.2) +
        (c.upvotes.length * 1.3)
    }));

    res.json(heatData);
  } catch (err) {
    res.status(500).json({ message: 'Heatmap data fetch failed bro 🔥😢' });
  }
};

export const upvoteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found bro 😢' });
    }

    // Prevent duplicate votes
    const alreadyVoted = complaint.upvotes.includes(req.user._id);
    if (alreadyVoted) {
      // Remove vote
      complaint.upvotes.pull(req.user._id);
      await complaint.save();
      return res.json({ message: 'Vote removed bro 👎', votes: complaint.upvotes.length });
    }

    // Add vote
    complaint.upvotes.push(req.user._id);
    await complaint.save();

    res.json({ message: 'Upvoted! 🔥', votes: complaint.upvotes.length });
  } catch (err) {
    res.status(500).json({ message: 'Voting error 🛑', error: err.message });
  }
};

export const markAsResolved = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    complaint.isResolved = true;
    complaint.verificationStatus = 'Pending';
    await complaint.save();

    // TODO: Notify upvoters and submitter 🔔

    res.json({ message: 'Marked as resolved. Awaiting verification.' });
  } catch (err) {
    res.status(500).json({ message: 'Error marking resolved', error: err.message });
  }
};

export const verifyResolution = async (req, res) => {
  const { feedback } = req.body; // 'Confirmed' or 'Rejected'

  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint || !complaint.isResolved) {
      return res.status(400).json({ message: 'Invalid complaint or not yet resolved' });
    }

    if (complaint.verifiers.includes(req.user._id)) {
      return res.status(403).json({ message: 'You already verified' });
    }

    complaint.verifiers.push(req.user._id);

    // Count confirmations/rejections
    const totalVoters = [complaint.createdBy, ...complaint.upvotes.map(u => u.toString())];
    const confirmations = complaint.verifiers.length;

    // Heuristic: If 50%+ verifiers reject, reopen
    if (feedback === 'Rejected') {
      const rejectionCount = complaint.verifiers.filter(v => v.equals(req.user._id)).length;
      if (rejectionCount >= Math.ceil(totalVoters.length / 2)) {
        complaint.isResolved = false;
        complaint.verificationStatus = 'Rejected';
        await complaint.save();
        return res.json({ message: 'Complaint reopened due to feedback!' });
      }
    }

    if (feedback === 'Confirmed' && confirmations >= Math.ceil(totalVoters.length / 2)) {
      complaint.verificationStatus = 'Confirmed';
    }

    await complaint.save();
    res.json({ message: 'Thanks for verifying!', status: complaint.verificationStatus });
  } catch (err) {
    res.status(500).json({ message: 'Verification error', error: err.message });
  }
};
