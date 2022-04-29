let socket = io();
//console.log("helper is conected");

//listen for confirmation of socket; confirms that the client is connected
socket.on('connect', () => {
   console.log("client connected via sockets");
   // now that client has connected to server, emit name and room information
   let data = {
      'name': sessionStorage.getItem('name'),
      'room': sessionStorage.getItem('room'),
   }
   socket.emit('userData', data);
})

let allow_start;
let game;
let rules;
let players;
let end;
let inst;

//boolean
let start = false;
let gameOn = true; //to check if the game is on

window.addEventListener("load", () => { // on load  
   allow_start = false;
   game = document.getElementById('container');
   rules = document.getElementById('rules');
   players = document.getElementById('players');
   end = document.getElementById('end');
   inst = document.getElementById("player-instructions");

   game.style.display = "none";
   rules.style.display = "block";
   players.style.display = "none";
   end.style.display = "none";

   // Assign player with their respective arrows
   socket.on('player1', () => {
       console.log('wait for another player to join');
       inst.textContent = Player1Instruction;
   })

   // To allow starting the game when two players are in
   socket.on('player2', () => {
      inst.textContent = Player2Instruction;
       allow_start = true;
   })

   // Kick users out when there are more than 2 players in the game
   socket.on('morePlayers', () => {
       alert("There are 2 players in the game already! Please try again later!");
       window.location = '/map/index.html';
   })
})


//function to start game
function startGame() {
   rules.style.display = "none";
   game.style.display = "block";
   players.style.display = "block";
   // to allow the game to start when the second player presses on the start button
   if (allow_start == true) {
       console.log("two players are in");
       socket.emit('roomStart', roomStart);
       console.log(roomStart);
   }
}



// permission to start the game
socket.on('startDataFromServer', () => {
   console.log("you can start now");
   players.innerHTML = 'START!';
   start = true;
})


//to go back to home page
function goHome() {
   socket.emit('userLeft', '');
   window.location = '/map/index.html';
}
