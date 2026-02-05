-- Migration script for Curso table
-- Database: PostgreSQL

-- Create Curso table
CREATE TABLE IF NOT EXISTS "Curso" (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    creditos INTEGER NOT NULL CHECK (creditos > 0 AND creditos <= 10),
    area VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on area for faster filtering
CREATE INDEX IF NOT EXISTS idx_curso_area ON "Curso"(area);

-- Create index on createdAt for sorting
CREATE INDEX IF NOT EXISTS idx_curso_created_at ON "Curso"("createdAt");

-- Insert sample data
INSERT INTO "Curso" (nombre, descripcion, creditos, area) VALUES
    ('Cálculo Diferencial', 'Introducción al cálculo diferencial y sus aplicaciones', 4, 'Ingeniería'),
    ('Programación I', 'Fundamentos de programación con Python', 5, 'Ingeniería'),
    ('Física General', 'Conceptos básicos de física mecánica', 4, 'Ciencias'),
    ('Química Orgánica', 'Estudio de compuestos orgánicos', 5, 'Ciencias'),
    ('Literatura Universal', 'Análisis de obras literarias clásicas', 3, 'Humanidades'),
    ('Historia del Arte', 'Recorrido por la historia del arte occidental', 3, 'Artes'),
    ('Álgebra Lineal', 'Vectores, matrices y transformaciones lineales', 4, 'Ingeniería'),
    ('Base de Datos', 'Diseño e implementación de bases de datos relacionales', 5, 'Ingeniería'),
    ('Biología Molecular', 'Estudio de procesos biológicos a nivel molecular', 4, 'Ciencias'),
    ('Filosofía Moderna', 'Corrientes filosóficas del siglo XVII al XIX', 3, 'Humanidades');

-- Function to automatically update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to call the function before update
CREATE TRIGGER update_curso_updated_at 
    BEFORE UPDATE ON "Curso"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Verification queries
-- SELECT * FROM "Curso";
-- SELECT area, COUNT(*) as total, AVG(creditos) as promedio_creditos FROM "Curso" GROUP BY area;
