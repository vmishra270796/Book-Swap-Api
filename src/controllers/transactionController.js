import { z } from 'zod';
import { Transaction } from '../models/Transaction.js';
import { Book } from '../models/Book.js';

const initiateSchema = z.object({
  bookId: z.string().min(1)
});

export const initiate = async (req, res) => {
  const parsed = initiateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid input' });

  const { bookId } = parsed.data;
  const book = await Book.findById(bookId).populate('owner', '_id');
  if (!book) return res.status(404).json({ message: 'Book not found' });
  if (String(book.owner._id) === String(req.user._id)) {
    return res.status(400).json({ message: 'Cannot buy your own book' });
  }

  const tx = await Transaction.create({
    book: book._id,
    buyer: req.user._id,
    seller: book.owner._id,
    status: 'initiated'
  });

  res.status(201).json({ transaction: tx });
};

export const myTransactions = async (req, res) => {
  const txs = await Transaction.find({
    $or: [{ buyer: req.user._id }, { seller: req.user._id }]
  })
    .populate('book', 'title price')
    .populate('buyer', 'name email')
    .populate('seller', 'name email')
    .sort({ createdAt: -1 });

  res.json({ transactions: txs });
};

export const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const tx = await Transaction.findById(id);
  if (!tx) return res.status(404).json({ message: 'Transaction not found' });
  if (String(tx.seller) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Only seller can update status' });
  }

  tx.status = status;
  await tx.save();
  res.json({ transaction: tx });
};
