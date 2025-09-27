import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { createBook, listBooks, getBook, myBooks } from '../controllers/bookController.js';
import { upload } from '../middleware/upload.js';
import { deleteBook } from '../controllers/bookController.js';
const router = Router();

router.get('/', listBooks);
router.get('/mine', auth, myBooks);
router.get('/:id', getBook);
router.post('/', auth, upload.array('images', 3), createBook);
router.delete('/:id', auth, deleteBook);
export default router;
