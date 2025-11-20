import { Request, Response } from 'express';

import { getUserById } from '../../../services/queries/users';
import { commonLikedItems, likedItems } from '../../../services/queries/likes';

const serializeItem = (item: any) => ({
	...item,
	createdAt: item.createdAt?.toMillis ? item.createdAt.toMillis() : item.createdAt,
	endingAt: item.endingAt?.toMillis ? item.endingAt.toMillis() : item.endingAt
});

export const getUserProfileHandler = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const viewerId = req.session?.userId;

		const user = await getUserById(id);
		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		const [sharedItems, liked] = await Promise.all([
			viewerId ? commonLikedItems(id, viewerId) : [],
			likedItems(id)
		]);

		return res.status(200).json({
			username: user.username,
			sharedItems: (sharedItems ?? []).map(serializeItem),
			likedItems: (liked ?? []).map(serializeItem)
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Internal server error';
		return res.status(500).json({ error: message });
	}
};
