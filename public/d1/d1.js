let Player1Instruction = "Wait for Another Player to join";
let Player2Instruction = "You can Start Now. Click Pick";

//HTML elements
let scenarios;
let pick;
let rectangle;
let startButton;
let downlaodButton;

//ml5 model trainning related
let mobilenet;
let classifier;
let video;
let label = 'loading model';

//random card selection 
let cards = [];
let index;
let current = -1;
let timeLeft = 89;
let timer;

//card and label
let thiscard;

//score
let myScore = 0;
let theirScore = 0;


function preload() {
  for (let i = 1; i < 6; i++) {
    cards[i] = loadImage("images/" + i + ".png");
  }
}

window.addEventListener("load", () => { 
  scenarios = document.getElementById('scenarios');
  startButton = document.getElementById('start-button');
  downloadButton = document.getElementById('download-button');
  pick = document.getElementById('getword-button');
  timer = document.getElementById('timer');
  rectangle = document.getElementById('rectangle'); 

  allow_start = false;
  pick.style.opacity = "0.6";
  pick.disabled = true;
  inst.textContent = Player1Instruction;

  pick.addEventListener('click', function() {
    //dice throw
    index = Math.floor(Math.random() * 5) + 1;
    while (index == current) {
      index = Math.floor(Math.random() * 5) + 1;
    }
    current = index;
    socket.emit('index', index);
  });
});


//emit information of mous position everytime mouse moves
function windowResized() {
  resizeCanvas(windowWidth * 0.8, windowWidth * 0.4);
  background(255);
  image(cards[index], windowWidth * 0.425, windowWidth * 0.025, windowWidth * 0.35, windowWidth * 0.35);
}

//to ensure starting the game only once for the other users (that didn't press on the order button)
let started = 0;
socket.on('d1StartTimerFromServer', () => {
  if (started == 0) {
    decrementTimerForAll();
    timer.innerHTML = 'Time left: 90'; //preset before the timer starts
  }
  started = 1; // so that the timer does not start again 
})

function decrementTimerForAll() {
  startTimer();
  //to decrement timer
  let timerId = setInterval(decrementTimer, 1000);

  function decrementTimer() {
    //if timer is up
    if (timeLeft == -1) {
      clearTimeout(timerId);
      socket.emit('d1End', "");
    } else {
      timer.innerHTML = 'Time left: ' + timeLeft;
      timeLeft--; //decrement the time
    }
  }
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
  let canvas = createCanvas(windowWidth * 0.8, windowWidth * 0.4);
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
  allow_start = true;
  let score = document.getElementById('score');
  score.innerHTML = 'My score:' + myScore + '| Their score:' + theirScore;
  inst.textContent = Player2Instruction;
}


function startTimer() {
  if (allow_start == true) {
    inst.textContent = '';
    socket.emit('d1Start', ''); //start game for the rest of the users
  }
  else {
    alert("Please wait for another player to join!");
  }

};


function popup() {
  rules.style.display = "block";
  downloadButton.style.opacity = "0";
  downloadButton.disabled = true;
  startButton.style.opacity = "0";
  startButton.disabled = true;
}

function popout() {
  rules.style.display = "none";
}



socket.on('indexFromServer', (num) => {
  pick.style.opacity = "0";
  pick.disabled = true;
  rectangle.style.opacity = "0";
  console.log(index);
  index = num;
  image(cards[index], windowWidth * 0.425, windowWidth * 0.025, windowWidth * 0.35, windowWidth * 0.35);

  if (index == 1) {
    console.log("new deck palm");
    thiscard = "palm"

  } else if (index == 2) {
    console.log("new deck sun");
    thiscard = "mosque"
  } else if (index == 3) {
    console.log("new deck mosque");
    thiscard = "palm"
  } else if (index == 4) {
    console.log("new deck mosque");
    thiscard = "mosque"
  } else if (index == 5) {
    console.log("new deck dune");
    thiscard = "dune"
  } else if (index == 6) {
    console.log("new deck dune");
    thiscard = "palm"
  }
})

function draw() {
  //video capture
  image(video, 0, 0, windowWidth * 0.4, windowWidth * 0.4);
  //text(label, 10, height - 10);
}

let thislabel;

function gotResults(error, result) {

  classifier.classify(gotResults);
  if (result[0].confidence > 0.98) {
    label = result[0].label;
    console.log[label];
    thislabel = label;
    checkMatch();

  }
}


function checkMatch() {
  if (thislabel == thiscard) {
    console.log('match');
    thiscard = 'none';
    console.log('match2');
    socket.emit('correct', '');
  }
}


// permission to start the game
socket.on('correctFromServer', () => {
  console.log('correctforeveryone');

  pick.style.opacity = "1";
  pick.disabled = false;
  rectangle.style.opacity = "1";

})

// permission to start the game
socket.on('d1scoreadd', () => {
  console.log('addscore');
  myScore++;
  score.innerHTML = 'My score:' + myScore + '| Their score:' + theirScore;
  inst.innerHTML = "You Got it Correct. Click Pick!";
})

// permission to start the game
socket.on('theirscoreadd', () => {
  console.log('theirscoreadd');
  theirScore++;
  score.innerHTML = 'My score:' + myScore + '| Their score:' + theirScore;
  inst.textContent = "They Got it Correct. Click Pick!";
})



// when the game ends and the server the other user
socket.on('d1EndFromServer', () => {
  displayResults();
})