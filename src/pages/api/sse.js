import pool from '@lib/pool';

const HEARTBEAT_INTERVAL = 5000; // in ms

export default function handler(req, res) {
    if (!req.headers.accept || req.headers.accept !== 'text/event-stream') {
        console.error('Clients not accepting an event stream.');
        res.status(404).end();
        return;
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // keep alive with a heartbeat.
    const iv = setInterval(() => {
        res.write('hb: null\n\n');
    }, HEARTBEAT_INTERVAL);

    const sendUpdate = (data) => {
        const event = `data: ${JSON.stringify(data)}\n\n`;
        res.write(event);
    };

    const client_id = pool.addClient(sendUpdate);

    req.socket.on('close', () => {
        pool.removeClient(client_id);
        clearInterval(iv);
        res.end();
    });
}
