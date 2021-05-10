const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const axios = require('axios');
const config = require('./config.json');

// Initializing necessary variables
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Setting up app
app.use(express.json());

// Socket IO
io.on('connection', (socket) => {
    console.log("Connected!");

    socket.on('addChat', (data) => {
        // axios.post(`${config.server_url}/api/chats/add/`)
    });
});

// Routes
app.get('/', (req, res) => {
    res.json({
        'msg': "Welcome to Node Server!",
    });
})

// Default Route 404 Not Found
app.all('*', (req, res) => {
    res.json({
        'msg': "Invalid Request",
    });
});


// PORT
const port = process.env.PORT || 3000;

// Initiating server
server.listen(port, '0.0.0.0', () => {
    console.log(`Server started at http://localhost:${port}`);
});