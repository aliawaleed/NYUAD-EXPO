// JavaScript file for A2
// opens and connect to socket
let socket = io();
let majorList = [ "Arab Crossroads Studies","Art and Art History","Bioengineering","Biology","Business Organizations and Society","Chemistry","Civil Engineering","Computer Engineering","Computer Science","Economics","Electrical Engineering","Film and New Media","General Engineering","History","Interactive Media","Legal Studies","Literature and Creative Writing","Mathematics","Mechanical Engineering","Music","Philosophy","Physics","Psychology","Social Research and Public Policy","Theater"];
//declare Bubble Array
let majors = [];

let timeLeft = 119; //initialized at 29 as the timer takes 1 second to start

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
   timer.innerHTML = 'Time left: 120'; //preset before the timer starts
   var timerId = setInterval(countdown, 1000);
   
   function countdown() {
       if (timeLeft == -1) {
       clearTimeout(timerId);
       alert("Time is up!");
       socket.emit('A2TimerFinish', completed);
       } else {
       timer.innerHTML = 'Time left: ' + timeLeft;
       timeLeft--;
       }
   }
   socket.emit('A2TimerStart', ''); //start game for 
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
 

