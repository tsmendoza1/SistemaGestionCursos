-- Crear la base de datos (ejecutar como superusuario si es necesario)
-- CREATE DATABASE cursos_db;

-- Conectarse a la base de datos cursos_db antes de ejecutar lo siguiente

-- Eliminar tabla si existe
DROP TABLE IF EXISTS cursos;

-- Crear tabla de cursos
CREATE TABLE cursos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  creditos INTEGER NOT NULL CHECK (creditos > 0),
  area VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_cursos_area ON cursos(area);
CREATE INDEX idx_cursos_nombre ON cursos(nombre);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
CREATE TRIGGER update_cursos_updated_at
BEFORE UPDATE ON cursos
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insertar datos de ejemplo
INSERT INTO cursos (nombre, descripcion, creditos, area) VALUES
  ('Programación Web', 'Curso de desarrollo web full-stack con tecnologías modernas', 4, 'Informática'),
  ('Bases de Datos', 'Diseño e implementación de bases de datos relacionales', 4, 'Informática'),
  ('Cálculo I', 'Introducción al cálculo diferencial e integral', 5, 'Matemáticas'),
  ('Álgebra Lineal', 'Estudio de vectores, matrices y transformaciones lineales', 4, 'Matemáticas'),
  ('Física I', 'Mecánica clásica y cinemática', 5, 'Física'),
  ('Química General', 'Fundamentos de química y reacciones químicas', 4, 'Química'),
  ('Estructuras de Datos', 'Algoritmos y estructuras de datos fundamentales', 4, 'Informática'),
  ('Redes de Computadoras', 'Protocolos y arquitectura de redes', 3, 'Informática'),
  ('Inteligencia Artificial', 'Introducción a algoritmos de IA y machine learning', 4, 'Informática'),
  ('Estadística', 'Análisis estadístico y probabilidad', 4, 'Matemáticas');
