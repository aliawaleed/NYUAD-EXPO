let socket = io();
let majorList = [ "Arab Crossroads Studies","Art and Art History","Bioengineering","Biology","Business Organizations and Society","Chemistry","Civil Engineering","Computer Engineering","Computer Science","Economics","Electrical Engineering","Film and New Media","General Engineering","History","Interactive Media","Legal Studies","Literature and Creative Writing","Mathematics","Mechanical Engineering","Music","Philosophy","Physics","Psychology","Social Research and Public Policy","Theater"];

let game = document.getElementById('gamePage');
let finished = document.getElementById('finished');
let rules = document.getElementById('rules');

//When user submit, check if the written word matches any major from the list
let submitButton = document.getElementById('submit');
let majorInput = document.getElementById('name');
let players = document.getElementById('players');

//declare Bubble Array
let majors = [];

let timeLeft =10;
let myCompletedOrders =0; //to track number of correct completed orders
let completed = document.getElementById('completed-orders');
let color;

//listen for confirmation of socket; confirms that the client is connected
socket.on('connect', () => {
   console.log("client connected via sockets");
   // now that client has connected to server, emit name and room information
   let data = {
       'name' : sessionStorage.getItem('name'),
       'room' : sessionStorage.getItem('room'),
       'color': color,
   }
   socket.emit('userData', data);
})


//onload start showing rules only
window.addEventListener("load", () => { // on load  
   game.style.display = "none";
   finished.style.display = "none";
   rules.style.display = "block";


   socket.on('player1',()=>{
      console.log('wait for another player to join');
      let players = document.getElementById('players');
      players.innerHTML = 'wait for another player to join'; //preset before the timer starts
      onePlayer();
   })

   socket.on('message',()=>{
      let players = document.getElementById('players');
      players.innerHTML = 'Type in a major to begin'; //preset before the timer starts
      twoPlayers();
   })

})


//function to start game
function startGame(){
   let rules = document.getElementById('rules');
   rules.style.display = "none";
   let game = document.getElementById('gamePage');
   game.style.display = "block";
}

//function to disable game until 2 players are in
function onePlayer(){
   drawing = false;
   majorInput.disabled =true;
   submitButton.style.opacity = "0.6";
}

//two players are in
function twoPlayers(){
   majorInput.disabled =false;
   submitButton.style.opacity = "1";
}


//function to start a 30 second timer and have it initialized on the screen
function startTimer(){
   let timer = document.getElementById('timer');
   timer.innerHTML = 'Time left: 60'; //preset before the timer starts
   socket.emit('A2start', ''); //start game for the rest of the users
}

//to ensure starting the game only once for the other users (that didn't press on the order button)
let started = 0;

socket.on('A2startDataFromServer', ()=>{
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
               socket.emit('A2finish', myCompletedOrders);
           } else {
               timer.innerHTML = 'Time Left: ' + timeLeft;
               console.log(timeLeft);
               timeLeft--;
           }
       }
   }
   started = 1;
})

socket.on('A2finishDataFromServer', (theirCompletedOrders)=>{
   let finalScore = document.getElementById('finalScore');
   finalScore.innerHTML = 'Them: ' + theirCompletedOrders + ' You: ' + myCompletedOrders;  
   game.style.display = "none";
   finished.style.display = "block";
   rules.style.display = "none";
});

//p5.js code
function setup() {
    let canvas = createCanvas(windowWidth/2, windowHeight*0.6);
    canvas.parent('sketch-canvas');
    noStroke();
    color= floor(random(0,1));
 }
 
 //emit information of Canvas position everytime mouse moves
 function windowResized() {
    resizeCanvas(windowWidth/2, windowHeight*0.6);
  }

  //allow press ENTER to add words
majorInput.addEventListener("keyup", function(event) {
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


function checkMajor(){
    if (majorList.includes(majorInput.value)){
        console.log('includes major');
         // compare the first and last index of an element
         if (majors.includes(majorInput.value)){
            console.log('Existing Major')
            alert('Existing Major');
      } else {
         socket.emit('majoradd',majorInput.value);


      }
}
};

let currentMajor;

socket.on('majoradd',(data)=> {
majors.push(data);
console.log(data + 'was just added')
console.log(majors)
currentMajor = data;
console.log(currentMajor);
pushBubble();
})

socket.on('scoreadd',(data)=> {
   console.log(myCompletedOrders);
   myCompletedOrders++;
   completed.textContent = "Points: " + myCompletedOrders;
})

//declare Bubble Array
let Bubbles = [];

function pushBubble() {

   Bubbles.push(new bubble(currentMajor,width/2,height/2, random(1,2),width/5));
   console.log(Bubbles);
}


let xspeed = 1;
let yspeed =1;

class bubble {
   constructor(major,x, y,speed,din) {
        //Create Random Pastel Color
     // let hue = Math.floor(Math.floor(Math.random() * 360));
      //let randomColor;
   //Create Random Pastel Color
      //color is randomly selected from the pastel color range
     // this.randomcolor = randomColor;
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
      fill(10);
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

function joinRoom() {
   window.location = '/';
}

function draw() {
   fill(255);
   rect(0,0,width,height);
   noStroke();
     //display bubbles
     for (let i = 0; i < Bubbles.length; i++) {
      let p = Bubbles[i];
      p.display();
      p.move();
    }
   }
 

