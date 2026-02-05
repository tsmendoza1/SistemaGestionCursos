import request from 'supertest';
import app from '../index';
import pool from '../db';

// Mock pg pool
jest.mock('../db', () => ({
    __esModule: true,
    default: {
        query: jest.fn(),
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

            (pool.query as jest.Mock).mockResolvedValue({ rows: mockCursos });

            const response = await request(app).get('/cursos');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockCursos);
            expect(pool.query).toHaveBeenCalledWith('SELECT * FROM cursos ORDER BY id ASC', []);
        });

        it('should filter cursos by area', async () => {
            const mockCursos = [
                { id: 1, nombre: 'Matemáticas', descripcion: 'Curso de matemáticas', creditos: 4, area: 'Ingeniería' },
            ];

            (pool.query as jest.Mock).mockResolvedValue({ rows: mockCursos });

            const response = await request(app).get('/cursos?area=Ingeniería');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockCursos);
            expect(pool.query).toHaveBeenCalledWith('SELECT * FROM cursos WHERE area = $1 ORDER BY id ASC', ['Ingeniería']);
        });

        it('should handle errors', async () => {
            (pool.query as jest.Mock).mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/cursos');

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error');
        });
    });

    describe('GET /cursos/promedio-creditos', () => {
        it('should return average credits', async () => {
            (pool.query as jest.Mock).mockResolvedValue({
                rows: [{ promedio: '4.5' }],
            });

            const response = await request(app).get('/cursos/promedio-creditos');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ promedioCreditos: 4.5 });
        });

        it('should return 0 when no cursos exist', async () => {
            (pool.query as jest.Mock).mockResolvedValue({
                rows: [{ promedio: null }],
            });

            const response = await request(app).get('/cursos/promedio-creditos');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ promedioCreditos: 0 });
        });
    });

    describe('GET /cursos/:id', () => {
        it('should return a curso by id', async () => {
            const mockCurso = { id: 1, nombre: 'Matemáticas', descripcion: 'Curso de matemáticas', creditos: 4, area: 'Ciencias' };

            (pool.query as jest.Mock).mockResolvedValue({ rows: [mockCurso] });

            const response = await request(app).get('/cursos/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockCurso);
        });

        it('should return 404 when curso not found', async () => {
            (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

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

            (pool.query as jest.Mock).mockResolvedValue({ rows: [createdCurso] });

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

            (pool.query as jest.Mock).mockResolvedValue({ rows: [updatedCurso] });

            const response = await request(app).put('/cursos/1').send({
                nombre: 'Matemáticas Avanzadas',
                creditos: 5,
            });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(updatedCurso);
        });

        it('should return 404 when curso not found', async () => {
            (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

            const response = await request(app).put('/cursos/999').send({
                nombre: 'Test',
            });

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', 'Curso not found');
        });
    });

    describe('DELETE /cursos/:id', () => {
        it('should delete a curso', async () => {
            (pool.query as jest.Mock).mockResolvedValue({ rows: [{ id: 1 }] });

            const response = await request(app).delete('/cursos/1');

            expect(response.status).toBe(204);
        });

        it('should return 404 when curso not found', async () => {
            (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

            const response = await request(app).delete('/cursos/999');

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', 'Curso not found');
        });
    });
});
