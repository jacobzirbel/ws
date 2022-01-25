import * as http from 'http';
import sockjs from 'sockjs';
import { Players } from './models/player.model';
import express from 'express';
import path from 'path';
const app = express();
const PORT = 9999;
const server = http.createServer(app);


const echo = sockjs.createServer();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));

let players: Players = {};

echo.on('connection', conn => {
    players[conn.id] = { x: 0, y: 0, connection: conn };

    const currentPlayers = Object.keys(players).map(key => {
        const { connection, ...item } = players[key];
        return { id: key, ...item };
    });
    conn.write(s({ type: 'welcome', id: conn.id, currentPlayers }));
    sendToAll(conn, s({ type: 'newPlayer', id: conn.id }))

    conn.on('data', (msg) => {
        const message: any = JSON.parse(msg);
        if (message.data.type === 'move') {
            players[message.data.id] = { ...players[message.data.id], ...message.data.position };
            sendToAll(conn, s({
                type: 'playerMove',
                id: message.data.id.toString(),
                x: message.data.position.x,
                y: message.data.position.y
            }));
        } if (message.data.type === 'close') {
            sendToAll(conn, s({
                type: 'removePlayer',
                id: message.data.id
            }))
            delete players[message.data.id];
        }

    });

    conn.on('close', data => {
        console.log('CLOSE', data)
    })

})

echo.installHandlers(server, { prefix: '/echo' });

app.get('/api/move', (req, res) => {
    res.json(['tester']);
})

app.get("*", (req, res) => {
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

function sendToAll(conn: sockjs.Connection, message) {
    Object.keys(players).forEach(k => {
        if(k !== conn.id){
            players[k].connection.write(message);
        };
    })
}