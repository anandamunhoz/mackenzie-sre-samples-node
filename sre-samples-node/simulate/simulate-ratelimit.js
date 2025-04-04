const axios = require('axios');

async function simulateRateLimit() {
    const url = 'http://localhost:8080/api/ratelimit';

    for (let i = 1; i <= 101; i++) { 
        try {
            const response = await axios.get(url);
            console.log(`Requisição ${i}:`, response.data);
        } catch (error) {
            if (error.response && error.response.status === 429) {
                console.error(`Requisição ${i}: Rate Limit Excedido - ${error.response.data}`);
            } else {
                console.error(`Requisição ${i}: Erro - ${error.message}`);
            }
        }
    }
}

simulateRateLimit();