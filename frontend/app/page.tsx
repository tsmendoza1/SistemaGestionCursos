import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Sistema de Gestión de Cursos
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Administra tus cursos de manera eficiente
        </p>
        <Link
          href="/cursos"
          className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
        >
          Ver Cursos
        </Link>
      </div>
    </div>
  );
}
