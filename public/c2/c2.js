// opens and connect to socket
let socket = io();

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

let game = document.getElementById('gamePage');
let finished = document.getElementById('finished');
let rules = document.getElementById('rules');

//p5.js
let getwordButton = document.getElementById('getword-button');
let msgInput = document.getElementById('msg-input');
let sendButton = document.getElementById('send-button');
let drawing;
let timeLeft =30;

//to track number of answers
let myCompletedOrders =0; 
let completed = document.getElementById('completed-orders');

let allow_start = false;
let start = false;

//show player status
let players = document.getElementById('players');


//onload start showing rules only
window.addEventListener("load", () => { // on load  
   game.style.display = "none";
   finished.style.display = "none";
   rules.style.display = "block";


   socket.on('player1',()=>{
      console.log('wait for another player to join');
      onePlayer();
   })

   socket.on('player2Start',()=>{
      players.innerHTML = 'Press on the ORDER button to begin! '; //preset before the timer starts
      twoPlayers();
   })

  
   socket.on('morePlayers',()=>{
      alert("There are 2 players in the game already! Please try again later!");
      window.location = '/map/index.html';
  })
  })

  //function to disable game until 2 players are in
function onePlayer(){
   getwordButton.disabled = true;
   getwordButton.style.opacity = "0.6";
   drawing = false;
   msgInput.disabled =true;
   sendButton.style.opacity = "0.6";
   console.log('not started yet');
}

 //two players are in
 function twoPlayers(){
   getwordButton.disabled = false;
   getwordButton.style.opacity = "1";
   msgInput.disabled =false;
   sendButton.style.opacity = "1";
   allow_start = true;
}

//function to start game
function startGame(){
   let rules = document.getElementById('rules');
   rules.style.display = "none";
   let game = document.getElementById('gamePage');
   game.style.display = "block";
}

//function to start a 30 second timer and have it initialized on the screen
function startTimer(){
   if (allow_start == true) {
       let timer = document.getElementById('timer');
       timer.innerHTML = 'Time left: 30'; //preset before the timer starts
       socket.emit('C2start', ''); //start game for the rest of the users
   } 
   else{
       alert("Please wait for another player to join!");
   }
}

//to ensure starting the game only once for the other users (that didn't press on the order button)
let started = 0;
socket.on('C2startDataFromServer', ()=>{
   if (started == 0){
      players.style.display = "none";
       console.log("game started"); // shows how many orders the other player completed  
       startTimer();
       //to decrement timer
       let timerId = setInterval(countdown, 1000);
       
       function countdown() {
           if (timeLeft == -1) {
               clearTimeout(timerId);
               // alert("Time is up!");
               socket.emit('C2finish', myCompletedOrders);
           } else {
               timer.innerHTML = 'Time Left: ' + timeLeft;
               console.log(timeLeft);
               timeLeft--;
           }
       }
   }
   started = 1;
})

socket.on('C2finishDataFromServer', (theirCompletedOrders)=>{
   let finalScore = document.getElementById('finalScore');
   finished.style.display = "block";  
   game.style.display = "none";
   rules.style.display = "none";
   let results = document.getElementById('results');
   finalScore.innerHTML = 'Them: ' + theirCompletedOrders + ' You: ' + myCompletedOrders;  
})

//p5.js code
function setup() {
   let canvas = createCanvas(windowWidth/2, windowHeight*0.6);
   canvas.parent('sketch-canvas');
   background(255);
   socket.on('mouseDataFromServer', (data)=>{
   drawWithData(data);
   })
}

//emit information of mous position everytime mouse moves
function windowResized() {
   resizeCanvas(windowWidth/2, windowHeight*0.6);
   background(255);
 }

//emit information of mous position everytime mouse moves
function mouseDragged() {
   let mousePos = 
   {   x:round(mouseX), 
       y:round(mouseY),
       px:round(pmouseX),
       py:round(pmouseY),

   };
   if (drawing){
   //emit htis information to the server
   socket.emit('mousePositionData',mousePos);
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

   //check if the answer matches the word
   if(currentword == receivedMsg){
   let matchingdata = currentword;
   //Send detection of matchingword to the server
   socket.emit('matchingword', matchingdata);

   } else {
       console.log('continue guessing');
   }

   //Add the element with the message to the page
   chatBox.appendChild(msgEl);
   //Add a bit of auto scroll for the chat box
   chatBox.scrollTop = chatBox.scrollHeight;
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

   //A perosn who draws can't guess the word
   sendButton.disabled = true;
   msgInput.disabled =true;
});


//Listen for word named 'randomwordguess' from the server
socket.on('randomwordguess', function (data) {
   //CLEAN Canvas
   console.log("randomword arrived");
   console.log(data);
   //when a client received randomword, then the rest of the client can't access getwordButton
   getwordButton.disabled = true;
   msgInput.disabled =false;
   sendButton.disabled = false;
   drawing = false;
});

//Listen for word named 'matchingword' from the server
socket.on('matchingword',function(data){
   console.log('its matching');
   //clearcanvas
   clear();
   background(255);
   //enable getwordButton again
   getwordButton.disabled = false;
   sendButton.disabled = false;
   //Empty drawthis text
   drawthis.innerHTML = "";
})

socket.on('scoreadd',function(data){
   let completed = document.getElementById('completed-orders');
   console.log("addscore");
   myCompletedOrders++;
   completed.textContent = "Points: " + myCompletedOrders;
});

/* --- Code to SEND a socket message to the Server --- */

//allow press ENTER to add words
msgInput.addEventListener("keyup", function(event) {
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
resizeCanvas(windowWidth/2, windowHeight*0.6);
background(255);
//Load the word.json data file 
 fetch('word.json')
 .then(response => response.json())
 .then(data => {
   console.log(data);
   //Do something with 'data'
   let wordlist = data.words;
   let randomItem = wordlist[Math.floor(Math.random()*wordlist.length)];
   console.log(randomItem);

   //send the data to update for all
   socket.emit ('drawClicked','');

   //Send the randomwordguess to the clients who will be guessing
   socket.emit('randomwordguess', randomItem);

   //Send the randomword to the client who clicked draW
   socket.emit('displayrandomword', randomItem);


});
});