import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  originalname: {
    type: String,
    required: true,
  },
  encoding: String,
  mimetype: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  downloadCount: {
    type: Number,
    default: 0,
  },
  uniqueId: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Virtual for share URL
fileSchema.virtual('shareUrl').get(function() {
  return `${process.env.CLIENT_URL || 'http://localhost:3000'}/file/${this._id}`;
});

// Include virtuals when converting to JSON
fileSchema.set('toJSON', { virtuals: true });
fileSchema.set('toObject', { virtuals: true });

// Add index for expiration cleanup
fileSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const File = mongoose.model('File', fileSchema);

export default File;