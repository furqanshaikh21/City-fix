import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },

  severity: { type: Number, default: 1 }, // 1-5 scale
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending'
  },

  address: {
    type: String,
    required: true,
  },

  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }, // [lng, lat]
  },

  media: [String], // URLs or paths

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: String,
      createdAt: { type: Date, default: Date.now },
    }
  ],

  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  isResolved: { type: Boolean, default: false },

  verificationStatus: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Rejected'],
    default: 'Pending',
  },

  verifiers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

complaintSchema.virtual('urgencyScore').get(function () {
  const ageInDays = (Date.now() - this.createdAt) / (1000 * 60 * 60 * 24);
  return (
    (this.severity * 1.5) +
    (ageInDays * 1.2) +
    (this.upvotes.length * 1.3)
  );
});

complaintSchema.index({ location: '2dsphere' });

complaintSchema.set('toJSON', { virtuals: true });
complaintSchema.set('toObject', { virtuals: true });

export default mongoose.model('Complaint', complaintSchema);
