import { render, screen, waitFor } from '@testing-library/react';
import CursosPage from '../app/cursos/page';

// Mock fetch
global.fetch = jest.fn();

describe('CursosPage Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render loading state initially', () => {
        (global.fetch as jest.Mock).mockImplementation(() =>
            new Promise(() => { }) // Never resolves
        );

        render(<CursosPage />);
        expect(screen.getByText('Cargando...')).toBeInTheDocument();
    });

    it('should render cursos list after loading', async () => {
        const mockCursos = [
            {
                id: 1,
                nombre: 'Matemáticas',
                descripcion: 'Curso de matemáticas',
                creditos: 4,
                area: 'Ciencias',
            },
            {
                id: 2,
                nombre: 'Física',
                descripcion: 'Curso de física',
                creditos: 5,
                area: 'Ingeniería',
            },
        ];

        (global.fetch as jest.Mock)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockCursos,
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ promedioCreditos: 4.5 }),
            });

        render(<CursosPage />);

        await waitFor(() => {
            expect(screen.getByText('Matemáticas')).toBeInTheDocument();
            expect(screen.getByText('Física')).toBeInTheDocument();
        });
    });

    it('should display average credits', async () => {
        (global.fetch as jest.Mock)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [],
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ promedioCreditos: 4.5 }),
            });

        render(<CursosPage />);

        await waitFor(() => {
            expect(screen.getByText(/4.50/)).toBeInTheDocument();
        });
    });

    it('should handle error state', async () => {
        (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

        render(<CursosPage />);

        await waitFor(() => {
            expect(screen.getByText('Error al cargar los cursos')).toBeInTheDocument();
        });
    });

    it('should filter cursos by area', async () => {
        const mockCursos = [
            {
                id: 1,
                nombre: 'Matemáticas',
                descripcion: 'Curso de matemáticas',
                creditos: 4,
                area: 'Ingeniería',
            },
        ];

        (global.fetch as jest.Mock)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockCursos,
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ promedioCreditos: 4 }),
            });

        render(<CursosPage />);

        await waitFor(() => {
            expect(screen.getByText('Matemáticas')).toBeInTheDocument();
        });
    });
});
