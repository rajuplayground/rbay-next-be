import { Router } from 'express';

import { createItemHandler } from './handlers/items/create-item';
import { getItemHandler } from './handlers/items/get-item';
import { likeItemHandler, unlikeItemHandler } from './handlers/items/likes';
import { getUserProfileHandler } from './handlers/users/get-user-profile';
const router = Router();

router.post('/items/new', createItemHandler);
router.get('/items/:id', getItemHandler);
router.post('/items/:id/likes', likeItemHandler);
router.delete('/items/:id/likes', unlikeItemHandler);
router.get('/users/:id', getUserProfileHandler);

export default router;
