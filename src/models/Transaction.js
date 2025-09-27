import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['initiated', 'accepted', 'rejected'], default: 'initiated' }
  },
  { timestamps: true }
);

export const Transaction = mongoose.model('Transaction', transactionSchema);
