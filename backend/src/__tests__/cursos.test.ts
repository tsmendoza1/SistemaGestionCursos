import request from 'supertest';
import app from '../index';
import prisma from '../prisma';

// Mock Prisma client
jest.mock('../prisma', () => ({
    __esModule: true,
    default: {
        curso: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            aggregate: jest.fn(),
        },
    },
}));

describe('Cursos API', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /cursos', () => {
        it('should return all cursos', async () => {
            const mockCursos = [
                { id: 1, nombre: 'Matemáticas', descripcion: 'Curso de matemáticas', creditos: 4, area: 'Ciencias' },
                { id: 2, nombre: 'Física', descripcion: 'Curso de física', creditos: 5, area: 'Ciencias' },
            ];

            (prisma.curso.findMany as jest.Mock).mockResolvedValue(mockCursos);

            const response = await request(app).get('/cursos');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockCursos);
            expect(prisma.curso.findMany).toHaveBeenCalledWith({
                where: undefined,
                orderBy: { id: 'asc' },
            });
        });

        it('should filter cursos by area', async () => {
            const mockCursos = [
                { id: 1, nombre: 'Matemáticas', descripcion: 'Curso de matemáticas', creditos: 4, area: 'Ingeniería' },
            ];

            (prisma.curso.findMany as jest.Mock).mockResolvedValue(mockCursos);

            const response = await request(app).get('/cursos?area=Ingeniería');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockCursos);
            expect(prisma.curso.findMany).toHaveBeenCalledWith({
                where: { area: 'Ingeniería' },
                orderBy: { id: 'asc' },
            });
        });

        it('should handle errors', async () => {
            (prisma.curso.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/cursos');

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error');
        });
    });

    describe('GET /cursos/promedio-creditos', () => {
        it('should return average credits', async () => {
            (prisma.curso.aggregate as jest.Mock).mockResolvedValue({
                _avg: { creditos: 4.5 },
            });

            const response = await request(app).get('/cursos/promedio-creditos');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ promedioCreditos: 4.5 });
        });

        it('should return 0 when no cursos exist', async () => {
            (prisma.curso.aggregate as jest.Mock).mockResolvedValue({
                _avg: { creditos: null },
            });

            const response = await request(app).get('/cursos/promedio-creditos');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ promedioCreditos: 0 });
        });
    });

    describe('GET /cursos/:id', () => {
        it('should return a curso by id', async () => {
            const mockCurso = { id: 1, nombre: 'Matemáticas', descripcion: 'Curso de matemáticas', creditos: 4, area: 'Ciencias' };

            (prisma.curso.findUnique as jest.Mock).mockResolvedValue(mockCurso);

            const response = await request(app).get('/cursos/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockCurso);
        });

        it('should return 404 when curso not found', async () => {
            (prisma.curso.findUnique as jest.Mock).mockResolvedValue(null);

            const response = await request(app).get('/cursos/999');

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', 'Curso not found');
        });
    });

    describe('POST /cursos', () => {
        it('should create a new curso', async () => {
            const newCurso = {
                nombre: 'Química',
                descripcion: 'Curso de química',
                creditos: 3,
                area: 'Ciencias',
            };

            const createdCurso = { id: 1, ...newCurso };

            (prisma.curso.create as jest.Mock).mockResolvedValue(createdCurso);

            const response = await request(app).post('/cursos').send(newCurso);

            expect(response.status).toBe(201);
            expect(response.body).toEqual(createdCurso);
        });

        it('should return 400 when missing required fields', async () => {
            const response = await request(app).post('/cursos').send({
                nombre: 'Química',
            });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Missing required fields');
        });
    });

    describe('PUT /cursos/:id', () => {
        it('should update a curso', async () => {
            const updatedCurso = {
                id: 1,
                nombre: 'Matemáticas Avanzadas',
                descripcion: 'Curso actualizado',
                creditos: 5,
                area: 'Ciencias',
            };

            (prisma.curso.update as jest.Mock).mockResolvedValue(updatedCurso);

            const response = await request(app).put('/cursos/1').send({
                nombre: 'Matemáticas Avanzadas',
                creditos: 5,
            });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(updatedCurso);
        });

        it('should return 404 when curso not found', async () => {
            (prisma.curso.update as jest.Mock).mockRejectedValue({ code: 'P2025' });

            const response = await request(app).put('/cursos/999').send({
                nombre: 'Test',
            });

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', 'Curso not found');
        });
    });

    describe('DELETE /cursos/:id', () => {
        it('should delete a curso', async () => {
            (prisma.curso.delete as jest.Mock).mockResolvedValue({});

            const response = await request(app).delete('/cursos/1');

            expect(response.status).toBe(204);
        });

        it('should return 404 when curso not found', async () => {
            (prisma.curso.delete as jest.Mock).mockRejectedValue({ code: 'P2025' });

            const response = await request(app).delete('/cursos/999');

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', 'Curso not found');
        });
    });
});
