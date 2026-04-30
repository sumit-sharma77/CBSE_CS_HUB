import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 100  },
    { duration: '1m',  target: 500  },
    { duration: '2m',  target: 1000 },
    { duration: '1m',  target: 3000 },
    { duration: '30s', target: 0    },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed:   ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';

export default function () {
  // Public endpoints only (no auth needed for load test)
  const r1 = http.get(`${BASE_URL}/actuator/health`);
  check(r1, { 'health 200': (r) => r.status === 200 });

  const r2 = http.get(`${BASE_URL}/api/v1/plans`);
  check(r2, { 'plans 200': (r) => r.status === 200 });

  sleep(1);
}
