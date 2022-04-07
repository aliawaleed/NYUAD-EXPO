// JavaScript file for A2
// opens and connect to socket
let socket = io();
let majorList = [ "Arab Crossroads Studies",
"Art and Art History",
"Bioengineering",
"Biology",
"Business Organizations and Society",
"Chemistry",
"Civil Engineering",
"Computer Engineering",
"Computer Science",
"Economics",
"Electrical Engineering",
"Film and New Media",
"General Engineering",
"History",
"Interactive Media",
"Legal Studies",
"Literature and Creative Writing",
"Mathematics",
"Mechanical Engineering",
"Music",
"Philosophy",
"Physics",
"Psychology",
"Social Research and Public Policy",
"Theater"];

//declare Bubble Array
let majors = [];

let timeLeft = 29; //initialized at 29 as the timer takes 1 second to start

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

//function to start a 30 second timer and have it initialized on the screen
function startTimer(){
   var timer = document.getElementById('timer');
   timer.innerHTML = 'Time left: 30'; //preset before the timer starts
   
   var timerId = setInterval(countdown, 1000);
   
   function countdown() {
       if (timeLeft == -1) {
       clearTimeout(timerId);
       alert("Time is up!");
       socket.emit('finish', completed);
       } else {
       timer.innerHTML = 'Time left: ' + timeLeft;
       timeLeft--;
       }
   }
   socket.emit('start', ''); //start game for the rest of the users
}

//to ensure starting the game only once for the other users (that didn't press on the order button)
let started = 0;
socket.on('startDataFromServer', ()=>{
   if (started == 0){
       console.log("game started"); // shows how many orders the other player completed 
       startTimer();
   }
   started = 1;
})

//p5.js code
function setup() {
    let canvas = createCanvas(windowWidth/2, windowHeight*0.6);
    canvas.parent('sketch-canvas');
    noStroke();
 }
 
 //emit information of Canvas position everytime mouse moves
 function windowResized() {
    resizeCanvas(windowWidth/2, windowHeight*0.6);
  }


//When user submit, check if the written word matches any major from the list
let submitButton = document.getElementById('submit');
let majorInput = document.getElementById('name');

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


function checkMajor(){
    if (majorList.includes(majorInput.value)){
        console.log('includes major');
         // compare the first and last index of an element
         if (majors.includes(majorInput.value)){
            console.log('Existing Major')
            alert('Existing Major');
      } else {
         majors.push(majorInput.value);
         pushBubble();
        console.log(majorInput.value + 'was just added')
      }
}
};



//declare Bubble Array
let Bubbles = [];

function pushBubble() {

   Bubbles.push(new bubble(majorInput.value,width/2,height/2, random(1,2),width/5));
   console.log(Bubbles);
}


let xspeed = 1;
let yspeed =1;

class bubble {
   constructor(major,x, y,speed,din) {
        //Create Random Pastel Color
      let hue = Math.floor(Math.floor(Math.random() * 360));
let randomColor = `hsl(${hue}, 70%, 80%)`;
   //Create Random Pastel Color
      //color is randomly selected from the pastel color range
      this.randomcolor = randomColor;
      //x-position 
      this.x = x;
      //y-position 
      this.y =y;

      //
      this.m = major;
      //speed of x and y
      this.xspeed = speed;
      this.yspeed = speed;
      this.diameter = din;
   }


    //diaplsy bubble
    display() {
      noStroke();
      fill(this.randomcolor);
      //fill ellipse with random color
      //Create ellipse at the position r
      ellipse(this.x, this.y,this.diameter,this.diameter);
      fill(0);
      //write age
      textSize(this.diameter/7);
      textAlign(CENTER);
      //write name
      text(this.m,this.x,this.y);
       //radius of ellipse change according to the value of age
    }

        //Animate Bubbles
        move() {
         //When bump into wall, change direction
        if(this.x > (width-this.diameter/2)) {
          this.xspeed = this.xspeed * -1;
        }
        else if(this.x < this.diameter/2) {
          this.xspeed = this.xspeed * -1;
        }
        
        if(this.y > (height-this.diameter/2)) {
          this.yspeed = this.yspeed * -1;
        }
        else if(this.y < this.diameter/2) {
          this.yspeed = this.yspeed * -1;
        }
        
        this.x = this.x + this.xspeed;
        this.y = this.y + this.yspeed;
    
    }
}



function draw() {
   fill(49,43,61);
   rect(0,0,width,height);
   noStroke();
     //display bubbles
     for (let i = 0; i < Bubbles.length; i++) {
      let p = Bubbles[i];
      p.display();
      p.move();
    }
   }
 

  
 /* Instruction for Major Hunt */
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
