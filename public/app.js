console.log('Client is connected.');

//client connects to the server
let socket = io(); //opens and connects to the socket

//listen for confirmation of socket; confirms that the client is connected
socket.on('connect', () => {
    console.log("client connected via sockets");
    // now that client has connected to server, emit name and room information
    let data = {
        'name' : sessionStorage.getItem('name'),
        'room' : sessionStorage.getItem('room'),
    }
    socket.emit('userData', data);
})



/* TUG OF WAR GAME EXAMPLE */
socket.on('player1', () => {
    player1 = "Hello player 1! Please wait for another player to join!";
    let inst = document.getElementById('instructions');
    inst.textContent = player1;
})

socket.on('player2', (player2) => {
    player2 = "Hello player 2! Use the right arrow key to win! ";
    let inst = document.getElementById('instructions');
    inst.textContent = player2;
})

socket.on('morePlayers', (morePlayers) => {
    morePlayers = "Please wait! There are 2 players in the game already!";
    let inst = document.getElementById('instructions');
    inst.textContent = morePlayers;
})

socket.on('message', () => {
    let inst = document.getElementById('instructions');
    inst.textContent = "Another player has joined. Use the left arrow key to win! ";
})

//////////////////p5 code//////////////////
//global variables
let x = -350;
let y = 265;
let rope;
let garden;

function preload() {
    rope = loadImage('/tugOfWarImages/rope.png');
    garden = loadImage('/tugOfWarImages/garden.png');
}

function setup() {
    var canvas = createCanvas(800, 600);
    canvas.parent('p5');
    background(garden);
    //have the rope initialized on the screen
    fill(238, 210, 100)
    stroke(255, 204, 0);
    strokeWeight(3);
    triangle(380, 360, x + 750, 310, 420, 360);
    image(rope, x - 100, y, 1800, 100);
    socket.on('positionDataFromServer', (data) =>{ //send to all clients
        drawData(data);
    })
}

function keyPressed() {
    if (keyIsDown(RIGHT_ARROW)) { //if right arrow key is pressed, move to the right
        x += 30;
        console.log(x)                      
    }
    if (keyIsDown(LEFT_ARROW)) { //if left arrow key is pressed, move to the left
        x -= 30;                      
    }
    let pos = {x: x};
    //emit this information to the server
    socket.emit('positionData', pos);//send to all the connected clients
}

function drawData(pos) {
    background(garden)
    x = pos.x;
    console.log(x)
    fill(238, 210, 100)
    stroke(255, 204, 0);
    strokeWeight(3);
    triangle(pos.x + 730, 360, pos.x + 750, 310, pos.x + 770, 360);
    image(rope, x - 100, y, 1800, 100);
    if (pos.x + 750 < 0 || pos.x + 750 > 800){
        background(139,0,0);
        textSize(32);
        fill(255);
        noStroke();
        if (pos.x + 750 < 0){
            let winner = "Player 1 won!";
            text(winner, 290, 300);
            text("Refresh to play again!", 240, 350);
            x = -4000;
        }
        if (pos.x + 750 > 800){
            let winner = "Player 2 won!";
            text(winner, 290, 300);
            text("Refresh to play again!", 240, 350);
            x = 4000;
        }
    }
}
