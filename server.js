const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let pixels = {};
const user = {};
const chat = {};

wss.on('connection', (ws) => {
    ws.send(JSON.stringify({ action: 'init', data: pixels }));

    ws.on('message', (message) => {
        const { action, data, id, pseudo } = JSON.parse(message);
        // console.log(action, data, id, pseudo)
        if (action === 'draw') {
            pixels[data.id] = data;
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({action,data}));
                }
            });
        }
        else if (action === 'add') {
            user[ws] = pseudo;
            // console.log(pseudo)
        }
        else if (action === 'chat') {
             wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({action: 'chat', pseudo, data}));
                }
            });
            
        }
    });
});

server.listen(8080, () => {
    console.log('Server is listening on port 8080');
});
