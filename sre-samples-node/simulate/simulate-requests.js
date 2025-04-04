const fetch = require('node-fetch'); // Certifique-se de instalar este pacote

const endpoint = 'http://localhost:8080/api/circuitbreaker';

async function simulateRequests() {
    const requests = Array.from({ length: 30 }, (_, i) => {
        return fetch(endpoint)
            .then(response => response.text())
            .then(data => console.log(`Requisição ${i + 1}: ${data}`))
            .catch(error => console.error(`Requisição ${i + 1} falhou: ${error.message}`));
    });

    await Promise.all(requests);
    console.log('Simulação de 30 requisições concluída.');
}

simulateRequests();
