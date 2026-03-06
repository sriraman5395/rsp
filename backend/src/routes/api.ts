// src/routes/api.ts
import { Router, Request, Response } from 'express';
import { pool, checkDbConnection } from '../db';

export const apiRouter = Router();


apiRouter.get('/markers/:id/images', async (req: Request, res: Response) => {
  const markerId = req.params.id;

  try {
    const [rows]: any = await pool.query(
      'SELECT id, filename, caption FROM marker_images WHERE marker_id = ?',
      [markerId]
    );

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const images = rows.map((img: any) => ({
      id: img.id,
      url: `${baseUrl}/uploads/${img.filename}`,
      caption: img.caption || img.filename
    }));

    return res.json(images);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch images' });
  }
});

apiRouter.get('/markers', async (req: Request, res: Response) => {
  try {
    const ok = await checkDbConnection();
    if (!ok) return res.status(503).json({ error: 'Database not connected' });

    const [rows]: any = await pool.query('SELECT * FROM markers');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});