'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Curso {
    id: number;
    nombre: string;
    descripcion: string;
    creditos: number;
    area: string;
}

export default function CursosPage() {
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [areaFilter, setAreaFilter] = useState('');
    const [promedioCreditos, setPromedioCreditos] = useState<number>(0);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    useEffect(() => {
        fetchCursos();
        fetchPromedioCreditos();
    }, [areaFilter]);

    const fetchCursos = async () => {
        try {
            setLoading(true);
            const url = areaFilter
                ? `${API_URL}/cursos?area=${encodeURIComponent(areaFilter)}`
                : `${API_URL}/cursos`;

            const response = await fetch(url);
            if (!response.ok) throw new Error('Error fetching cursos');

            const data = await response.json();
            setCursos(data);
            setError(null);
        } catch (err) {
            setError('Error al cargar los cursos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPromedioCreditos = async () => {
        try {
            const response = await fetch(`${API_URL}/cursos/promedio-creditos`);
            if (!response.ok) throw new Error('Error fetching average');

            const data = await response.json();
            setPromedioCreditos(data.promedioCreditos);
        } catch (err) {
            console.error('Error al cargar promedio:', err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Está seguro de eliminar este curso?')) return;

        try {
            const response = await fetch(`${API_URL}/cursos/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Error deleting curso');

            fetchCursos();
            fetchPromedioCreditos();
        } catch (err) {
            alert('Error al eliminar el curso');
            console.error(err);
        }
    };

    const areas = ['Todas', 'Informática', 'Matemáticas', 'Física', 'Química'];

    if (loading && cursos.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg">Cargando...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Gestión de Cursos
                    </h1>
                    <p className="text-gray-600">
                        Promedio de créditos: <span className="font-semibold">{promedioCreditos.toFixed(2)}</span>
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div className="flex items-center gap-4">
                            <label htmlFor="area-filter" className="font-medium text-gray-700">
                                Filtrar por área:
                            </label>
                            <select
                                id="area-filter"
                                value={areaFilter}
                                onChange={(e) => setAreaFilter(e.target.value === 'Todas' ? '' : e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {areas.map((area) => (
                                    <option key={area} value={area === 'Todas' ? '' : area}>
                                        {area}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <Link
                            href="/cursos/nuevo"
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
                        >
                            + Nuevo Curso
                        </Link>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b-2 border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nombre
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Descripción
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Créditos
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Área
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {cursos.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                            No hay cursos disponibles
                                        </td>
                                    </tr>
                                ) : (
                                    cursos.map((curso) => (
                                        <tr key={curso.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {curso.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {curso.nombre}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {curso.descripcion}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {curso.creditos}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {curso.area}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <Link
                                                    href={`/cursos/${curso.id}`}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    Ver
                                                </Link>
                                                <Link
                                                    href={`/cursos/${curso.id}/editar`}
                                                    className="text-green-600 hover:text-green-900"
                                                >
                                                    Editar
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(curso.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
