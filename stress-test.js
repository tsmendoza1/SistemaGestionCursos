import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration
export const options = {
    stages: [
        { duration: '30s', target: 10 },  // Ramp up to 10 users
        { duration: '1m', target: 50 },   // Ramp up to 50 users
        { duration: '1m', target: 100 },  // Ramp up to 100 users
        { duration: '30s', target: 0 },   // Ramp down to 0 users
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
        errors: ['rate<0.1'],             // Error rate should be less than 10%
    },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:3001';

export default function () {
    // Test 1: Get all cursos
    let res = http.get(`${BASE_URL}/cursos`);
    check(res, {
        'GET /cursos status is 200': (r) => r.status === 200,
        'GET /cursos response time < 500ms': (r) => r.timings.duration < 500,
    }) || errorRate.add(1);

    sleep(1);

    // Test 2: Get cursos filtered by area
    res = http.get(`${BASE_URL}/cursos?area=Ingeniería`);
    check(res, {
        'GET /cursos?area status is 200': (r) => r.status === 200,
        'GET /cursos?area response time < 500ms': (r) => r.timings.duration < 500,
    }) || errorRate.add(1);

    sleep(1);

    // Test 3: Get average credits
    res = http.get(`${BASE_URL}/cursos/promedio-creditos`);
    check(res, {
        'GET /cursos/promedio-creditos status is 200': (r) => r.status === 200,
        'GET /cursos/promedio-creditos has promedioCreditos': (r) => {
            const body = JSON.parse(r.body);
            return body.hasOwnProperty('promedioCreditos');
        },
    }) || errorRate.add(1);

    sleep(1);

    // Test 4: Create a new curso
    const payload = JSON.stringify({
        nombre: `Curso Test ${Date.now()}`,
        descripcion: 'Descripción de prueba para test de carga',
        creditos: Math.floor(Math.random() * 5) + 1,
        area: ['Ingeniería', 'Ciencias', 'Humanidades', 'Artes'][Math.floor(Math.random() * 4)],
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    res = http.post(`${BASE_URL}/cursos`, payload, params);
    check(res, {
        'POST /cursos status is 201': (r) => r.status === 201,
        'POST /cursos response time < 1000ms': (r) => r.timings.duration < 1000,
        'POST /cursos returns id': (r) => {
            const body = JSON.parse(r.body);
            return body.hasOwnProperty('id');
        },
    }) || errorRate.add(1);

    const createdId = JSON.parse(res.body).id;
    sleep(1);

    // Test 5: Get curso by ID
    if (createdId) {
        res = http.get(`${BASE_URL}/cursos/${createdId}`);
        check(res, {
            'GET /cursos/:id status is 200': (r) => r.status === 200,
            'GET /cursos/:id response time < 500ms': (r) => r.timings.duration < 500,
        }) || errorRate.add(1);

        sleep(1);

        // Test 6: Update curso
        const updatePayload = JSON.stringify({
            creditos: Math.floor(Math.random() * 5) + 1,
        });

        res = http.put(`${BASE_URL}/cursos/${createdId}`, updatePayload, params);
        check(res, {
            'PUT /cursos/:id status is 200': (r) => r.status === 200,
            'PUT /cursos/:id response time < 1000ms': (r) => r.timings.duration < 1000,
        }) || errorRate.add(1);

        sleep(1);

        // Test 7: Delete curso
        res = http.del(`${BASE_URL}/cursos/${createdId}`);
        check(res, {
            'DELETE /cursos/:id status is 204': (r) => r.status === 204,
            'DELETE /cursos/:id response time < 500ms': (r) => r.timings.duration < 500,
        }) || errorRate.add(1);
    }

    sleep(2);
}

export function handleSummary(data) {
    return {
        'stress-test-results.json': JSON.stringify(data, null, 2),
        stdout: textSummary(data, { indent: ' ', enableColors: true }),
    };
}

function textSummary(data, options) {
    const indent = options.indent || '';
    const enableColors = options.enableColors || false;

    let summary = `\n${indent}Test Summary:\n`;
    summary += `${indent}  Total Requests: ${data.metrics.http_reqs.values.count}\n`;
    summary += `${indent}  Failed Requests: ${data.metrics.http_req_failed ? data.metrics.http_req_failed.values.passes : 0}\n`;
    summary += `${indent}  Request Duration (avg): ${data.metrics.http_req_duration.values.avg.toFixed(2)}ms\n`;
    summary += `${indent}  Request Duration (p95): ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms\n`;
    summary += `${indent}  Error Rate: ${(data.metrics.errors.values.rate * 100).toFixed(2)}%\n`;

    return summary;
}
