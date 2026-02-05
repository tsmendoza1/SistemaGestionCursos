import { fetchCursos, fetchCursoById, createCurso, updateCurso, deleteCurso, fetchPromedioCreditos } from '../lib/api';

// Mock fetch globally
global.fetch = jest.fn();

describe('API Service', () => {
    const API_URL = 'http://localhost:3001';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchCursos', () => {
        it('should fetch all cursos', async () => {
            const mockCursos = [
                { id: 1, nombre: 'Test', descripcion: 'Test', creditos: 3, area: 'Test' },
            ];

            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => mockCursos,
            });

            const result = await fetchCursos();

            expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/cursos`);
            expect(result).toEqual(mockCursos);
        });

        it('should fetch cursos filtered by area', async () => {
            const mockCursos = [
                { id: 1, nombre: 'Test', descripcion: 'Test', creditos: 3, area: 'Ingeniería' },
            ];

            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => mockCursos,
            });

            const result = await fetchCursos('Ingeniería');

            expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/cursos?area=Ingenier%C3%ADa`);
            expect(result).toEqual(mockCursos);
        });

        it('should throw error on failed fetch', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: false,
            });

            await expect(fetchCursos()).rejects.toThrow('Error fetching cursos');
        });
    });

    describe('fetchCursoById', () => {
        it('should fetch curso by id', async () => {
            const mockCurso = { id: 1, nombre: 'Test', descripcion: 'Test', creditos: 3, area: 'Test' };

            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => mockCurso,
            });

            const result = await fetchCursoById(1);

            expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/cursos/1`);
            expect(result).toEqual(mockCurso);
        });
    });

    describe('createCurso', () => {
        it('should create a new curso', async () => {
            const newCurso = { nombre: 'Test', descripcion: 'Test', creditos: 3, area: 'Test' };
            const createdCurso = { id: 1, ...newCurso };

            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => createdCurso,
            });

            const result = await createCurso(newCurso);

            expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/cursos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCurso),
            });
            expect(result).toEqual(createdCurso);
        });
    });

    describe('updateCurso', () => {
        it('should update a curso', async () => {
            const updateData = { nombre: 'Updated' };
            const updatedCurso = { id: 1, nombre: 'Updated', descripcion: 'Test', creditos: 3, area: 'Test' };

            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => updatedCurso,
            });

            const result = await updateCurso(1, updateData);

            expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/cursos/1`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData),
            });
            expect(result).toEqual(updatedCurso);
        });
    });

    describe('deleteCurso', () => {
        it('should delete a curso', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
            });

            await deleteCurso(1);

            expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/cursos/1`, {
                method: 'DELETE',
            });
        });
    });

    describe('fetchPromedioCreditos', () => {
        it('should fetch average credits', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => ({ promedioCreditos: 4.5 }),
            });

            const result = await fetchPromedioCreditos();

            expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/cursos/promedio-creditos`);
            expect(result).toBe(4.5);
        });
    });
});
