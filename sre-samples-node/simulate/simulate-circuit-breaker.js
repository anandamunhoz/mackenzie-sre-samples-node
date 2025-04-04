const axios = require('axios');

// Função para testar requisições simultâneas
async function testSimultaneousRequests(url, numberOfRequests) {
    const requests = [];

    for (let i = 0; i < numberOfRequests; i++) {
        requests.push(axios.get(url));
    }

    try {
        const responses = await Promise.allSettled(requests);
        responses.forEach((response, index) => {
            if (response.status === 'fulfilled') {
                console.log(`Request ${index + 1}: Success - ${response.value.data}`);
            } else {
                console.log(`Request ${index + 1}: Failed - ${response.reason.message}`);
            }
        });
    } catch (error) {
        console.error('Erro ao realizar as requisições:', error.message);
    }
}

// Testando com 10 requisições simultâneas
testSimultaneousRequests('http://localhost:8080/api/circuitbreaker', 30);