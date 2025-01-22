import { Router } from 'express';
import { CostController } from '../controller/CostController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';

const router = Router();
router.use(authMiddleware);

router.get('/priceNeeded', roleMiddleware(['muhasebe','admin']), CostController.listPriceNeeded);
router.post('/setPrice', roleMiddleware(['muhasebe','admin']), CostController.setProductPrice);
router.get('/all', roleMiddleware(['muhasebe','admin']), CostController.listAll);
router.get('/export', roleMiddleware(['muhasebe','admin']), CostController.exportCostsCSV);

export default router;
