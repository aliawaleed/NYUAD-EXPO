// opens and connect to socket
let socket = io();

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

let game = document.getElementById('main-container');
let timer = document.getElementById('timer');
let finished = document.getElementById('finished');
let rules = document.getElementById('rules');

//p5.js
let getwordButton = document.getElementById('getword-button');
let msgInput = document.getElementById('msg-input');
let sendButton = document.getElementById('send-button');
let drawing;
let timeLeft = 99;

//to track number of answers
let myCompletedWords = 0;
let completed = document.getElementById('completed-words');

let allow_start = false;
let start = false;

let inst = document.getElementById("player-instructions");

//onload start showing rules only
window.addEventListener("load", () => { // on load  
   game.style.display = "none";
   completed.style.display = "none";
   inst.style.display = "none";
   timer.style.display = "none";
   finished.style.display = "none";
   rules.style.display = "block";

   socket.on('morePlayers', () => {
      alert("There are 2 players in the game already! Please try again later!");
      window.location = '/map/index.html';
   })

   getwordButton.disabled = true;
   getwordButton.style.opacity = "0.6";
   drawing = false;
   msgInput.disabled = true;
   sendButton.style.opacity = "0.6";
   console.log('not started yet');
   inst.textContent = "Wait for Player 2 to Join!";
})

//two players are in
function twoPlayers() {
   getwordButton.disabled = false;
   getwordButton.style.opacity = "1";
   msgInput.disabled = false;
   sendButton.style.opacity = "1";
   inst.style.display = "block";
   inst.innerHTML = 'Click the Draw button to start Drawing!'; //ask players to start
   allow_start = true;
}

socket.on('C2canStartDataFromServer', () => {
   twoPlayers();
})

let usersIn = 0;

socket.on('gameUsersInFromServer', () => {
   usersIn++;
   console.log("users in", usersIn);
   if (usersIn == 2) {
      socket.emit('C2canStart', ''); //start game for the rest of the users
   }
})

//function to start game
function startGame() {
   socket.emit("userClickedStart", sessionStorage.getItem('room'));
   let rules = document.getElementById('rules');
   rules.style.display = "none";
   let game = document.getElementById('main-container');
   let timer = document.getElementById('timer');
   completed.style.display = "block";
   timer.style.display = "block";
   inst.style.display = "block";
   game.style.display = "block";
}

//function to start a 30 second timer and have it initialized on the screen
function startTimer() {
   if (allow_start == true) {
      let timer = document.getElementById('timer');
      timer.innerHTML = 'Time left: 100'; //preset before the timer starts
      socket.emit('C2start', ''); //start game for the rest of the users
   }
   else {
      alert("Please wait for another player to join!");
   }
}

//to ensure starting the game only once for the other users (that didn't press on the order button)
let started = 0;
socket.on('C2startDataFromServer', () => {
   if (allow_start == true) {
      if (started == 0) {
         console.log("game started"); // shows how many words the other player guessedcorrect
         startTimer();
         //to decrement timer
         let timerId = setInterval(countdown, 1000);

         function countdown() {
            if (timeLeft == -1) {
               clearTimeout(timerId);
               // alert("Time is up!");
               socket.emit('C2finish', myCompletedWords);
            } else {
               timer.innerHTML = 'Time Left: ' + timeLeft;
               console.log(timeLeft);
               timeLeft--;
            }
         }
      }
      started = 1;
   }
})

socket.on('C2finishDataFromServer', (theirCompletedWords) => {
   let finalScore = document.getElementById('finalScore');
   finished.style.display = "block";
   game.style.display = "none";
   rules.style.display = "none";
   let timer = document.getElementById('timer');
   timer.style.display = "none";
   completed.style.display = "none";
   let results = document.getElementById('results');
   let total = theirCompletedWords + myCompletedWords;
   finalScore.innerHTML = 'Total Points: ' + total;
})

//p5.js code
function setup() {
   let canvas = createCanvas(windowWidth / 2, windowHeight * 0.6);
   canvas.parent('sketch-canvas');
   background(255);
   socket.on('mouseDataFromServer', (data) => {
      drawWithData(data);
      inst.innerHTML = '';
   })
}

//emit information of mous position everytime mouse moves
function windowResized() {
   resizeCanvas(windowWidth / 2, windowHeight * 0.6);
   background(255);
}

//emit information of mous position everytime mouse moves
function mouseDragged() {
   let mousePos =
   {
      x: round(mouseX),
      y: round(mouseY),
      px: round(pmouseX),
      py: round(pmouseY),

   };
   if (drawing) {
      //emit htis information to the server
      socket.emit('mousePositionData', mousePos);
   };
}

function drawWithData(data) {
   stroke(0);
   strokeWeight(2);
   line(data.x, data.y, data.px, data.py);
}


/* --- Code to RECEIVE a socket message from the server --- */
let chatBox = document.getElementById('chat-box-msgs');

//this is the current drawing word
let currentword;

//Listen for messages named 'msg' from the server
socket.on('msg', function (data) {
   console.log("Message arrived!");
   console.log(data);

   //Create a message string and page element
   let receivedMsg = data.msg;
   let msgEl = document.createElement('p');
   msgEl.innerHTML = receivedMsg;

   //Add the element with the message to the page
   chatBox.appendChild(msgEl);
   //Add a bit of auto scroll for the chat box
   chatBox.scrollTop = chatBox.scrollHeight;

   //check if the answer matches the word
   if (currentword.toLowerCase() == receivedMsg.toLowerCase()) {
      let matchingdata = currentword;
      //Send detection of matchingword to the server
      socket.emit('matchingword', matchingdata);
   }
});

let drawthis = document.getElementById("draw_this");

// Listen for word named 'displayrandomword' from the server - only applied to the drawer
socket.on('displayrandomword', function (data) {
   console.log("displayrandomword arrived");
   console.log(data);

   //enabledrawing
   drawing = true;

   //Create a message string and page element
   let receiveword = data;
   currentword = receiveword;
   drawthis.innerHTML = receiveword;
   sendButton.disabled = true;
   msgInput.disabled = true;
   msgInput.style.opacity = 0.2;
   sendButton.style.opacity = 0.2;
   inst.innerHTML = 'Start Drawing Here!'; //Start drawing
   //A perosn who draws can't guess the word
});


//Listen for word named 'randomwordguess' from the server
socket.on('randomwordguess', function (data) {
   //CLEAN Canvas
   console.log("randomword arrived");
   console.log(data);
   //when a client received randomword, then the rest of the client can't access getwordButton
   getwordButton.disabled = true;
   getwordButton.style.opacity = "0.6";
   inst.innerHTML = 'Start Guessing!'; //preset before the timer starts
   msgInput.disabled = false;
   msgInput.style.opacity = 1;
   sendButton.style.opacity = 1;
   sendButton.disabled = false;
   drawing = false;
});

//Listen for word named 'matchingword' from the server
socket.on('matchingword', function (data) {
   console.log('its matching');
   //clearcanvas
   clear();
   background(255);
   //enable getwordButton again
   getwordButton.disabled = false;
   getwordButton.style.opacity = "1";
   sendButton.disabled = false;
   //Empty drawthis text
   drawthis.innerHTML = "";
   inst.innerHTML = 'If you want to draw, click draw button'; //preset before the timer starts
   inst.textContent = "Correct! Click draw button";
   drawing = false;
   sendButton.disabled = true;
   msgInput.disabled = true;
   msgInput.style.opacity = 0.2;
   sendButton.style.opacity = 0.2;
})

socket.on('scoreadd', function (data) {
   let completed = document.getElementById('completed-words');
   console.log("addscore");
   myCompletedWords++;
   getwordButton.disabled = false;
   completed.textContent = "Points: " + myCompletedWords;
});

/* --- Code to SEND a socket message to the Server --- */

//allow press ENTER to add words
msgInput.addEventListener("keyup", function (event) {
   if (event.keyCode === 13) {
      sendButton.click();
   }
});

sendButton.addEventListener('click', function () {
   let curMsg = msgInput.value;
   let msgObj = { "msg": curMsg };

   //Send the message object to the server
   socket.emit('msg', msgObj);

   //delete message typed once it is sent
   msgInput.value = "";
});

//function to disable getword-button
function disableButton() {
   document.getElementById("getword-button").disabled = true;
}

/* --- Code to SEND a received randomword to the Server --- */
getwordButton.addEventListener('click', function () {
   //CLEAN Canvas
   resizeCanvas(windowWidth / 2, windowHeight * 0.6);
   background(255);
   //Load the word.json data file 
   fetch('word.json')
      .then(response => response.json())
      .then(data => {
         console.log(data);
         //Do something with 'data'
         let wordlist = data.words;
         let randomItem = wordlist[Math.floor(Math.random() * wordlist.length)];
         console.log(randomItem);

         //send the data to update for all
         socket.emit('drawClicked', '');

         //Send the randomwordguess to the clients who will be guessing
         socket.emit('randomwordguess', randomItem);

         //Send the randomword to the client who clicked draw
         socket.emit('displayrandomword', randomItem);
      });
});

function joinRoom() {
   socket.emit('userLeft', '');
   window.location = '/map/index.html';
   sessionStorage.setItem('room', "map"); //save to session storage
}

socket.on('drawclicked', function (data) {
   console.log("drawclicked");
});
