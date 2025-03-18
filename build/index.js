import { Application, Graphics, Text } from "pixi.js";
import { io } from "socket.io-client";

const socket = io();

(async () => {

    const app = new Application();
    await app.init({background: 0x000000});
    document.body.appendChild(app.canvas);

    app.stage.addChild(new Graphics().rect(0, 0, 100, 100).fill(0x00ff00))

    document.querySelector('#roomCreate').addEventListener('click', e => {
        const rName = document.querySelector('#roomName');
        if (rName.value != '') {
            socket.emit('room create', {roomName: rName.value});
            rName.value = '';
        }
    })

    socket.on('new room', data => {
        const li = document.createElement('li');
        const click = document.createElement('button');

        click.innerText = data.roomName;
        click.type = 'button';
        click.classList.add('btn', 'btn-link');
        click.addEventListener('click', e => {

        });

        li.appendChild(click); document.querySelector('#rooms').appendChild(li);
    })
})();