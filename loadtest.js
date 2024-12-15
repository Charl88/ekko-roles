import http from 'k6/http';
import { check, sleep } from 'k6';

// Test configuration
export const options = {
    cloud: {
        distribution: {
            distributionLabel1: { loadZone: 'amazon:gb:london', percent: 100 },
        }
    },
    stages: [
        { duration: '30s', target: 100 },  // Ramp-up to 10 users
        { duration: '1m', target: 100 },  // Stay at 10 users
        { duration: '30s', target: 0 },  // Ramp-down to 0 users
    ],
};

export default function () {
    // Replace with your API endpoint
    const baseUrl = 'https://backend-876047732597.europe-west2.run.app';

    // Define headers
    const params = {
        headers: {
            'user-id': '1',
        },
    };

    // Make a GET request
    const res = http.get(baseUrl + '/users', params);

    // Log response details
    console.log(`Response status: ${res.status}`);
    console.log(`Response body: ${res.body}`);

    // Validate response
    check(res, {
        'is status 200': (r) => r.status === 200
    });

    // Simulate user think time
    sleep(1);
}