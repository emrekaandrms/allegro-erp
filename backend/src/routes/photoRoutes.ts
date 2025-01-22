import { Router } from 'express';
import { PhotoController } from '../controller/PhotoController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';

const router = Router();
router.use(authMiddleware);

router.get('/pending', roleMiddleware(['fotoğraf','admin']), PhotoController.listPending);
router.post('/upload', roleMiddleware(['fotoğraf','admin']), PhotoController.uploadPhoto);

export default router;
