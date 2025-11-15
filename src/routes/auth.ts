import { Router, Request, Response } from 'express';
import { signup, signin } from '../services/auth/auth';
import { getSessionFromRequest, setSessionCookie, unsetSessionCookie } from '../services/session';
import { saveSession } from '../services/queries/sessions';

const router = Router();

router.post('/signup', async (req: Request, res: Response) => {
	try {
		const { username, password } = req.body;

		if (!username || !password) {
			return res.status(400).json({ error: 'Username and password are required' });
		}

		const userId = await signup(username, password);

		const session = await getSessionFromRequest(req);
		session.userId = userId;
		session.username = username;

		await saveSession(session);

		setSessionCookie(res, session);

		return res.status(200).json({ success: true, userId });
	} catch (error) {
		const message = error instanceof Error ? error.message : 'An error occurred';
		return res.status(400).json({ error: message });
	}
});

router.post('/signin', async (req: Request, res: Response) => {
	try {
		const { username, password } = req.body;

		if (!username || !password) {
			return res.status(400).json({ error: 'Username and password are required' });
		}

		const userId = await signin(username, password);

		const session = await getSessionFromRequest(req);
		session.userId = userId;
		session.username = username;

		await saveSession(session);

		setSessionCookie(res, session);

		return res.status(200).json({ success: true, userId });
	} catch (error) {
		const message = error instanceof Error ? error.message : 'An error occurred';
		return res.status(400).json({ error: message });
	}
});

router.post('/signout', async (req: Request, res: Response) => {
	try {
		unsetSessionCookie(res);
		return res.status(200).json({ success: true });
	} catch (error) {
		const message = error instanceof Error ? error.message : 'An error occurred';
		return res.status(400).json({ error: message });
	}
});

export default router;
