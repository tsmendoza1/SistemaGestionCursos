import { Router, Request, Response } from 'express';
import prisma from '../prisma';

const router = Router();

// GET /cursos - List all courses or filter by area
router.get('/', async (req: Request, res: Response) => {
    try {
        const { area } = req.query;

        const cursos = await prisma.curso.findMany({
            where: area ? { area: area as string } : undefined,
            orderBy: { id: 'asc' },
        });

        res.json(cursos);
    } catch (error) {
        console.error('Error fetching cursos:', error);
        res.status(500).json({ error: 'Error fetching cursos' });
    }
});

// GET /cursos/promedio-creditos - Calculate average credits
router.get('/promedio-creditos', async (req: Request, res: Response) => {
    try {
        const result = await prisma.curso.aggregate({
            _avg: {
                creditos: true,
            },
        });

        res.json({
            promedioCreditos: result._avg.creditos || 0,
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

        const curso = await prisma.curso.findUnique({
            where: { id: parseInt(id) },
        });

        if (!curso) {
            return res.status(404).json({ error: 'Curso not found' });
        }

        res.json(curso);
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

        const curso = await prisma.curso.create({
            data: {
                nombre,
                descripcion,
                creditos: parseInt(creditos),
                area,
            },
        });

        res.status(201).json(curso);
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

        const curso = await prisma.curso.update({
            where: { id: parseInt(id) },
            data: {
                ...(nombre && { nombre }),
                ...(descripcion && { descripcion }),
                ...(creditos !== undefined && { creditos: parseInt(creditos) }),
                ...(area && { area }),
            },
        });

        res.json(curso);
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Curso not found' });
        }
        console.error('Error updating curso:', error);
        res.status(500).json({ error: 'Error updating curso' });
    }
});

// DELETE /cursos/:id - Delete course
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

        await prisma.curso.delete({
            where: { id: parseInt(id) },
        });

        res.status(204).send();
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Curso not found' });
        }
        console.error('Error deleting curso:', error);
        res.status(500).json({ error: 'Error deleting curso' });
    }
});

export default router;
