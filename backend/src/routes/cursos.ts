import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// GET /cursos - List all courses or filter by area
router.get('/', async (req: Request, res: Response) => {
    try {
        const { area } = req.query;

        let query = 'SELECT * FROM cursos';
        const params: any[] = [];

        if (area) {
            query += ' WHERE area = $1';
            params.push(area);
        }

        query += ' ORDER BY id ASC';

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching cursos:', error);
        res.status(500).json({ error: 'Error fetching cursos' });
    }
});

// GET /cursos/promedio-creditos - Calculate average credits
router.get('/promedio-creditos', async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT AVG(creditos) as promedio FROM cursos');

        res.json({
            promedioCreditos: parseFloat(result.rows[0].promedio) || 0,
        });
    } catch (error) {
        console.error('Error calculating average:', error);
        res.status(500).json({ error: 'Error calculating average credits' });
    }
});

// GET /cursos/:id - Get course by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

        const result = await pool.query('SELECT * FROM cursos WHERE id = $1', [parseInt(id)]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Curso not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching curso:', error);
        res.status(500).json({ error: 'Error fetching curso' });
    }
});

// POST /cursos - Create new course
router.post('/', async (req: Request, res: Response) => {
    try {
        const { nombre, descripcion, creditos, area } = req.body;

        if (!nombre || !descripcion || creditos === undefined || !area) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const result = await pool.query(
            'INSERT INTO cursos (nombre, descripcion, creditos, area) VALUES ($1, $2, $3, $4) RETURNING *',
            [nombre, descripcion, parseInt(creditos), area]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating curso:', error);
        res.status(500).json({ error: 'Error creating curso' });
    }
});

// PUT /cursos/:id - Update course
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const { nombre, descripcion, creditos, area } = req.body;

        const updates: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        if (nombre) {
            updates.push(`nombre = $${paramCount++}`);
            values.push(nombre);
        }
        if (descripcion) {
            updates.push(`descripcion = $${paramCount++}`);
            values.push(descripcion);
        }
        if (creditos !== undefined) {
            updates.push(`creditos = $${paramCount++}`);
            values.push(parseInt(creditos));
        }
        if (area) {
            updates.push(`area = $${paramCount++}`);
            values.push(area);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        values.push(parseInt(id));
        const query = `UPDATE cursos SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Curso not found' });
        }

        res.json(result.rows[0]);
    } catch (error: any) {
        console.error('Error updating curso:', error);
        res.status(500).json({ error: 'Error updating curso' });
    }
});

// DELETE /cursos/:id - Delete course
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

        const result = await pool.query('DELETE FROM cursos WHERE id = $1 RETURNING id', [parseInt(id)]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Curso not found' });
        }

        res.status(204).send();
    } catch (error: any) {
        console.error('Error deleting curso:', error);
        res.status(500).json({ error: 'Error deleting curso' });
    }
});

export default router;
