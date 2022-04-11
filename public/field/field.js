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

let allow_start = false;

window.addEventListener("load", () => { // on load    
    let game = document.getElementById('container');
    game.style.display = "none";

    let rules = document.getElementById('rules');
    rules.style.display = "block";

    let players = document.getElementById('players');
    players.style.display = "none";

    let end = document.getElementById('end');
    end.style.display = "none";    

    socket.on('player1',() =>{
        console.log('wait for another player to join');
        let inst = document.getElementById("player-instructions");
        inst.textContent = "You are player 1! Use the LEFT arrow key to win!";
    })
  
    socket.on('player2',()=>{
        let inst = document.getElementById("player-instructions");
        inst.textContent = "You are player 2! Use the RIGHT arrow key to win!";
        allow_start = true; 
    })

    socket.on('morePlayers',()=>{
        alert("There are 2 players in the game already! Please try again later!");
        window.location = '/map/index.html';
    })
})


let start = false;
//function to start game
function startGame(){
    let rules = document.getElementById('rules');
    rules.style.display = "none";
    let game = document.getElementById('container');
    game.style.display = "block";
    let players = document.getElementById('players');
    players.style.display = "block";
    if (allow_start == true) {
        console.log("two players are in"); 
        socket.emit('fieldStart', ''); //start game for the rest of the users
    }
}

socket.on('fieldStartDataFromServer', ()=>{
    console.log("you can start now");
    let players = document.getElementById('players');
    players.innerHTML = 'START!';
    start = true;
})

function home() {
    window.location = '/map/index.html';
}

//////////////////p5 code//////////////////
//global variables
let x = 0;
let y = 20;

let gameOn = true;

function setup() {
    var canvas = createCanvas(windowWidth, 80);
    canvas.parent('p5');
    x = windowWidth/2; //to center the triangle for winning on the screen 
    console.log(x);
    background(255,0);
    //have the rope initialized on the screen
    stroke(230);
    fill(255)
    strokeWeight(3);
    triangle(x - 20, y + 50, x, y, x + 20, y + 50);
    stroke(255);
    strokeWeight(10);
    line(x - windowWidth, y, windowWidth*2, y);
    rect(x, y, 0.4, 0.4);
    // for rope motion effect
    stroke(200);
    for (let i = 1; i < 12; i++) {
        line(x-100*i, y, (x-100*i) - 30, y);
        line(x+100*i, y, (x+100*i) + 30, y);
    }
    socket.on('positionDataFromServer', (data) =>{ //send to all clients
        drawData(data);
    })
}

function keyPressed() {
    if (start == true) {
        if (keyIsDown(RIGHT_ARROW)) { //if right arrow key is pressed, move to the right
            x += 60;
        }
        if (keyIsDown(LEFT_ARROW)) { //if left arrow key is pressed, move to the left
            x -= 60;                      
        }
        let pos = {x: x};
        //emit this information to the server
        socket.emit('positionData', pos);//send to all the connected clients
    }
    else{
        alert("Please wait for another player to join!");
    }
}

function drawData(pos) {
    clear(); // to avoid printing the rope again in the background since the p5 window is transparent
    if (gameOn == true) {
        x = pos.x;
        //formatting for line and triangle
        stroke(230);
        fill(255)
        strokeWeight(3);
        triangle(x - 20, y + 50, x, y, x + 20, y + 50);
        stroke(255);
        strokeWeight(10);
        line(x - windowWidth, y, windowWidth*2, y);
        // for rope motion effect
        stroke(200);
        for (let i = 1; i < 12; i++) {
            line(x-100*i, y, (x-100*i) - 30, y);
            line(x+100*i, y, (x+100*i) + 30, y);
        }
        // check win conditions
        if (pos.x <= 20 || pos.x >= windowWidth - 20){
            gameOn = false;    
        }        
    }
    else {
        clear();
        textSize(24);
        fill(255);
        noStroke();
        let players = document.getElementById('players');
        players.style.display = "none";
        let winner;
        if (pos.x <= 20){ //if player 1 won and passed the triangle on the left side
            winner = "Player 1 won!";
        }
        if (pos.x >= windowWidth - 20){ //if player 1 won and passed the triangle on the right side
            winner = "Player 2 won!";
        }
        let displayWinner = document.getElementById('winner');
        displayWinner.textContent = winner;    
        let end = document.getElementById('end');
        end.style.display = "block";    
        let rules = document.getElementById('rules');
        rules.style.display = "none";
        let container = document.getElementById('container');
        container.style.display = "none";
    }
}

function joinRoom() {
    window.location = '/map/index.html';
}