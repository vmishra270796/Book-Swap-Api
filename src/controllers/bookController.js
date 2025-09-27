import { z } from 'zod';
import { Book } from '../models/Book.js';

const bookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  price: z.coerce.number().nonnegative(),
  condition: z.enum(['new', 'like-new', 'good', 'fair']).optional().default('good'),
  description: z.string().optional().default(''),
  category: z.string().optional().default('general')
});

export const createBook = async (req, res) => {
  const parsed = bookSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid input' });

  const imagePaths = req.files?.map(f => `/uploads/${f.filename}`) || [];

  const book = await Book.create({
    ...parsed.data,
    images: imagePaths,
    owner: req.user._id
  });

  res.status(201).json({ book });
};

export const listBooks = async (req, res) => {
  const { title, author, category, page = 1, limit = 6 } = req.query;
  const query = {};

  if (title) query.title = { $regex: title, $options: 'i' };
  if (author) query.author = { $regex: author, $options: 'i' };
  if (category) query.category = { $regex: category, $options: 'i' };

  const skip = (Number(page) - 1) * Number(limit);

  const [books, total] = await Promise.all([
    Book.find(query)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Book.countDocuments(query)
  ]);

  res.json({
    books,
    total,
    page: Number(page),
    hasMore: skip + books.length < total
  });
};

export const getBook = async (req, res) => {
  const book = await Book.findById(req.params.id).populate('owner', 'name email');
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json({ book });
};

export const myBooks = async (req, res) => {
  const books = await Book.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.json({ books });
};

export const deleteBook = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: 'Book not found' });

  // Only the owner can delete
  if (String(book.owner) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Not authorized to delete this book' });
  }

  await book.deleteOne();
  res.json({ message: 'Book deleted successfully' });
};

