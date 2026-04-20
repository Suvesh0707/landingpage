import mongoose, { Schema, models } from 'mongoose';

const SubmissionSchema = new Schema({
  fullName: { type: String, required: true },
  phone:    { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Submission = models.Submission || mongoose.model('Submission', SubmissionSchema);

export default Submission;
