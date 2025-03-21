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

async function leave(socket) {
    const theroom = Array.from(socket.rooms)[1];
    socket.leave(theroom);
    io.emit('update rooms', await getRooms());
}

async function getRooms() {
    const rooms = [];
    (await io.fetchSockets()).forEach( so => {
        if (Array.from(so.rooms).length <= 1) return;
        const specific = Array.from(so.rooms)[1];
        if (rooms.indexOf(specific) == -1) rooms.push({name: specific, size: io.sockets.adapter.rooms.get(specific).size})
    });
    return rooms;
}

io.on('connection', async socket => {

    socket.emit('init', rooms);
    socket.emit('update rooms', await getRooms());

    socket.on('room create', async data => {
        if (parseInt(socket.rooms.size) < 2) {
            if (!io.sockets.adapter.rooms.has(data.roomName)) {
                socket.join(data.roomName);
                io.emit('update rooms', await getRooms());
            } else {
                io.to(socket.id).emit('room exists');
            }
        }
    });

    socket.on('join room', async roomName => {
        if (socket.rooms.has(roomName)) return;
        if (socket.rooms.size < 2) {
            socket.join(roomName); console.log(roomName);
        }
    })

    socket.on('leave room', async () => {
        leave(socket);
    });

    socket.on('disconnect', async () => {
        leave(socket);
    });
});