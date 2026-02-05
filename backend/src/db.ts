import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:root@localhost:5432/cursos_db';

console.log('🔌 DB Config:', {
    usingEnvVar: !!process.env.DATABASE_URL,
    connectionString: process.env.DATABASE_URL ? 'Set via ENV' : 'Fallback to Localhost'
});

const pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

export default pool;
