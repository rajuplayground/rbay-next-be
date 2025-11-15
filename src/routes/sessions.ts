import { Router, Request, Response } from 'express';
import { getSessionFromCookies } from '../services/session';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
	try {
		const session = await getSessionFromCookies(req);
		return res.status(200).json(session || { id: '', userId: '', username: '' });
	} catch (error) {
		const message = error instanceof Error ? error.message : 'An error occurred';
		return res.status(500).json({ error: message });
	}
});

export default router;
