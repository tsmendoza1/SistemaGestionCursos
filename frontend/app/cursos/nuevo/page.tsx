'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface CursoFormData {
    nombre: string;
    descripcion: string;
    creditos: number;
    area: string;
}

interface FormErrors {
    nombre?: string;
    descripcion?: string;
    creditos?: string;
    area?: string;
}

export default function CursoFormPage() {
    const router = useRouter();
    const params = useParams();
    const isEdit = !!params.id;

    const [formData, setFormData] = useState<CursoFormData>({
        nombre: '',
        descripcion: '',
        creditos: 0,
        area: 'Ingeniería',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(isEdit);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    useEffect(() => {
        if (isEdit) {
            fetchCurso();
        }
    }, [params.id]);

    const fetchCurso = async () => {
        try {
            setFetchingData(true);
            const response = await fetch(`${API_URL}/cursos/${params.id}`);

            if (!response.ok) throw new Error('Error al cargar el curso');

            const data = await response.json();
            setFormData({
                nombre: data.nombre,
                descripcion: data.descripcion,
                creditos: data.creditos,
                area: data.area,
            });
        } catch (err) {
            alert('Error al cargar el curso');
            router.push('/cursos');
        } finally {
            setFetchingData(false);
        }
    };

    const validate = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es obligatorio';
        } else if (formData.nombre.length < 3) {
            newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
        }

        if (!formData.descripcion.trim()) {
            newErrors.descripcion = 'La descripción es obligatoria';
        } else if (formData.descripcion.length < 10) {
            newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
        }

        if (formData.creditos <= 0) {
            newErrors.creditos = 'Los créditos deben ser mayor a 0';
        } else if (formData.creditos > 10) {
            newErrors.creditos = 'Los créditos no pueden ser mayor a 10';
        }

        if (!formData.area) {
            newErrors.area = 'El área es obligatoria';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            setLoading(true);
            const url = isEdit
                ? `${API_URL}/cursos/${params.id}`
                : `${API_URL}/cursos`;

            const method = isEdit ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al guardar el curso');
            }

            router.push('/cursos');
        } catch (err: any) {
            alert(err.message || 'Error al guardar el curso');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'creditos' ? parseInt(value) || 0 : value,
        }));

        // Clear error when user starts typing
        if (errors[name as keyof CursoFormData]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    if (fetchingData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg">Cargando...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <button
                        onClick={() => router.back()}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                    >
                        ← Volver
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">
                        {isEdit ? 'Editar Curso' : 'Nuevo Curso'}
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre del Curso *
                            </label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.nombre ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Ej: Cálculo Diferencial"
                            />
                            {errors.nombre && (
                                <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción *
                            </label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                rows={4}
                                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.descripcion ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Descripción detallada del curso"
                            />
                            {errors.descripcion && (
                                <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="creditos" className="block text-sm font-medium text-gray-700 mb-2">
                                Créditos *
                            </label>
                            <input
                                type="number"
                                id="creditos"
                                name="creditos"
                                value={formData.creditos}
                                onChange={handleChange}
                                min="1"
                                max="10"
                                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.creditos ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.creditos && (
                                <p className="mt-1 text-sm text-red-600">{errors.creditos}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
                                Área *
                            </label>
                            <select
                                id="area"
                                name="area"
                                value={formData.area}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.area ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <option value="Ingeniería">Ingeniería</option>
                                <option value="Ciencias">Ciencias</option>
                                <option value="Humanidades">Humanidades</option>
                                <option value="Artes">Artes</option>
                            </select>
                            {errors.area && (
                                <p className="mt-1 text-sm text-red-600">{errors.area}</p>
                            )}
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-300"
                            >
                                {loading ? 'Guardando...' : isEdit ? 'Actualizar Curso' : 'Crear Curso'}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors font-medium"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
