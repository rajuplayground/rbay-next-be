import { Request, Response } from 'express';
import { getItem } from '../../../services/queries/items/items';

export const getItemHandler = async (req: Request, res: Response) => {
	const { id } = req.params;
	const item = await getItem(id);
	console.log(item);

	if (!item) {
		return res.status(404).json({ error: 'Item not found' });
	}
	return res.status(200).json({ item });
};
