import { Request, Response } from 'express';

import { likeItem, unlikeItem } from '../../../services/queries/likes';
import { getItem } from '../../../services/queries/items/items';

const serializeItem = (item: any) => ({
	...item,
	createdAt: item.createdAt.toMillis ? item.createdAt.toMillis() : item.createdAt,
	endingAt: item.endingAt.toMillis ? item.endingAt.toMillis() : item.endingAt
});

const ensureSession = (req: Request, res: Response) => {
	if (!req.session?.userId) {
		res.status(401).json({ error: 'Unauthorized' });
		return null;
	}

	return req.session.userId;
};

export const likeItemHandler = async (req: Request, res: Response) => {
	const userId = ensureSession(req, res);
	if (!userId) {
		return;
	}

	await likeItem(req.params.id, userId);
	const item = await getItem(req.params.id);

	if (!item) {
		return res.status(404).json({ error: 'Item not found' });
	}

	return res.status(201).json({ item: serializeItem(item), userLikes: true });
};

export const unlikeItemHandler = async (req: Request, res: Response) => {
	const userId = ensureSession(req, res);
	if (!userId) {
		return;
	}

	await unlikeItem(req.params.id, userId);
	const item = await getItem(req.params.id);

	if (!item) {
		return res.status(404).json({ error: 'Item not found' });
	}

	return res.status(200).json({ item: serializeItem(item), userLikes: false });
};
