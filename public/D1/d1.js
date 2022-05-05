let roomStart = 'D1';


let mobilenet;
let classifier;
let video;
let label = 'loading model';
//let none;
// let sunRedButton;
// let mosqueBlueButton;
// let palmBlackButton;
// let cactusGreenButton;
// let duneYellowButton;
// let saveButton;
// let trainButton;

 let cards = [];
// let red = [];
// let blue = [];
// let green = [];
// let black = [];

let index;
// let indexR;
// let indexB;
// let indexG;
// let indexBl;

function preload(){
  for (let i = 1; i < 6; i++) {
    cards[i] = loadImage("images/"+ i + ".png");
  }
	// //create an array of dog image file names
	// yellow = [
	// 	"images/yellow/cactus.png",
  //   "images/yellow/dune.png", 
  //   "images/yellow/mosque.png", 
  //   "images/yellow/palm.png", 
  //   "images/yellow/sun.png"
  //   ];

  //  red = [
  //     "images/red/cactus.png",
  //     "images/red/dune.png", 
  //     "images/red/mosque.png", 
  //     "images/red/palm.png", 
  //     "images/red/sun.png"
  //     ];

  //     blue = [
  //       "images/blue/cactus.png",
  //       "images/blue/dune.png", 
  //       "images/blue/mosque.png", 
  //       "images/blue/palm.png", 
  //       "images/blue/sun.png"
  //       ];

  //       green = [
  //         "images/green/cactus.png",
  //         "images/green/dune.png", 
  //         "images/green/mosque.png", 
  //         "images/green/palm.png", 
  //         "images/green/sun.png"
  //         ];

  //         black = [
  //           "images/black/cactus.png",
  //           "images/black/dune.png", 
  //           "images/black/mosque.png", 
  //           "images/black/palm.png", 
  //           "images/black/sun.png"
  //           ];
}

//emit information of mous position everytime mouse moves
function windowResized() {
  resizeCanvas(windowWidth*0.8, windowWidth * 0.4);
  background(210,209,252);
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
  background(210,209,252);
  mobilenet = ml5.featureExtractor('MobileNet', modelReady);
  classifier = mobilenet.classification(video, { numLabels: 7 }, videoReady); //set numLabels to number expected or length of array

//     noneButton = createButton('none');
//    noneButton.mousePressed(function() {
//     classifier.addImage('none');
//   });
  
//   sunRedButton = createButton('sun');
//    sunRedButton.mousePressed(function() {
//     classifier.addImage('sun');
//   });

//   mosqueBlueButton =  createButton('mosque');
// mosqueBlueButton.mousePressed(function() {
//     classifier.addImage('mosque');
//   });
  
//       palmBlackButton = createButton('palm');
//   palmBlackButton.mousePressed(function() {
//       classifier.addImage('palm');
//   });

//         cactusGreenButton = createButton('cactus');
//  cactusGreenButton.mousePressed(function() {
//       classifier.addImage('cactus');
//   });
  
//           duneYellowButton = createButton('dune');
//   duneYellowButton.mousePressed(function() {
//       classifier.addImage('dune');
//   });
  
//   trainButton = createButton('train');
//   trainButton.mousePressed(function() {
//     classifier.train(whileTraining);
//   });
  

//   saveButton = createButton('save');
//   saveButton.mousePressed(function() {
//     classifier.save();
//   });
}

let showScenarios = true;

function scenarios(){
  text("Scenarios", windowWidth*0.5, height - 10);
}

function startTimer(){

  index = int(random(1,5));
  //dice throw
  image(cards[index], windowWidth*0.425, windowWidth*0.025, windowWidth*0.35, windowWidth * 0.35);
  // image(red[indexR], windowWidth*0.65, windowWidth*0.05, windowWidth*0.1, windowWidth * 0.1);
  // image(green[indexG], windowWidth*0.55, windowWidth*0.15, windowWidth*0.1, windowWidth*0.1);
  // image(blue[indexB], windowWidth*0.45, windowWidth*0.25, windowWidth*0.1, windowWidth * 0.1);
  // image(black[indexBl], windowWidth*0.65, windowWidth*0.25, windowWidth*0.1, windowWidth * 0.1);

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



};

function draw() {
  //video capture
  image(video, 0, 0, windowWidth*0.4, windowWidth * 0.4);
  textSize(16);
  text(label, 10, height - 10);

  if (showScenarios = true){
    scenarios();

  }

}

// function whileTraining(loss) {
//   if (loss == null) {
//     console.log('Training Complete');
//     classifier.classify(gotResults);
//   } else {
//     console.log(loss);
//   }
// }

function gotResults(error, result) {
  if (error) {
    console.error(error);
  } else {
    // updated to work with newer version of ml5
    // label = result;
    label = result[0].label;
    classifier.classify(gotResults);
  }
}

