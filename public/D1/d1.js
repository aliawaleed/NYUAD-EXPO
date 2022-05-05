let roomStart = 'D1';

let Player1Instruction = "instructions 1";
let Player2Instruction = "instructions 2";

//HTML elements
let scenarios; 
let pick;

//ml5 model trainning related
let mobilenet;
let classifier;
let video;
let label = 'loading model';

//random card selection 
let cards = [];
let index;

function preload(){
  for (let i = 1; i < 6; i++) {
    cards[i] = loadImage("images/"+ i + ".png");
  }
}

window.addEventListener("load", () => {
  scenarios = document.getElementById('scenarios');
  pick = document.getElementById('getword-button');

  allow_start = false;
  pick.style.opacity = "0.6";
  pick.disabled = true;


});


//emit information of mous position everytime mouse moves
function windowResized() {
  resizeCanvas(windowWidth*0.8, windowWidth * 0.4);
  background(255);
}


function modelReady() {
  console.log('Model is ready!!!');
}

function customModelReady() {
  console.log('Custom Model is ready!!!');
  label = 'model ready';
  classifier.classify(gotResults);
}

function videoReady() {
  console.log('Video is ready!!!');
  classifier.load('model.json', customModelReady);
}

function setup() {
  let canvas = createCanvas(windowWidth*0.8, windowWidth * 0.4);
  canvas.parent('sketch-canvas');
  video = createCapture(VIDEO);
  video.hide();
  background(255);
  mobilenet = ml5.featureExtractor('MobileNet', modelReady);
  classifier = mobilenet.classification(video, { numLabels: 7 }, videoReady); //set numLabels to number expected or length of array
}

//two players are in
function twoPlayers() {
  pick.style.opacity = "1";
  pick.disabled = false;
  //players.innerHTML = playersInstructions;
}

//function to start a 30 second timer and have it initialized on the screen
function startTimer() {
  if (allow_start == true) {
      socket.emit('dormStart', ''); //start game for the rest of the users
      let timer = document.getElementById('timer');
      timer.innerHTML = 'Time left: 60'; //preset before the timer starts
      printItems();
  }
  else {
      alert("Please wait for another player to join!");
  }
}

function emitCanStart() {
  socket.emit('d1CanStart', ''); //start game for the rest of the users
}

// permission to start the game
socket.on('d1CanStartDataFromServer', () => {
  console.log("two players are in");
  twoPlayers();
})


function startTimer(){

  if(allow_start == true) {
  scenarios.style.display = "none";
  index = int(random(1,5));
  //dice throw
  image(cards[index], windowWidth*0.425, windowWidth*0.025, windowWidth*0.35, windowWidth * 0.35);


  if (index == 1){
    console.log("palm");
  } else if(index == 2){
    console.log("sun");
  } else if(index == 3){
    console.log("mosque");
  } else if(index == 4){
    console.log("mosque");
  } else if(index == 5){
    console.log("dune");
  } else if(index == 6){
    console.log("dune");
  } 
}
  else {
    alert("Please wait for another player to join!");
}

};



function draw() {
  //video capture
  image(video, 0, 0, windowWidth*0.4, windowWidth * 0.4);
  textSize(16);
  text(label, 10, height - 10);

}


function gotResults(error, result) {

  classifier.classify(gotResults);
  if(result[0].confidence > 0.98) {
    label = result[0].label;
    console.log[label];
  }
}

