import { Router, Request, Response } from 'express';

const router = Router();

router.get('/hello', async (req: Request, res: Response) => {
  // Session is already validated by requireAuth middleware
  // and attached to req.session
  return res.status(200).json({ message: 'hello' });
});

export default router;
