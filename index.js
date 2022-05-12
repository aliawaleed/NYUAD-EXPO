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
const { instrument } = require("@socket.io/admin-ui");

io = new io.Server(server, {
    cors: {
        origin: ["https://admin.socket.io"],
        credentials: true
    }
});

instrument(io, {
    auth: false

    //for password
    // auth: {
    // type: "basic",
    // username: "admin",
    // password: "$2b$10$LhUtmkmPS.Vqn38DtCb4cO1o0dwM.39Ghv7d/R.tXEwQdyQ0pAfye" 
    // }
});

//create a variable to store all of the rooms and users
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
            else {
                rooms[socket.roomName]++;
            }
        } else {
            rooms[socket.roomName] = 1;
        }

        // get the number of players in each room and send to map page
        let A2 = rooms["A2"];
        let C2 = rooms["C2"];
        let D2 = rooms["D2"];
        let Field = rooms["Field"];
        let D1 = rooms["D1"];
        let dorm = rooms["dorm"];

        io.emit("A2PlayerNum", A2);
        io.emit("C2PlayerNum", C2);
        io.emit("D2PlayerNum", D2);
        io.emit("FieldPlayerNum", Field);
        io.emit("D1PlayerNum", D1);
        io.emit("dormPlayerNum", dorm);

        // to get the number of users in each room and emit information based on if the player is player 1 or 2
        for (const [key, value] of Object.entries(rooms)) {
            console.log(`${key}: ${value}`);

            // if there is one player/if it's the first player
            if (value == 1) {
                console.log("Client 1: ", socket.name, socket.id);
                socket.emit('player1', socket.name);
            }
            // if 2 players are in the room 
            else if (value == 2) {
                console.log("Client 2: ", socket.name, socket.id);
                socket.emit('player2', socket.name); //emit info to this specific socket
                io.in(key).emit('player2Start', '');//player 2 click start button
                io.in(key).emit('message', ''); //send to all sockets in the room
            }
        }
    })

    //if this particular socket disconnects remove from room number of people in the and delete from users
    socket.on('disconnect', () => {
        console.log("socket has been disconnected ", socket.id);
        if (rooms[socket.roomName]) {
            rooms[socket.roomName]--;
        }
        delete users[socket.name];
        console.log("The users left in: ", socket.roomName, users);
    })

    //delete the user if they leave by clicking the home button
    socket.on('userLeft', () => {
        console.log("socket has been disconnected ", socket.id);
        if (rooms[socket.roomName]) {
            rooms[socket.roomName]--;
        }
        delete users[socket.name];
        console.log("The users left in: ", socket.roomName, users);

        socket.leave(socket.roomName);
        socket.roomName = "map";
        rooms["map"]++;
    })

    /******************** FIELD ********************/
    // send the location of the triangle and rope to both players
    socket.on('positionData', (pos) => {
        io.sockets.emit('positionDataFromServer', pos); //send the same data back to all clients
    })

    /******************** DORM ********************/
    // // to start the game
    socket.on('dormStart', () => {
        console.log("Dorm started");
        socket.to("dorm").emit('dormStartTimerFromServer', '');
        // io.in("dorm").emit('dormStartDataFromServer', '');
    })

    socket.on('gotItem', (label, i, score) => {
        socket.to("dorm").emit("gotItemFromServer", label, i, score);
    })

    // when the timer is up send to each user how many meals the other user made
    socket.on('dormEnd', () => {
        console.log('completed');
        socket.to("dorm").emit('dormEndFromServer', "");
    })
    /******************** D2 ********************/
    // to actually start the game
    socket.on('D2start', () => {
        console.log("D2 started");
        socket.to("D2").emit('startDataFromServer', '');
    })

    // allows users to start the game based on the number
    socket.on('canStart', () => {
        io.in("D2").emit('canStartDataFromServer', '');
    })

    //when a player submits a correct meal, send the data to both users 
    socket.on('submit', (completed) => {
        socket.to("D2").emit('submitDataFromServer', completed);
    })

    // when the timer is up send to each user how many meals the other user made
    socket.on('finish', (completed) => {
        console.log('completed');
        socket.to("D2").emit('finishDataFromServer', completed);
    })

    socket.on('clickedStart', (room) => {
        console.log('clicked start');
        io.in(room).emit("usersInFromServer", '');
    })
    /******************** C2 ********************/
    socket.on('C2start', () => {
        console.log("C2 started");
        socket.to("C2").emit('C2startDataFromServer', '');
    })

    socket.on('C2canStart', () => {
        io.in("C2").emit('C2canStartDataFromServer', '');
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
    socket.on('drawClicked', function () {
        io.sockets.emit('drawclicked', '');
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
        socket.broadcast.emit('theirscoreadd', '');
        socket.emit('scoreadd', '');

    });

    socket.on('color', (data) => {
        console.log('this color is received' + data);
        io.in("A2").emit('colorFromServer', data);
    })

    socket.on('A2finish', (completed) => {
        console.log('A2completed');
        io.sockets.to("A2").emit('A2finishDataFromServer', completed);
    })


    /******************** D1 ********************/
    // // to start the game
    socket.on('d1Start', () => {
        console.log("d1 started");
        socket.to("D1").emit('d1StartTimerFromServer', '');
        // io.in("dorm").emit('dormStartDataFromServer', '');
    })

    // allows users to start the game based on the number
    socket.on('index', (index) => {
        io.in("D1").emit('indexFromServer', index);
    })
    // allows users to start the game based on the number
    socket.on('correct', () => {
        io.in("D1").emit('correctFromServer', '');
        socket.broadcast.emit('theirscoreadd', '');
        socket.emit('d1scoreadd', '');
    })

    // when the timer is up send to each user how many meals the other user made
    socket.on('d1End', () => {
        console.log('completed');
        socket.to("D1").emit('d1EndFromServer', "");
    })
    /******************** all the room start ********************/
    // to start the game
    socket.on('roomStart', (data) => {
        console.log(data);
        io.in(data).emit('startDataFromServer', '');
    })

    /******************** for both D1 and Dorm ********************/
    // allows users to start the game based on the number
    socket.on('gameCanStart', (room) => {
        io.in(room).emit('gameCanStartDataFromServer', '');
    })
    // also for other rooms
    socket.on('userClickedStart', (room) => {
        console.log('clicked start', room);
        io.in(room).emit("gameUsersInFromServer", '');
    })


    // socket.on('dormScore', (score) => {
    //     console.log("************", score);
    //     // socket.emit("dormHighScore", score);
    //     io.in("map").emit('dormHighScore', score);
    // })

})



// run the server on port 2000
let port = process.env.PORT || 2000;
server.listen(port, () => {
    console.log("Server listening at port: " + port);
});