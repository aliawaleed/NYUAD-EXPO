//Initialize the express 'app' object
let express = require('express');
let app = express();
app.use('/', express.static('public'));

//Initialize the actual HTTP server
let http = require('http');
let server = http.createServer(app);

//Initialize socket.io
let io = require('socket.io');

// for admin UI
const {instrument} = require("@socket.io/admin-ui");


io = new io.Server(server, {
    // also for admin UI
    cors: {
        origin: ["https://admin.socket.io"],
        credentials: true
    }
});

// also for admin UI
instrument(io, {
    auth: false

    //for password
    // auth: {
        // type: "basic",
        // username: "admin",
        // password: "$2b$10$LhUtmkmPS.Vqn38DtCb4cO1o0dwM.39Ghv7d/R.tXEwQdyQ0pAfye" 
    // }
});

// to access https://admin.socket.io/#/ ---- http://localhost:2000/admin

//create a variable to store all messages
let rooms = {}; //save key value pair of room name and # of people
let users = {}; //save key value pair with username and user ID

//When client tries to connect with server
io.sockets.on('connect', (socket) => {
    console.log("we have a new client: ", socket.id);

    //get user data
    socket.on('userData', (data) => {
        //save username in an array with their ID
        socket.name = data.name;
        users[socket.name] = socket.id;
        console.log(users);

        //let the socket join room of choice
        socket.roomName = data.room;

        socket.join(socket.roomName);
        //here seems to be the issue where when the 2nd person leave the room, the room is still existing so the numbrer of player in the room is marked 1
        if (rooms[socket.roomName]) { //if room exists
            // do not increment if there are 2 people in the room 
            if (rooms[socket.roomName] == 2) {
                console.log("Client > 2: ", socket.id);
                socket.emit('morePlayers', '');
            }
            else{
                rooms[socket.roomName]++;
            }
        } else {
            rooms[socket.roomName] = 1;
        }

        // get the vnumber of players in each room and send to map
        let A2 = rooms["A2"];
        let C2 = rooms["C2"];
        let D2 = rooms["D2"];
        let Field = rooms["Field"];

        io.in("map").emit("A2PlayerNum", A2);
        io.in("map").emit("C2PlayerNum", C2);
        io.in("map").emit("D2PlayerNum", D2);
        io.in("map").emit("FieldPlayerNum", Field);


        for (const [key, value] of Object.entries(rooms)) {
            console.log(`${key}: ${value}`);

            // console.log("The number of players in the room is: ", rooms[key]);
            if (value == 1) {
                console.log("Client 1: ", socket.name, socket.id);
                socket.emit('player1', socket.name);
            }
            else if (value == 2) {
                console.log("Client 2: ", socket.name, socket.id);
                socket.emit('player2', socket.name);
                io.in(key).emit('player2Start', '');
                io.in(key).emit('message', '');
            }
        }
    })

    //when the client in the room leaves, all clients in the room needs to be restarted

    //if this particular socket disconnects remove from room number of people in the and delete from users
    socket.on('disconnect', () => {
        console.log("socket has been disconnected ", socket.id);
        if(rooms[socket.roomName]) {
            rooms[socket.roomName]--;
            }
        delete users[socket.name];
        console.log("The users left in: ", socket.roomName, users);
    })

    socket.on('userLeft', () => {
        delete users[socket.name];
        rooms[socket.roomName]--;
        console.log("The users left in: ", socket.roomName, users);
    })

    /******************** FIELD ********************/
    //listen for a message from this client
    socket.on('positionData', (pos) => {
        io.sockets.emit('positionDataFromServer', pos); //send the same data back to all clients
    })

    socket.on('fieldStart', () => {
        console.log("Field started");
        io.in("Field").emit('fieldStartDataFromServer', '');
    })

    /******************** D2 ********************/
    socket.on('D2start', () => {
        console.log("D2 started");
        socket.to("D2").emit('startDataFromServer', '');
    })

    socket.on('canStart', () => {
        io.in("D2").emit('canStartDataFromServer', '');
    })

    socket.on('submit', (completed) => {
        socket.to("D2").emit('submitDataFromServer', completed);
    })

    socket.on('finish', (completed) => {
        // console.log("Game Over! The other user completed: ", completed);
        console.log('completed');
        socket.to("D2").emit('finishDataFromServer', completed);
    })

    /******************** C2 ********************/
    socket.on('C2start', () => {
        console.log("C2 started");
        socket.to("C2").emit('C2startDataFromServer', '');
    })

    socket.on('C2canStart', () => {
        socket.to("C2").emit('C2canStartDataFromServer', '');
    })

    socket.on('C2finish', (completed) => {
        // console.log("Game Over! The other user completed: ", completed);
        console.log('C2 completed');
        socket.to("C2").emit('C2finishDataFromServer', completed);
    })

    socket.on('mousePositionData', (data) => {
        console.log(data);
        io.sockets.emit('mouseDataFromServer', data);
    })

    //Listen for a message named 'msg' from this client
    socket.on('msg', function (data) {
        //Data can be numbers, strings, objects
        console.log("Received a 'msg' event");
        console.log(data);

        //Send a response to all clients, including this one
        io.sockets.emit('msg', data);
    });

    //when drawclicked Send a response to all clients, including this one
    socket.on('drawClicked',function(){
        io.sockets.emit('drawclicked','');
        console.log('drawClicked');
    });

    //Listen for a message named 'randomword' from this client
    socket.on('randomwordguess', function (data) {
        //Data can be numbers, strings, objects
        console.log("Received a 'randomword' event");
        console.log(data);

        //Send a response to all other clients, not including this one
        socket.broadcast.emit('randomwordguess', data);
    });

    //Listen for a message named 'displayrandomword' from this client
    socket.on('displayrandomword', function (data) {
        //Data can be numbers, strings, objects
        console.log("Received a 'displayrandomword' event");
        console.log(data);

        //Send a response to just this client
        socket.emit('displayrandomword', data);
    });

    //Listen for a message named 'matchingword'
    socket.on('matchingword', function (data) {
        //Send a response to all cients
        io.sockets.emit('matchingword', data);
        socket.broadcast.emit('scoreadd', data);
    });

    /******************** A2 ********************/
    //listen for majoradd from client

    //A2 start and finish
    socket.on('A2start', () => {
        console.log("A2started");
        socket.to("A2").emit('A2startDataFromServer', '');
    })

    socket.on('A2canStart', () => {
        io.in("A2").emit('A2canStartDataFromServer', '');
    })

    socket.on('majoradd', (data) => {
        console.log('this is the major received' + data);
        io.in("A2").emit('majoradd', data);
        socket.emit('scoreadd',data);
    });

    socket.on('color', (data) => {
        console.log('this color is received' + data);
        io.in("A2").emit('colorFromServer', data);
    })


    socket.on('A2finish', (completed) => {
        // console.log("Game Over! The other user completed: ", completed);
        console.log('A2completed');
        io.sockets.to("A2").emit('A2finishDataFromServer', completed);
    })
})

// run the server on port 2000
let port = process.env.PORT || 2000;
server.listen(port, () => {
    console.log("Server listening at port: " + port);
});
