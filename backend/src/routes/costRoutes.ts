import express from 'express';
import { CostController } from '../controller/CostController';
import { roleMiddleware } from '../middleware/roleMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Auth middleware'ini ekle
router.use(authMiddleware);

// Fiyatlama işlemleri için route'lar
router.post('/create', roleMiddleware(['muhasebe','admin']), CostController.createCost);
router.get('/list', roleMiddleware(['muhasebe','admin']), CostController.listCosts);
router.get('/export', roleMiddleware(['muhasebe','admin']), CostController.exportCostsCSV);
router.put('/update/:productId', roleMiddleware(['muhasebe','admin']), CostController.updateCost);

export default router;
