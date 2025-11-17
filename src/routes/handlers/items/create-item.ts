import { Request, Response } from 'express';
import { DateTime } from 'luxon';

import { createItem } from '../../../services/queries/items/items';
import { createImageUrl } from '../../../utils/image-url';

export const createItemHandler = async (req: Request, res: Response) => {
	const session = req.session!;

	const { name, description, duration } = req.body ?? {};

	if (
		typeof name !== 'string' ||
		typeof description !== 'string' ||
		(typeof duration !== 'number' && typeof duration !== 'string')
	) {
		return res.status(400).json({ error: 'Invalid payload' });
	}

	const durationSeconds = Number(duration);

	if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
		return res.status(400).json({ error: 'Duration must be a positive number' });
	}

	try {
		const now = DateTime.now();
		const id = await createItem({
			name,
			description,
			createdAt: now,
			endingAt: now.plus({ seconds: durationSeconds }),
			imageUrl: createImageUrl(),
			ownerId: session.userId,
			highestBidUserId: '',
			price: 0,
			views: 0,
			likes: 0,
			bids: 0,
			status: ''
		});

		return res.status(200).json({ id });
	} catch (error) {
		console.error('Failed to create item', error);
		return res.status(500).json({ error: 'Failed to create item' });
	}
};
