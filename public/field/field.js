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
        if (pos.x < 0 || pos.x > windowWidth){
            gameOn = false;    
        }        
    }
    else{
        console.log(gameOn);
        clear();
        textSize(24);
        fill(255);
        noStroke();
        let refresh = "Refresh to play again!"
        if (pos.x < 0){ //if player 1 won and passed the triangle on the left side
            let winner = "Player 1 won!";
            line(0, 10, width, 10);
            textAlign(CENTER, TOP);
            text(winner, 0, 10, width);
            line(0, 54, width, 54);
            textAlign(CENTER, CENTER);
            text(refresh, 0, 54, width);
            x = -4000;
        }
        if (pos.x > windowWidth){ //if player 1 won and passed the triangle on the right side
            let winner = "Player 2 won!";
            line(0, 10, width, 10);
            textAlign(CENTER, TOP);
            text(winner, 0, 10, width);
            line(0, 54, width, 54);
            textAlign(CENTER, CENTER);
            text(refresh, 0, 54, width);
            x = 4000;
        }

    }
}