const { Worker } = require('worker_threads');

function createWorker(id, url) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(`
            const axios = require('axios');
            const { parentPort, workerData } = require('worker_threads');

            axios.get(workerData.url)
                .then(response => {
                    parentPort.postMessage({ id: workerData.id, result: response.data });
                })
                .catch(error => {
                    if (error.response) {
                        parentPort.postMessage({ id: workerData.id, error: \`Erro - \${error.response.status} \${error.response.data}\` });
                    } else {
                        parentPort.postMessage({ id: workerData.id, error: \`Erro - \${error.message}\` });
                    }
                });
        `, { eval: true, workerData: { id, url } });

        worker.on('message', (message) => {
            if (message.error) {
                console.error(`Requisição ${message.id}: ${message.error}`);
            } else {
                console.log(`Requisição ${message.id}: ${message.result}`);
            }
            resolve();
        });

        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Worker ${id} finalizado com código ${code}`));
            }
        });
    });
}

async function testBulkheadWithThreads() {
    const url = 'http://localhost:8080/api/bulkhead';
    const workers = [];

    // Cria 5 threads para realizar as requisições
    for (let i = 1; i <= 5; i++) {
        workers.push(createWorker(i, url));
    }

    // Aguarda todas as threads concluírem
    await Promise.all(workers);
}

testBulkheadWithThreads();