let socket = io();

//listen for confirmation of socket; confirms that the client is connected
socket.on('connect', () => {
   console.log("client connected via sockets");
   // now that client has connected to server, emit name and room information
   let data = {
      'name': sessionStorage.getItem('name'),
      'room': sessionStorage.getItem('room'),
      'color': color,
   }
   socket.emit('userData', data);
})

let majorList = ["arab crossroads studies", "art and art history", "bioengineering", "biology", "business organizations and society", "chemistry", "civil engineering", "computer engineering", "computer science", "economics", "electrical engineering", "film and new media", "general engineering", "history", "interactive media", "legal studies", "literature and creative writing", "mathematics", "mechanical engineering", "music", "philosophy", "physics", "psychology", "social research and public policy", "theater"];
//declare Bubble Array
let majors = [];


let game = document.getElementById('main-container');
let finished = document.getElementById('finished');
let rules = document.getElementById('rules');
let timer = document.getElementById('timer');

//When user submit, check if the written word matches any major from the list
let submitButton = document.getElementById('submit');
let majorInput = document.getElementById('name');
let players = document.getElementById('players');
let timeLeft = 59;

let myScore = 0; //to track number of correct majors guessed
let theirScore = 0;
let completed = document.getElementById('completed-orders');
let color;

let allow_start = false;
let start = false;

//for bubble color
let red = Math.floor(Math.random() * 256);
let green = Math.floor(Math.random() * 256);
let blue = Math.floor(Math.random() * 256);


//onload start showing rules only
window.addEventListener("load", () => { // on load  
   game.style.display = "none";
   timer.style.display = "none";
   completed.style.display = "none";
   finished.style.display = "none";
   rules.style.display = "block";
   players.style.display = "none";

   socket.on('morePlayers', () => {
      alert("There are 2 players in the game already! Please try again later!");
      window.location = '/map/index.html';
   })

   majorInput.disabled = true;
   submitButton.style.opacity = "0.6";
   console.log('not started yet');
   players.textContent = "You are player 1! Wait for Player 2 to Join!";
})

//function to disable game until 2 players are in
function onePlayer() {
   majorInput.disabled = true;
   submitButton.style.opacity = "0.6";
   console.log('not started yet');
}


//two players are in
function twoPlayers() {
   majorInput.disabled = false;
   submitButton.style.opacity = "1";
   players.textContent = " Start adding majors and press submit!";
   allow_start = true;
   completed.innerHTML =  'Them: ' + theirScore + ' You: ' + myScore;
}

socket.on('A2canStartDataFromServer', () => {
   twoPlayers();
})

let usersIn = 0;

socket.on('gameUsersInFromServer', () => {
   usersIn++;
   console.log("users in", usersIn);
   if (usersIn == 2) {
      socket.emit('A2canStart', ''); //start game for the rest of the users
   }
})


//function to start game
function startGame() {
   socket.emit("userClickedStart", sessionStorage.getItem('room'));
   let rules = document.getElementById('rules');
   rules.style.display = "none";
   let game = document.getElementById('main-container');
   let timer = document.getElementById('timer');
   timer.style.display = "block";
   game.style.display = "block";
   completed.style.display = "block";
   players.style.display = "block";
}

//function to start a 60 second timer and have it initialized on the screen
function startTimer() {
   if (allow_start == true) {
      let timer = document.getElementById('timer');
      timer.innerHTML = 'Time left: 60'; //preset before the timer starts
      socket.emit('A2start', ''); //start game for the rest of the users
   }
   else {
      alert("Please wait for another player to join!");
   }
}

//to ensure starting the game only once for the other users (that didn't press on the order button)
let started = 0;

socket.on('A2startDataFromServer', () => {
   if (allow_start == true) {
      if (started == 0) {
         players.style.display = "none";
         console.log("game started"); // shows how many orders the other player completed 
         startTimer();
         //to decrement timer
         let timerId = setInterval(countdown, 1000);
   
         function countdown() {
            if (timeLeft == -1) {
               clearTimeout(timerId);
               // alert("Time is up!");
               socket.emit('A2finish', myScore);
            } else {
               timer.innerHTML = 'Time Left: ' + timeLeft;
               timeLeft--;
            }
         }
      }
      started = 1;
   }
})

socket.on('A2finishDataFromServer', (theirCompletedColors) => {
   let finalScore = document.getElementById('finalScore');
   finalScore.innerHTML = 'Them: ' + theirCompletedColors + ' You: ' + myScore;
   game.style.display = "none";
   finished.style.display = "block";
   rules.style.display = "none";
});

//p5.js code
function setup() {
   let canvas = createCanvas(windowWidth / 2, windowHeight * 0.6);
   canvas.parent('sketch-canvas');
   noStroke();
   color = floor(random(0, 1));
}

//emit information of Canvas position everytime mouse moves
function windowResized() {
   resizeCanvas(windowWidth / 2, windowHeight * 0.6);
}

//allow press ENTER to add words
majorInput.addEventListener("keyup", function (event) {
   if (event.keyCode === 13) {
      submitButton.click();
   }
});

submitButton.addEventListener('click', function () {

   //Effor alert: If there is no entry for name show alert
   if (majorInput.value.length == 0) {
      alert('Type in the major');
   } else {
      checkMajor();
      console.log(majorInput.value);
   }

   //empty input section after submission 
   document.querySelector("#name").value = "";
});

function checkMajor() {
   let majorCheck;
   majorCheck = majorInput.value
   if (majorList.includes(majorCheck.toLowerCase())) {
      console.log('includes major');
      // compare the first and last index of an element
      if (majors.includes(majorCheck.toLowerCase())) {
         console.log('Existing Major')
         alert('Existing Major');
      } else {
         //send the color
         let data = {
            major: majorInput.value,
            red: red,
            green: green,
            blue: blue
         }

         socket.emit('majoradd', data);
         // socket.emit('color', data);
      }
   }
   else {
      alert("Try again!");
   }
};


socket.on('colorFromServer', (dataColor) => {
   console.log('received color' + dataColor);
})

socket.on('majoradd', (data) => {
   majors.push(data.major);
   console.log(data + 'was just added')
   console.log(majors)
   currentMajor = data.major;
   currentR = data.red;
   currentG = data.green;
   currentB = data.blue;
   console.log(currentMajor);
   console.log(currentR);
   pushBubble();
})


// permission to start the game
socket.on('scoreadd', (data) => {
   console.log('addscore');
   myScore++;
   completed.innerHTML =  'Them: ' + theirScore + ' You: ' + myScore;
 })
 
 // permission to start the game
 socket.on('theirscoreadd', () => {
   console.log('theirscoreadd');
   theirScore++;
   completed.innerHTML =  'Them: ' + theirScore + ' You: ' + myScore;
 })
 

//declare Bubble Array
let Bubbles = [];

function pushBubble() {

   Bubbles.push(new bubble(currentMajor, width / 2, height / 2, random(1, 2), width / 5, currentR, currentG, currentB));
   console.log(Bubbles);
}


let xspeed = 1;
let yspeed = 1;


function joinRoom() {
   socket.emit('userLeft', '');
   window.location = '/map/index.html';
   sessionStorage.setItem('room', "map"); //save to session storage
}

function draw() {
   fill(255);
   rect(0, 0, width, height);
   noStroke();
   //display bubbles
   for (let i = 0; i < Bubbles.length; i++) {
      let p = Bubbles[i];
      p.display();
      p.move();
   }
}