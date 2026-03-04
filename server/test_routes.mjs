import axios from 'axios';

const testServer = async () => {
    const baseURL = 'http://localhost:5000/api';

    console.log('Testing Server Connectivity...');

    try {
        // 1. Test Health Endpoint
        const health = await axios.get(`${baseURL}/health`);
        console.log('✅ Health Check Passed:', health.data);
    } catch (error) {
        console.error('❌ Health Check Failed:', error.message);
        if (error.response) console.error('Status:', error.response.status);
    }

    try {
        // 2. Test Invoices Route (Expecting 401, not 404)
        console.log('\nTesting Invoices Route (Existence Check)...');
        await axios.get(`${baseURL}/invoices`);
    } catch (error) {
        if (error.response) {
            if (error.response.status === 404) {
                console.error('❌ Invoices Route NOT FOUND (404). Server might verify that the route is registered.');
                console.log('Suggestion: Restart the backend server.');
            } else if (error.response.status === 401) {
                console.log('✅ Invoices Route Exists (Got 401 Unauthorized as expected).');
                console.log('The 404 error might be due to a client-side URL mismatch or proxy issue.');
            } else {
                console.log(`⚠️ Unexpected Status: ${error.response.status}`);
            }
        } else {
            console.error('❌ Network Error on Invoices Route:', error.message);
        }
    }
};

testServer();
