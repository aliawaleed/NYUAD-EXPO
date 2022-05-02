let roomStart = 'D1'

//Instruciton Page
let Player1Instruction = "You will start with Acting"
let Player2Instruction = "You will start with Guessing"

// Initialize the Image Classifier method with MobileNet. A callback needs to be passed.
let classifier;

// A variable to hold the image we want to classify
let img;
let img2;
let img3;

function preload() {
    classifier = ml5.imageClassifier('MobileNet');
    img = loadImage('images/palm.jpg');
    img2 = loadImage('images/palm2.jpg');
    img3 = loadImage('images/acai.jpg');
}


function setup() {
    let canvas = createCanvas(windowWidth / 2, windowHeight * 0.6);
    canvas.parent('sketch-canvas');
    classifier.classify(img, gotResult);
    classifier.classify(img2, gotResult);
    classifier.classify(img3, gotResult);
    image(img, 0, 0,300,300);
    image(img2, 300, 300,300,300);
    image(img3, 0, 300,300,300);
}

// A function to run when we get any errors and the results
function gotResult(error, results) {
    // Display error in the console
    if (error) {
      console.error(error);
    } else {
      // The results are in an array ordered by confidence.
      console.log(results);
      createDiv(`Label: ${results[0].label}`);
    }
  }
  
