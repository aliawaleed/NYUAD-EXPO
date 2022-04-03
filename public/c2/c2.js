// opens and connect to socket
let socket = io();

//p5 variables
let r,g,b;

//listen for confirmation
socket.on('connect', () => {
    console.log("client connected via sockets");

})

//p5.js code
function setup() {
   let canvas = createCanvas(windowWidth/2, windowWidth/2);
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
   resizeCanvas(windowWidth/2, windowWidth/2);
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

//Listen for word named 'displayrandomword' from the server
socket.on('displayrandomword', function (data) {
   console.log("displayrandomword arrived");
   console.log(data);

   //Create a message string and page element
   let receiveword = data;
   currentword = receiveword;
   drawthis.innerHTML = receiveword;
});

//Listen for word named 'randomword' from the server
socket.on('randomword', function (data) {
   console.log("randomword arrived");
   console.log(data);
   //when a client received randomword, then the rest of the client can't access getwordButton
   getwordButton.disabled = true;
});


//Listen for word named 'matchingword' from the server
socket.on('matchingword',function(data){
   console.log('its matching');

   //enable getwordButton again
   getwordButton.disabled = false;
   //CLEAN Canvas
   resizeCanvas(windowWidth/2, windowWidth/2);
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
       resizeCanvas(windowWidth/2, windowWidth/2);
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
   socket.emit('randomword', randomItem);

   //Send the randomword to the server to be displayed by specific client
   socket.emit('displayrandomword', randomItem);
});
});