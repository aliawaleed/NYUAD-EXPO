let roomStart = 'D1'

//Instruciton Page
let Player1Instruction = "You will start with Acting"
let Player2Instruction = "You will start with Guessing"


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
  let canvas = createCanvas(windowWidth / 2, windowHeight * 0.6);
   canvas.parent('sketch-canvas');
  video = createCapture(VIDEO);
  video.hide();
  background(0);
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

function draw() {
  background(0);
  image(video, 0, 0, 320, 240);
  fill(255);
  textSize(16);
  text(label, 10, height - 10);
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

