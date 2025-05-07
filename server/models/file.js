import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const fileSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
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
    index: { expireAfterSeconds: 0 }, // TTL index for auto-deletion
  },
}, { timestamps: true });

// Virtual for share URL
fileSchema.virtual('shareUrl').get(function () {
  return `${process.env.CLIENT_URL || 'http://localhost:3000'}/file/${this._id}`;
});

// Include virtuals when converting to JSON
fileSchema.set('toJSON', { virtuals: true });
fileSchema.set('toObject', { virtuals: true });

const File = mongoose.model('File', fileSchema);

export default File;