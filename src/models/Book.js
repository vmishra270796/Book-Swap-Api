import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    condition: { type: String, enum: ['new', 'like-new', 'good', 'fair'], default: 'good' },
    description: { type: String, default: '' },
    category: { type: String, default: 'general' },
    images: [{ type: String }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export const Book = mongoose.model('Book', bookSchema);
