const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// URL de conexión de Render
const DATABASE_URL = process.argv[2] || process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error('❌ Error: Debes proporcionar la DATABASE_URL');
    console.error('Uso: node init-db-remote.js "postgresql://..."');
    process.exit(1);
}

async function initializeDatabase() {
    const pool = new Pool({
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('🔌 Conectando a la base de datos...');

        // Leer el script SQL
        const sqlPath = path.join(__dirname, 'init.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('📝 Ejecutando script de inicialización...');

        // Ejecutar el script
        await pool.query(sql);

        console.log('✅ Base de datos inicializada correctamente');
        console.log('');

        // Verificar que se crearon los datos
        const result = await pool.query('SELECT COUNT(*) FROM cursos');
        console.log(`📊 Total de cursos insertados: ${result.rows[0].count}`);

        // Mostrar algunos cursos
        const cursos = await pool.query('SELECT id, nombre, area FROM cursos LIMIT 5');
        console.log('\n📚 Primeros 5 cursos:');
        cursos.rows.forEach(curso => {
            console.log(`   ${curso.id}. ${curso.nombre} (${curso.area})`);
        });

    } catch (error) {
        console.error('❌ Error al inicializar la base de datos:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

initializeDatabase();
