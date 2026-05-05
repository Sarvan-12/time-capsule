const mongoose = require('mongoose');

const capsuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Please add content'],
  },
  coverImage: {
    type: String,
    default: 'https://res.cloudinary.com/demo/image/upload/v1625121234/default-capsule.png',
  },
  media: [
    {
      type: String,
    },
  ],
  tags: [
    {
      type: String,
    },
  ],
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  recipients: [
    {
      email: String,
      userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    },
  ],
  unlockDate: {
    type: Date,
    required: [true, 'Please add an unlock date'],
  },
  deliveryMode: {
    type: String,
    enum: ['email', 'in-app', 'both'],
    default: 'in-app',
  },
  privacy: {
    type: String,
    enum: ['private', 'shared', 'public'],
    default: 'private',
  },
  passwordHash: {
    type: String,
  },
  status: {
    type: String,
    enum: ['draft', 'sealed', 'delivered'],
    default: 'draft',
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
  recurringInterval: {
    type: String,
    enum: ['yearly', null],
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deliveredAt: {
    type: Date,
  },
});

module.exports = mongoose.model('Capsule', capsuleSchema);
