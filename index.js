//Initialize the express 'app' object
let express = require('express');
let app = express();
app.use('/', express.static('public'));

//Initialize the actual HTTP server
let http = require('http');
let server = http.createServer(app);

//Initialize socket.io
let io = require('socket.io');
io = new io.Server(server);

//create a variable to store all messages
let rooms = {}; //save key value pair of room name and # of people
let users = {}; //save key value pair with username and user ID

//When client tries to connect with server
io.sockets.on('connect', (socket) => {
    console.log("we have a new client: ", socket.id);

    //get user data
    socket.on('userData', (data) =>{
        //save username in an array with their ID
        socket.name = data.name;
        users[socket.name] = socket.id;
        console.log(users);

        //let the socket join room of choice
        socket.roomName = data.room;
        socket.join(socket.roomName);
        if(rooms[socket.roomName]){ //if room exists
            rooms[socket.roomName] ++;
        } else {
            rooms[socket.roomName] = 1;
        }
        console.log("#######",rooms['Field']);
    })

    //if this particular socket disconnects
    socket.on('disconnect', () => { 
        console.log("socket has been disconnected ", socket.id);
        rooms[socket.roomName]--;
        delete users[socket.name];
        console.log("The users left are: ", users)
    })

    //listen for a message from this client
    socket.on('positionData', (pos) => {
        io.sockets.emit('positionDataFromServer', pos); //send the same data back to all clients
    })

    console.log("number of people ******", rooms['Field']);
    if (rooms['Field'] == undefined){
        console.log("This is client 1 ", socket.id);
        socket.emit('player1', '');
    }
    else if (rooms['Field'] == 1){
        console.log("This is client 2 ", socket.id);
        socket.emit('player2', ''); 
        socket.to("Field").emit('message', '');
    }
    else{
        /******************** BLOCK ACCESS ********************/
        console.log("This is client: ", rooms['Field'], socket.id);
        socket.emit('morePlayers', ''); 
    }
})

//run the createServer
let port = process.env.PORT || 2000;
server.listen(port, () => {
    console.log("Server listening at port: " + port);
});
