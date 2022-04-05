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
let x = 0;
let y = 20;
let rope;

function preload() {
    rope = loadImage('/field/tugOfWarImages/rope.png');
}

function setup() {
    var canvas = createCanvas(windowWidth, 80);
    canvas.parent('p5');
    x = windowWidth/2;
    console.log(x);
    background(255,0);
    //have the rope initialized on the screen
    fill(238, 210, 100)
    stroke(255, 204, 0);
    strokeWeight(3);
    triangle(x - 20, y + 50, x, y, x + 20, y + 50);
    image(rope, x - windowWidth, y - 50, windowWidth*2, 100);
    socket.on('positionDataFromServer', (data) =>{ //send to all clients
        drawData(data);
    })
}

function keyPressed() {
    if (keyIsDown(RIGHT_ARROW)) { //if right arrow key is pressed, move to the right
        x += 30;
    }
    if (keyIsDown(LEFT_ARROW)) { //if left arrow key is pressed, move to the left
        x -= 30;                      
    }
    let pos = {x: x};
    //emit this information to the server
    socket.emit('positionData', pos);//send to all the connected clients
}

function drawData(pos) {
    clear();
    x = pos.x;
    console.log(x)
    fill(238, 210, 100)
    stroke(255, 204, 0);
    strokeWeight(3);
    triangle(pos.x - 20, y + 50, pos.x, y, pos.x + 20, y + 50);
    image(rope, x - windowWidth, y - 50, windowWidth*2, 100);
    if (pos.x < 0 || pos.x > windowWidth){
        background(139,0,0);
        textSize(32);
        fill(255);
        noStroke();
        if (pos.x < 0){
            let winner = "Player 1 won!";
            text(winner, 290, 300);
            text("Refresh to play again!", 240, 350);
            x = -4000;
        }
        if (pos.x > windowWidth){
            let winner = "Player 2 won!";
            text(winner, 290, 300);
            text("Refresh to play again!", 240, 350);
            x = 4000;
        }
    }
}
