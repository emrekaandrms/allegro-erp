import { Router } from 'express';
import { SEOController } from '../controller/SEOController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';

const router = Router();
router.use(authMiddleware);

router.get('/seoNeeded', roleMiddleware(['seo','admin']), SEOController.listSEORequired);
router.post('/setSEO', roleMiddleware(['seo','admin']), SEOController.setSEOInfo);

export default router;
