import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { initiate, myTransactions, updateStatus } from '../controllers/transactionController.js';

const router = Router();

router.get('/', auth, myTransactions);
router.post('/initiate', auth, initiate);
router.patch('/:id/status', auth, updateStatus);

export default router;
