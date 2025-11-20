import { Request, Response } from 'express';

import { getItem } from '../../../services/queries/items/items';
import { userLikesItem } from '../../../services/queries/likes';

const serializeItem = (item: any) => ({
	...item,
	createdAt: item.createdAt.toMillis ? item.createdAt.toMillis() : item.createdAt,
	endingAt: item.endingAt.toMillis ? item.endingAt.toMillis() : item.endingAt
});

export const getItemHandler = async (req: Request, res: Response) => {
	const { id } = req.params;
	const session = req.session;
	const item = await getItem(id);

	if (!item) {
		return res.status(404).json({ error: 'Item not found' });
	}

	const userId = session?.userId;
	const userLikes = userId ? await userLikesItem(id, userId) : false;
	const userHasHighBid = userId ? item.highestBidUserId === userId : false;

	return res.status(200).json({
		item: serializeItem(item),
		userLikes,
		userHasHighBid
	});
};
