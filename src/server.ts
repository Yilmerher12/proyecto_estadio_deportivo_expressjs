import { createApp } from './app.js';

const PORT = process.env.PORT ?? '3000';
const app = createApp();

// TODO: Implementar graceful shutdown
// El servidor debe cerrarse limpiamente ante SIGTERM o SIGINT.
// Pistas:
const server = app.listen(Number(PORT), () => {
    console.log(`Server running on http://localhost:${PORT}`)
});

// Reemplaza esto con la implementación completa:
app.listen(Number(PORT), () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

function shutdown(signal: string): void {
    console.log(`${signal} received: closing server gracefully`);
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
}


process.on('SIGTERM', () => server.close(() => { 'SIGTERM' }))
process.on('SIGINT', () => server.close(() => { 'SIGINT' }))