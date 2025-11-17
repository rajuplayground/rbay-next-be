import { Router } from 'express';

import { createItemHandler } from './handlers/items/create-item';
import { getItemHandler } from './handlers/items/get-item';
const router = Router();

router.post('/items/new', createItemHandler);
router.get('/items/:id', getItemHandler);

export default router;
