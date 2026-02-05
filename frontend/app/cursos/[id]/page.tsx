'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

interface Curso {
    id: number;
    nombre: string;
    descripcion: string;
    creditos: number;
    area: string;
    createdAt: string;
    updatedAt: string;
}

export default function CursoDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [curso, setCurso] = useState<Curso | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const id = params.id;

    useEffect(() => {
        if (id) {
            fetchCurso();
        }
    }, [id]);

    const fetchCurso = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/cursos/${id}`);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Curso no encontrado');
                }
                throw new Error('Error al cargar el curso');
            }

            const data = await response.json();
            setCurso(data);
            setError(null);
        } catch (err: any) {
            setError(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('¿Está seguro de eliminar este curso?')) return;

        try {
            const response = await fetch(`${API_URL}/cursos/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Error al eliminar el curso');

            router.push('/cursos');
        } catch (err) {
            alert('Error al eliminar el curso');
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg">Cargando...</p>
            </div>
        );
    }

    if (error || !curso) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 text-lg mb-4">{error || 'Curso no encontrado'}</p>
                    <Link href="/cursos" className="text-blue-600 hover:text-blue-800">
                        Volver a la lista
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link href="/cursos" className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                        ← Volver a la lista
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="mb-6 pb-6 border-b border-gray-200">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {curso.nombre}
                        </h1>
                        <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {curso.area}
                        </span>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                                Descripción
                            </h2>
                            <p className="text-gray-900 text-lg">
                                {curso.descripcion}
                            </p>
                        </div>

                        <div>
                            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                                Créditos
                            </h2>
                            <p className="text-gray-900 text-lg font-semibold">
                                {curso.creditos}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    Fecha de Creación
                                </h2>
                                <p className="text-gray-900">
                                    {new Date(curso.createdAt).toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>

                            <div>
                                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    Última Actualización
                                </h2>
                                <p className="text-gray-900">
                                    {new Date(curso.updatedAt).toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200 flex gap-4">
                        <Link
                            href={`/cursos/${curso.id}/editar`}
                            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors font-medium"
                        >
                            Editar Curso
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors font-medium"
                        >
                            Eliminar Curso
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
