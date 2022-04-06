// opens and connect to socket
let socket = io();

//p5 variables
let r,g,b;

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


/* Instruction for Pictionary */
socket.on('player1', () => {
   player1 = "Hello player 1! Please wait for another player to join!";
   let inst = document.getElementById('instructions');
   inst.textContent = player1;
})

socket.on('player2', (player2) => {
   player2 = "Hello player 2! Start Guessing what the other player is drawing";
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
   inst.textContent = "Another player has joined. Click Pick Button to Receive the word ";
})


//p5.js code
function setup() {
   let canvas = createCanvas(windowWidth/2, windowHeight*0.6);
   canvas.parent('sketch-canvas');
   background(255);
   r = random(0,255);
   g = random(0,255);
   b = random(0,255);
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
       red:r,
       blue:b,
       green:g,
   };

   //emit htis information to the server
   socket.emit('mousePositionData',mousePos);
}

function drawWithData(data) {

   stroke(data.red,data.green,data.blue);
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

   //Create a message string and page element
   let receiveword = data;
   currentword = receiveword;
   drawthis.innerHTML = receiveword;

   //A perosn who draws can't guess the word
   sendButton.disabled = true;
   msgInput.disabled =true;
   sendButtonDisabled();
});

//disable Send Button 
function sendButtonDisabled(){
   document.getElementById("chat-input").className = "chat-input-opacity";
}

//Listen for word named 'randomwordguess' from the server
socket.on('randomwordguess', function (data) {
   console.log("randomword arrived");
   console.log(data);
   //when a client received randomword, then the rest of the client can't access getwordButton
   getwordButton.disabled = true;
   sendButton.disabled = false;
});


//Listen for word named 'matchingword' from the server
socket.on('matchingword',function(data){
   console.log('its matching');

   //enable getwordButton again
   getwordButton.disabled = false;
   sendButton.disabled = false;
   //CLEAN Canvas
   resizeCanvas(windowWidth/2, windowHeignt/0.6);
   background(255);
   //Empty drawthis text
   drawthis.innerHTML = "";
   //alert correct answer
   alert ("Correct Answer!");  
})


/* --- Code to SEND a socket message to the Server --- */
let msgInput = document.getElementById('msg-input');
let sendButton = document.getElementById('send-button');

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
let getwordButton = document.getElementById('getword-button');
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

   //Send the randomword to the server to be sent to all clients
   socket.emit('randomwordguess', randomItem);

   //Send the randomword to the server to be displayed by specific client
   socket.emit('displayrandomword', randomItem);
});
});