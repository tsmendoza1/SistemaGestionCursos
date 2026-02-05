const axios = require('axios');

const API_URL = 'http://localhost:3001';
const NUM_REQUESTS = 1000;
const CONCURRENT_REQUESTS = 50;

// Datos de prueba
const testCurso = {
    nombre: 'Curso de Prueba Estrés',
    descripcion: 'Este es un curso creado durante las pruebas de estrés',
    creditos: 3,
    area: 'Informática'
};

// Función para hacer una petición
async function makeRequest(endpoint, method = 'GET', data = null) {
    const startTime = Date.now();
    try {
        const config = {
            method,
            url: `${API_URL}${endpoint}`,
            ...(data && { data })
        };
        await axios(config);
        const duration = Date.now() - startTime;
        return { success: true, duration };
    } catch (error) {
        const duration = Date.now() - startTime;
        return { success: false, duration, error: error.message };
    }
}

// Función para ejecutar pruebas concurrentes
async function runConcurrentTests(endpoint, method, data, numRequests, concurrency) {
    const results = {
        total: numRequests,
        successful: 0,
        failed: 0,
        durations: [],
        errors: []
    };

    console.log(`\n🔥 Iniciando ${numRequests} peticiones ${method} a ${endpoint}`);
    console.log(`   Concurrencia: ${concurrency} peticiones simultáneas\n`);

    const startTime = Date.now();

    // Ejecutar peticiones en lotes
    for (let i = 0; i < numRequests; i += concurrency) {
        const batch = [];
        const batchSize = Math.min(concurrency, numRequests - i);

        for (let j = 0; j < batchSize; j++) {
            batch.push(makeRequest(endpoint, method, data));
        }

        const batchResults = await Promise.all(batch);

        batchResults.forEach(result => {
            if (result.success) {
                results.successful++;
            } else {
                results.failed++;
                results.errors.push(result.error);
            }
            results.durations.push(result.duration);
        });

        // Mostrar progreso
        const progress = ((i + batchSize) / numRequests * 100).toFixed(1);
        process.stdout.write(`\r   Progreso: ${progress}% (${i + batchSize}/${numRequests})`);
    }

    const totalTime = Date.now() - startTime;

    console.log('\n');
    return { ...results, totalTime };
}

// Función para calcular estadísticas
function calculateStats(durations) {
    const sorted = durations.sort((a, b) => a - b);
    const sum = sorted.reduce((a, b) => a + b, 0);
    const avg = sum / sorted.length;
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const p50 = sorted[Math.floor(sorted.length * 0.5)];
    const p95 = sorted[Math.floor(sorted.length * 0.95)];
    const p99 = sorted[Math.floor(sorted.length * 0.99)];

    return { avg, min, max, p50, p95, p99 };
}

// Función para imprimir resultados
function printResults(testName, results) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📊 Resultados: ${testName}`);
    console.log(`${'='.repeat(60)}`);
    console.log(`Total de peticiones:     ${results.total}`);
    console.log(`Exitosas:                ${results.successful} (${(results.successful / results.total * 100).toFixed(2)}%)`);
    console.log(`Fallidas:                ${results.failed} (${(results.failed / results.total * 100).toFixed(2)}%)`);
    console.log(`Tiempo total:            ${(results.totalTime / 1000).toFixed(2)}s`);
    console.log(`Peticiones por segundo:  ${(results.total / (results.totalTime / 1000)).toFixed(2)}`);

    const stats = calculateStats(results.durations);
    console.log(`\n⏱️  Tiempos de Respuesta (ms):`);
    console.log(`   Promedio:  ${stats.avg.toFixed(2)}ms`);
    console.log(`   Mínimo:    ${stats.min}ms`);
    console.log(`   Máximo:    ${stats.max}ms`);
    console.log(`   P50:       ${stats.p50}ms`);
    console.log(`   P95:       ${stats.p95}ms`);
    console.log(`   P99:       ${stats.p99}ms`);

    if (results.failed > 0) {
        console.log(`\n❌ Errores encontrados:`);
        const errorCounts = {};
        results.errors.forEach(err => {
            errorCounts[err] = (errorCounts[err] || 0) + 1;
        });
        Object.entries(errorCounts).forEach(([error, count]) => {
            console.log(`   ${error}: ${count} veces`);
        });
    }
}

// Función principal
async function runStressTests() {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║        PRUEBAS DE ESTRÉS - SISTEMA DE GESTIÓN DE CURSOS   ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    // Verificar que el servidor esté corriendo
    console.log('🔍 Verificando conexión con el servidor...');
    try {
        await axios.get(`${API_URL}/health`);
        console.log('✅ Servidor disponible\n');
    } catch (error) {
        console.error('❌ Error: El servidor no está disponible en', API_URL);
        console.error('   Por favor, inicie el servidor con: npm run dev');
        process.exit(1);
    }

    // Test 1: GET /cursos (lectura)
    const test1 = await runConcurrentTests('/cursos', 'GET', null, NUM_REQUESTS, CONCURRENT_REQUESTS);
    printResults('GET /cursos - Listar todos los cursos', test1);

    // Test 2: GET /cursos/promedio-creditos (cálculo)
    const test2 = await runConcurrentTests('/cursos/promedio-creditos', 'GET', null, NUM_REQUESTS / 2, CONCURRENT_REQUESTS);
    printResults('GET /cursos/promedio-creditos - Calcular promedio', test2);

    // Test 3: GET /cursos?area=Informática (filtrado)
    const test3 = await runConcurrentTests('/cursos?area=Informática', 'GET', null, NUM_REQUESTS / 2, CONCURRENT_REQUESTS);
    printResults('GET /cursos?area=Informática - Filtrar por área', test3);

    // Test 4: POST /cursos (escritura)
    const test4 = await runConcurrentTests('/cursos', 'POST', testCurso, 100, 10);
    printResults('POST /cursos - Crear cursos', test4);

    // Test 5: GET /cursos/:id (lectura específica)
    const test5 = await runConcurrentTests('/cursos/1', 'GET', null, NUM_REQUESTS / 2, CONCURRENT_REQUESTS);
    printResults('GET /cursos/1 - Obtener curso específico', test5);

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                    RESUMEN GENERAL                         ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    const totalRequests = test1.total + test2.total + test3.total + test4.total + test5.total;
    const totalSuccessful = test1.successful + test2.successful + test3.successful + test4.successful + test5.successful;
    const totalFailed = test1.failed + test2.failed + test3.failed + test4.failed + test5.failed;
    const totalTime = test1.totalTime + test2.totalTime + test3.totalTime + test4.totalTime + test5.totalTime;

    console.log(`Total de peticiones:     ${totalRequests}`);
    console.log(`Exitosas:                ${totalSuccessful} (${(totalSuccessful / totalRequests * 100).toFixed(2)}%)`);
    console.log(`Fallidas:                ${totalFailed} (${(totalFailed / totalRequests * 100).toFixed(2)}%)`);
    console.log(`Tiempo total:            ${(totalTime / 1000).toFixed(2)}s`);
    console.log(`Throughput promedio:     ${(totalRequests / (totalTime / 1000)).toFixed(2)} req/s`);

    console.log('\n✅ Pruebas de estrés completadas\n');
}

// Ejecutar las pruebas
runStressTests().catch(error => {
    console.error('\n❌ Error fatal:', error.message);
    process.exit(1);
});
