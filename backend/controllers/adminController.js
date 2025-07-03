// controllers/adminController.js
import Admin from '../models/Admin.js';
import Complaint from '../models/Complaint.js';
import generateToken from '../utils/generateToken.js';

export const loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });

  if (admin && (await admin.matchPassword(password))) {
    res.json({
      token: generateToken(admin._id),
      admin: {
        _id: admin._id,
        username: admin.username,
        role: "admin" // Include role explicitly
      },
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};


// console.log('Username:', username);
// console.log('Found admin:', admin);
// if (admin) {
//   const match = await admin.matchPassword(password);
//   console.log('Password match:', match);
// }


export const getAllComplaints = async (req, res) => {
  const complaints = await Complaint.find({});
  res.json(complaints);
};

export const updateComplaintStatus = async (req, res) => {
  const { status } = req.body;
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

  if (status === 'Resolved') {
    complaint.status = 'In Progress'; // App logic: Wait for user to confirm
    complaint.verificationStatus = 'Pending';
    complaint.isResolved = true; // ✅ Mark resolved to show in user's verification
  } else {
    complaint.status = status;
  }

  await complaint.save();
  res.json({ message: 'Status updated ✅', complaint });
};
