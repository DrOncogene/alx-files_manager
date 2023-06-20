import express from 'express';
import { getStats, getStatus } from '../controllers/AppController';
import postNew from '../controllers/UsersController';
import { getConnect, getDisconnect, getMe } from '../controllers/AuthController';
import {
  postUpload, getShow, getIndex, putPublish, putUnpublish, getFile,
} from '../controllers/FilesController';

const router = express.Router();

router.use((req, res, next) => {
  next();
});

router.get('/status', getStatus);
router.get('/stats', getStats);
router.post('/users', postNew);
router.get('/connect', getConnect);
router.get('/disconnect', getDisconnect);
router.get('/users/me', getMe);
router.post('/files', postUpload);
router.get('/files/:id', getShow);
router.get('/files', getIndex);
router.put('/files/:id/publish', putPublish);
router.put('/files/:id/unpublish', putUnpublish);
router.get('/files/:id/data', getFile);

export default router;
