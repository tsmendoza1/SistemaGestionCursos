const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Curso {
    id: number;
    nombre: string;
    descripcion: string;
    creditos: number;
    area: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CursoInput {
    nombre: string;
    descripcion: string;
    creditos: number;
    area: string;
}

export async function fetchCursos(area?: string): Promise<Curso[]> {
    const url = area
        ? `${API_URL}/cursos?area=${encodeURIComponent(area)}`
        : `${API_URL}/cursos`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Error fetching cursos');
    }

    return response.json();
}

export async function fetchCursoById(id: number): Promise<Curso> {
    const response = await fetch(`${API_URL}/cursos/${id}`);

    if (!response.ok) {
        throw new Error('Error fetching curso');
    }

    return response.json();
}

export async function createCurso(curso: CursoInput): Promise<Curso> {
    const response = await fetch(`${API_URL}/cursos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(curso),
    });

    if (!response.ok) {
        throw new Error('Error creating curso');
    }

    return response.json();
}

export async function updateCurso(id: number, curso: Partial<CursoInput>): Promise<Curso> {
    const response = await fetch(`${API_URL}/cursos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(curso),
    });

    if (!response.ok) {
        throw new Error('Error updating curso');
    }

    return response.json();
}

export async function deleteCurso(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/cursos/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Error deleting curso');
    }
}

export async function fetchPromedioCreditos(): Promise<number> {
    const response = await fetch(`${API_URL}/cursos/promedio-creditos`);

    if (!response.ok) {
        throw new Error('Error fetching average credits');
    }

    const data = await response.json();
    return data.promedioCreditos;
}
