import { Router } from 'express';
import { AdminController } from '../controller/AdminController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';

const router = Router();
router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

router.get('/params', AdminController.listParams);
router.post('/params/update', AdminController.updateParam);
router.get('/users', AdminController.listUsers);
router.post('/users/create', AdminController.createUser);
// adminRoutes.ts
router.post('/users/updateRole', AdminController.updateUserRole);


export default router;
