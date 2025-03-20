import { Application, Graphics, Text } from "pixi.js";
import { io } from "socket.io-client";

const socket = io();

(async () => {

    const rName = document.querySelector('#roomName');
    const creationDiv = document.querySelector('#creation');
    const roomActions = document.querySelector('#roomActions');

    const app = new Application();
    await app.init({background: 0x000000});
    document.body.appendChild(app.canvas);

    app.stage.addChild(new Graphics().rect(0, 0, 100, 100).fill(0x00ff00))

    document.querySelector('#roomCreate').addEventListener('click', e => {
        if (!creationDiv.classList.contains('d-none')) creationDiv.classList.add('d-none');
        roomActions.classList.remove('d-none');
        if (rName.value != '') {
            socket.emit('room create', {roomName: rName.value});
            rName.value = '';
        }
    })

    socket.on('init', rooms => {
        for (const room of rooms) {
            const li = document.createElement('li');
            const click = document.createElement('button');
    
            click.innerText = data.roomName;
            click.type = 'button';
            click.classList.add('btn', 'btn-link');
            click.addEventListener('click', e => {
    
            });
    
            li.appendChild(click); document.querySelector('#rooms').appendChild(li);
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
    });

    socket.on('room exists', () => {
        if (!roomActions.classList.contains('d-none')) roomActions.classList.add('d-none');
        creationDiv.classList.remove('d-none');
        rName.value = 'Room Already Exists!';
    })
})();