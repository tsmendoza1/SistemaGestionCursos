import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Métricas personalizadas
const errorRate = new Rate('errors');
const getCursosDuration = new Trend('get_cursos_duration');
const postCursosDuration = new Trend('post_cursos_duration');
const requestCounter = new Counter('requests_total');

// Configuración de la prueba
export const options = {
    stages: [
        { duration: '30s', target: 10 },   // Ramp-up: 0 → 10 usuarios en 30s
        { duration: '1m', target: 50 },    // Incremento: 10 → 50 usuarios en 1min
        { duration: '2m', target: 100 },   // Carga alta: 50 → 100 usuarios en 2min
        { duration: '1m', target: 100 },   // Mantener: 100 usuarios por 1min
        { duration: '30s', target: 0 },    // Ramp-down: 100 → 0 usuarios en 30s
    ],
    thresholds: {
        'http_req_duration': ['p(95)<500'],  // 95% de requests < 500ms
        'http_req_failed': ['rate<0.1'],     // Tasa de error < 10%
        'errors': ['rate<0.1'],              // Tasa de errores < 10%
    },
};

const BASE_URL = 'http://localhost:3001';

// Datos de prueba
const testCurso = {
    nombre: 'Curso de Prueba K6',
    descripcion: 'Curso creado durante pruebas de estrés con K6',
    creditos: 4,
    area: 'Informática'
};

export default function () {
    // Test 1: GET /cursos - Listar todos los cursos
    let res = http.get(`${BASE_URL}/cursos`);
    check(res, {
        'GET /cursos status 200': (r) => r.status === 200,
        'GET /cursos tiene datos': (r) => JSON.parse(r.body).length > 0,
    }) || errorRate.add(1);
    getCursosDuration.add(res.timings.duration);
    requestCounter.add(1);

    sleep(1);

    // Test 2: GET /cursos/promedio-creditos - Calcular promedio
    res = http.get(`${BASE_URL}/cursos/promedio-creditos`);
    check(res, {
        'GET /promedio-creditos status 200': (r) => r.status === 200,
        'GET /promedio-creditos tiene promedio': (r) => JSON.parse(r.body).promedioCreditos !== undefined,
    }) || errorRate.add(1);
    requestCounter.add(1);

    sleep(1);

    // Test 3: GET /cursos?area=Informática - Filtrar por área
    res = http.get(`${BASE_URL}/cursos?area=Informática`);
    check(res, {
        'GET /cursos?area status 200': (r) => r.status === 200,
    }) || errorRate.add(1);
    requestCounter.add(1);

    sleep(1);

    // Test 4: GET /cursos/:id - Obtener curso específico
    res = http.get(`${BASE_URL}/cursos/1`);
    check(res, {
        'GET /cursos/1 status 200': (r) => r.status === 200,
        'GET /cursos/1 tiene id': (r) => JSON.parse(r.body).id === 1,
    }) || errorRate.add(1);
    requestCounter.add(1);

    sleep(1);

    // Test 5: POST /cursos - Crear curso (solo algunos usuarios)
    if (Math.random() < 0.2) { // 20% de usuarios crean cursos
        const params = {
            headers: { 'Content-Type': 'application/json' },
        };
        res = http.post(`${BASE_URL}/cursos`, JSON.stringify(testCurso), params);
        check(res, {
            'POST /cursos status 201': (r) => r.status === 201,
            'POST /cursos retorna id': (r) => JSON.parse(r.body).id !== undefined,
        }) || errorRate.add(1);
        postCursosDuration.add(res.timings.duration);
        requestCounter.add(1);

        sleep(1);
    }

    // Test 6: GET /health - Health check
    res = http.get(`${BASE_URL}/health`);
    check(res, {
        'GET /health status 200': (r) => r.status === 200,
        'GET /health is healthy': (r) => JSON.parse(r.body).status === 'healthy',
    }) || errorRate.add(1);
    requestCounter.add(1);

    sleep(2);
}

// Función que se ejecuta al final de la prueba
export function handleSummary(data) {
    return {
        'summary.json': JSON.stringify(data, null, 2),
        stdout: textSummary(data, { indent: ' ', enableColors: true }),
    };
}

function textSummary(data, options) {
    const indent = options.indent || '';
    const enableColors = options.enableColors || false;

    let summary = '\n';
    summary += `${indent}╔════════════════════════════════════════════════════════════╗\n`;
    summary += `${indent}║           RESUMEN DE PRUEBAS DE ESTRÉS CON K6             ║\n`;
    summary += `${indent}╚════════════════════════════════════════════════════════════╝\n\n`;

    // Métricas HTTP
    const httpReqDuration = data.metrics.http_req_duration;
    summary += `${indent}📊 Tiempos de Respuesta HTTP:\n`;
    summary += `${indent}   Promedio:  ${httpReqDuration.values.avg.toFixed(2)}ms\n`;
    summary += `${indent}   Mínimo:    ${httpReqDuration.values.min.toFixed(2)}ms\n`;
    summary += `${indent}   Máximo:    ${httpReqDuration.values.max.toFixed(2)}ms\n`;
    summary += `${indent}   P50:       ${httpReqDuration.values['p(50)'].toFixed(2)}ms\n`;
    summary += `${indent}   P95:       ${httpReqDuration.values['p(95)'].toFixed(2)}ms\n`;
    summary += `${indent}   P99:       ${httpReqDuration.values['p(99)'].toFixed(2)}ms\n\n`;

    // Requests
    const httpReqs = data.metrics.http_reqs;
    summary += `${indent}🔥 Peticiones:\n`;
    summary += `${indent}   Total:     ${httpReqs.values.count}\n`;
    summary += `${indent}   Rate:      ${httpReqs.values.rate.toFixed(2)} req/s\n\n`;

    // Errores
    const httpReqFailed = data.metrics.http_req_failed;
    summary += `${indent}❌ Tasa de Errores:\n`;
    summary += `${indent}   ${(httpReqFailed.values.rate * 100).toFixed(2)}%\n\n`;

    // VUs
    summary += `${indent}👥 Usuarios Virtuales:\n`;
    summary += `${indent}   Máximo:    ${data.metrics.vus_max.values.max}\n\n`;

    return summary;
}
