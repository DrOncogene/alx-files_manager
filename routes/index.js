import express from 'express';
import { getStats, getStatus } from '../controllers/AppController';

const router = express.Router();

router.use((req, res, next) => {
  next();
});

router.use('/status', getStatus);
router.use('/stats', getStats);

export default router;
