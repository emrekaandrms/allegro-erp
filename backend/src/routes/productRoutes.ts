import { Router } from 'express';
import { ProductController } from '../controller/ProductController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';

const router = Router();
router.use(authMiddleware);

router.post('/create', roleMiddleware(['operasyon','admin']), ProductController.createProduct);
router.post('/setPhotoRequired', roleMiddleware(['operasyon','admin']), ProductController.setPhotoRequired);
router.get('/list', roleMiddleware(['operasyon','fotoğraf','muhasebe','seo','admin']), ProductController.listProducts);
router.get('/export', roleMiddleware(['admin','operasyon']), ProductController.exportProductsCSV);

export default router;
