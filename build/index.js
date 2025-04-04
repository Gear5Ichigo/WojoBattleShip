import { Application, Graphics, Text } from "pixi.js";
import { io } from "socket.io-client";
import Game from "./game";

const socket = io();

(async () => {

    const rooms = document.querySelector('#rooms');
    const rName = document.querySelector('#roomName');
    const creationDiv = document.querySelector('#creation');
    const roomActions = document.querySelector('#roomActions');
    const leaveRoom = document.querySelector('#leave');
    const startGame = document.querySelector('#start');

    let game = null;

    const app = new Application();
    await app.init({background: 0x000000});
    app.canvas.classList.add('d-block', 'mx-auto');
    document.body.appendChild(app.canvas);

    app.stage.addChild(new Text({text: "awaiting...", style: {fill: 0xffffff}}))

    document.querySelector('#roomCreate').addEventListener('click', e => {
        if (!creationDiv.classList.contains('d-none')) creationDiv.classList.add('d-none');
        roomActions.classList.remove('d-none');
        if (rName.value != '') {
            socket.emit('room create', {roomName: rName.value});
            rName.value = '';
        }
    });

    leaveRoom.addEventListener('click', e => {
        socket.emit('leave room');
        if (!roomActions.classList.contains('d-none')) roomActions.classList.add('d-none');
        creationDiv.classList.remove('d-none');
    });

    startGame.addEventListener('click', e => {
        socket.emit('start game');
    });

    socket.on('start game', rooms => {
        game = new Game();
        app.stage.removeChildAt(0);
        for (let row = 0; row < game.grid.length; row ++) {
            for (let col = 0; col < game.grid[row].length; col ++) {
                const tile = new Graphics().rect(0+(35*col), 0+(35*row), 30, 30).fill(0x11aaff).stroke({width: 2, fill: 0xffffff});
                tile.eventMode = 'static';
                tile.onpointerdown = e => {
                    tile.fill(0x00ff00);
                    console.log('green please');
                }
                app.stage.addChild(tile);
            }
        }
    });

    socket.on('update rooms', data => {
        rooms.innerHTML = '';
        for (const room of data) {
            const li = document.createElement('li');
            const click = document.createElement('button');
    
            click.innerText = room.name;
            click.type = 'button';
            click.classList.add('btn', 'btn-link');
            click.addEventListener('click', e => {
                if (!creationDiv.classList.contains('d-none')) creationDiv.classList.add('d-none');
                roomActions.classList.remove('d-none');
                socket.emit('join room', click.innerText);
            });

            li.appendChild(click); rooms.appendChild(li);
        }
    });

    socket.on('room exists', () => {
        if (!roomActions.classList.contains('d-none')) roomActions.classList.add('d-none');
        creationDiv.classList.remove('d-none');
        rName.value = 'Room Already Exists!';
    })
})();