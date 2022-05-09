let socket = io();
console.log("helper is conected");

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
let scores;
let turnCamOn = false; 
let results;

//boolean
let start = false;
let gameOn = true; //to check if the game is on

window.addEventListener("load", () => { // on load  
   // allow_start = false;
   game = document.getElementById('container');
   rules = document.getElementById('rules');
   players = document.getElementById('players');
   end = document.getElementById('end');
   inst = document.getElementById("player-instructions");
   scores = document.getElementById('score');
   results = document.getElementById('results');

   game.style.display = "none";
   rules.style.display = "block";
   players.style.display = "none";
   end.style.display = "none";
   scores.style.display = "none";

   // Kick users out when there are more than 2 players in the game
   socket.on('morePlayers', () => {
      alert("There are 2 players in the game already! Please try again later!");
      window.location = '/map/index.html';
   })

})

let usersIn = 0;

socket.on('gameUsersInFromServer', () => {
    usersIn++;
    console.log("users in", usersIn);
    if (usersIn == 2) {
      // inst.textContent = Player2Instruction;
      socket.emit('gameCanStart', sessionStorage.getItem('room')); //start game for the rest of the users
    }
})

//function to start game
function startGame() {
   socket.emit("userClickedStart", sessionStorage.getItem('room'));
   rules.style.display = "none";
   game.style.display = "block";
   players.style.display = "block";
   scores.style.display = "block";
   turnCamOn = true;

   player1_start = true;
}

// permission to start the game
socket.on('gameCanStartDataFromServer', () => {
   console.log("two players are in");
   twoPlayers();
 })

function displayResults() {
   scores.style.display = "none";
   let end = document.getElementById('end');
   end.style.display = "block";
   let timer = document.getElementById('timer');
   timer.style.display = "none";
   let players = document.getElementById('players');
   players.style.display = "none";
   game.style.display = "none";
   rules.style.display = "none";
   let winner = document.getElementById('winner');

   //compare the order numbers to print the winner
   if (myScore > theirScore) {
      winner.innerHTML = "You won!";
   }
   else if (myScore < theirScore) {
      winner.innerHTML = "They won!";
   }
   else {
      winner.innerHTML = "It's a draw!";
   }
   results.innerHTML = 'Them: ' + theirScore + ' You: ' + myScore;
}

//to go back to home page
function goHome() {
   socket.emit('userLeft', '');
   window.location = '/map/index.html';
   sessionStorage.setItem('room', "map"); //save to session storage
}
