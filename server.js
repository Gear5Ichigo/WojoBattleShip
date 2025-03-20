const express = require('express');
const { createServer } = require('http');
const { networkInterfaces } = require('os');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

const PORT = 3000;

//

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/src', express.static('src'))
app.use(express.static('node_modules/bootstrap/dist/css/'));

//

server.listen(PORT, () => {
    console.log(`\nListening on ... \n`);
    Object.values(networkInterfaces()).forEach( i => {
        i.forEach( n => {
            if (n.family !== 'IPv4') return;
            console.log(`\t>\t\x1b[34mhttp://${n.address}:${PORT}`);
        });
    });
    console.log('');
});

//

app.get('/', (req, res) => res.render('index') );

//

const rooms = [];

io.on('connection', socket => {

    socket.emit('init', rooms);

    socket.on('room create', data => {
        console.log(parseInt(socket.rooms.size), socket.rooms);
        if (parseInt(socket.rooms.size) < 2) {
            console.log(socket.rooms.size)
            if (rooms.indexOf(data.roomName) == -1) {
                rooms.push(data.roomName);
                console.log(rooms)
                io.emit('new room', data);
            } else {
                io.to(socket.id).emit('room exists');
            }
        }
    });

    socket.on('disconnect', () => {
        rooms.splice(rooms.indexOf(socket.rooms[0], 1));
    })
});