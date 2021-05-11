const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const axios = require('axios');
const uuid = require('uuid');
const config = require('./config.json');

// Initializing necessary variables
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Setting up app
app.use(express.json());

function sendAuthorizedRequest(url, token, data) {
    options = {
        headers: { 'Authorization': `Bearer ${token}` }
    }

    return axios.post(url, data, options);
}

let activeClients = []

function getUserFromSid(sid) {
    user = activeClients.filter((client) => client.sid === sid)[0];
    return user;
}

// Socket IO
io.on('connection', (socket) => {
    socket.on('user:setActive', (data) => {
        sendAuthorizedRequest(`${config.server_url}/api/user/socket`, data['token'], { 'sid': socket.id })
        .then(res => {
            activeClients.push({
                'sid': socket.id,
                'token': data['token'],
            });
        })
        .catch(err => console.error(err.response.data));
    });

    socket.on('client:getId', (_) => {
        socket.emit('client:id', { sid: socket.id });
    });

    socket.on('chat:notify', (data) => {
        sid = data['sid'];
        user = getUserFromSid(sid);
        console.log(activeClients);
        if(user != null) {
            io.to(sid).emit('chat:refresh', { 'refresh': true, 'data': data['data'] });
        }
    })

    socket.on('disconnecting', (data) => {
        user = getUserFromSid(socket.id);
        if(user != null) {
            sendAuthorizedRequest(`${config.server_url}/api/user/inactive`, user['token'], {
                'sid': socket.id
            }).then(res => {
                console.log(res.response.data)
            }).catch(err => console.error(err.response.data));
            console.log(user);
        }
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