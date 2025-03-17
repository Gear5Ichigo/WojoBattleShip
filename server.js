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
app.use('/bootstrap', express.static('node_modules/bootstrap/dist/css/bootstrap.min.css'));

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

io.on('connection', socket => {

});