let app;
let player;
window.onload = () => {

    fetch("/api/move").then(response => {
        return response.json();
    }).then(data => {
        console.log(data)
    });
    app = new PIXI.Application(
        {
            width: 800,
            height: 600,
            backgroundColor: 0xAAAAAA
        }
    );

    document.body.appendChild(app.view);
    player = new PIXI.Sprite.from("images/red-player.png");
    player.anchor.set(0.5);
    player.x = app.view.width / randomNumber(4);
    player.y = app.view.height / randomNumber(4);

    app.stage.addChild(player);
}

document.addEventListener('keyup', (e) => {
    const a = 10;
    switch (e.key) {
        case 'ArrowUp':
            player.y -= a;
            break;
        case 'ArrowDown':
            player.y += a;
            break;
        case 'ArrowRight':
            player.x += a;
            break;
        case 'ArrowLeft':
            player.x -= a;
            break;
    }
});

function randomNumber(max) {
    max = Math.floor(max);
    return Math.floor(Math.random() * (max)) + 1;
}