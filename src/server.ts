import { WebSocket } from "ws";
const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3000;
const server = require('http').createServer(app);


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));
const wss = new WebSocket.Server({ server })

let currentId = 0;
let players = {};

wss.on('connection', ws => {
    console.log('new client connected');
    currentId++; 
    players[currentId] = { x: null, y: null };

    const currentPlayers = Object.keys(players).map(key => {
        const item = players[key];
        return { id: key, ...item };
    });
    ws.send(s({ type: 'welcome', id: currentId.toString(), currentPlayers }));
    sendToAll(ws, s({ type: 'newPlayer', id: currentId.toString() }))

    ws.on('message', (message: any) => {
        console.log('recieved ' + message);
        message = JSON.parse(message);
        console.log('message.data.type', message.data.type)
        if (message.data.type === 'move') {
            players[message.data.id] = message.data.position;
            console.log(JSON.stringify(players))
            sendToAll(ws, s({
                type: 'playerMove',
                id: message.data.id.toString(),
                x: message.data.position.x,
                y: message.data.position.y
            }));
        } if (message.data.type === 'close') {
            sendToAll(ws, s({
                type: 'removePlayer',
                id: message.data.id
            }))
            delete players[message.data.id];
        }

    });

    ws.on('close', data => {
        console.log('CLOSE', data)
    })

})


app.get('/api/move', (req, res) => {
    res.json(['tester']);
})

app.get("*", (req, res) => {
    console.log('home');
    return res.sendFile(path.join(__dirname, "public/index.html"));
});

server.listen(PORT, () => {
    console.log("on " + PORT);
});

function s(json) {
    return JSON.stringify(json);
}

function p(json) {
    return JSON.parse(json);
}

function sendToAll(ws, message) {
    wss.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    })
}