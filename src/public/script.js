
let app;
let myself = { id: null };
let players = {};
const socket = new SockJS('/echo');


app = new PIXI.Application(
    {
        width: 800,
        height: 600,
        backgroundColor: 0xAAAAAA
    }
);

document.body.appendChild(app.view);


socket.onopen = (event) => {
    console.log('connected to ws server', event)
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('new message from server', data)
    if (data.type === 'newPlayer') {
        console.log('new player')
        const sprite = new PIXI.Sprite.from("images/blue-player.png");
        sprite.anchor.set(0.5);
        sprite.x = app.view.width / 2;
        sprite.y = app.view.height / 2;
        app.stage.addChild(sprite);
        players[data.id] = { sprite, x: null, y: null };
    } else if (data.type === 'welcome') {
        const mysprite = new PIXI.Sprite.from("images/red-player.png");
        mysprite.anchor.set(0.5);
        mysprite.x = app.view.width / 2;
        mysprite.y = app.view.height / 2;
        myself.sprite = mysprite;
        myself.id = data.id;
        players[data.id] = myself;
        app.stage.addChild(mysprite);
        console.log('data.currentPlayers', data.currentPlayers)
        data.currentPlayers.forEach(player => {
            if(player.id == myself.id) return;
            console.log('')
            const sprite = new PIXI.Sprite.from("images/blue-player.png");
            sprite.anchor.set(0.5);
            sprite.x = +player.x;
            sprite.y = +player.y;
            const newPlayer = {};
            newPlayer.sprite = sprite;
            newPlayer.id = player.id;
            players[player.id] = newPlayer;
            app.stage.addChild(sprite);
        });
        const message = { id: myself.id, type: "move", position: { x: myself.sprite.x, y: myself.sprite.y } };
        sendMessage(message);
    } else if(data.type === 'playerMove') {
        players[data.id].sprite.x = +data.x;
        players[data.id].sprite.y = +data.y;
    } else if(data.type === 'removePlayer') {
        app.stage.removeChild(players[data.id].sprite);
        delete players[data.id];
        
    }
};

const sendMessage = (data) => {
    socket.send(JSON.stringify({ id: myself.id, data: data }));
}


// fetch("/api/move").then(response => {
//     return response.json();
// }).then(data => {
//     console.log(data)
// });




document.addEventListener('keyup', (e) => {
    moveSprite(myself.sprite, e.key)
    const message = { id: myself.id, type: "move", position: { x: myself.sprite.x, y: myself.sprite.y } };
    sendMessage(message);
});

function newPlayer() {

}

function randomNumber(max) {
    max = Math.floor(max);
    return Math.floor(Math.random() * (max)) + 1;
}


function moveSprite(sprite, direction) {
    const a = 10;

    switch (direction) {
        case 'ArrowUp':
            sprite.y -= a;
            break;
        case 'ArrowDown':
            sprite.y += a;
            break;
        case 'ArrowRight':
            sprite.x += a;
            break;
        case 'ArrowLeft':
            sprite.x -= a;
            break;
    }
}

window.onbeforeunload = () => {
    sendMessage({type: 'close', id: myself.id})
}