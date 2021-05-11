//client.js
const io = require('socket.io-client');
const socket = io.connect('http://localhost:3000', { reconnect: true });
const sid = ""
// Add a connect listener
socket.on('connect', (_) => {
    console.log('Connected!');
});

socket.emit('user:setActive', {
    token: '99ca2735-5282-4456-b648-d5bb4d6036ae'
})

socket.emit('chat:notify', {
    'sid': `${sid}`,
    'data': {
        "id": 22,
        "message": "how are you?",
        "from_user": {
            "id": "98e42556-9a15-4b86-8c89-c3c2f7188153",
            "username": "deneshraj",
            "email": "rockydenusachin@gmail.com",
            "dateCreated": "2021-05-04",
            "verified": true,
            "profilePicUrl": ""
        },
        "to_user": {
            "id": "b9777f4d-bce9-454b-ac91-254efbeeb579",
            "username": "testuser",
            "email": "test@email.com",
            "dateCreated": "2021-05-04",
            "verified": true,
            "profilePicUrl": ""
        },
        "dateCreated": "2021-05-11T12:27:01.383Z"
    },
    "sid": "B41sPfeNEbvUWheTAAAD",
    "active": true
});

socket.on('chat:refresh', (data) => {
    console.log("Refreshing...", data);
});