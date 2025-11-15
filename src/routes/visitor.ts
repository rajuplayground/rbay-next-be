import { Router, Request, Response } from 'express';
import { client } from '../config/redis';
import { visitorsKey } from '../utils/keys';
import { genId } from '../utils/gen-id';

const router = Router();

router.get('/track', async (req: Request, res: Response) => {
	try {
		const page = req.query.page || '/';
		let vid = req.cookies.visitor_id;
		if (!vid) {
			vid = genId();
			res.cookie('visitor_id', vid, {
				httpOnly: true,
				sameSite: 'lax',
				path: '/'
			});
		}
		await client.hIncrBy(visitorsKey(vid), page as string, 1);
		await client.expire(visitorsKey(vid), 30 * 24 * 60 * 60);
		return res.json({ message: `Welcome ${vid} to ${page}` });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

export default router;
