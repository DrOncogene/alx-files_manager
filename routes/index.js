import express from 'express';
import { getStats, getStatus } from '../controllers/AppController';
import postNew from '../controllers/UsersController'

const router = express.Router();

router.use((req, res, next) => {
  next();
});

router.get('/status', getStatus);
router.get('/stats', getStats);
router.post('/users', postNew);

export default router;
