let roomStart = 'D1'

//Instruciton Page
let Player1Instruction = "You will start with Acting"
let Player2Instruction = "You will start with Guessing"

// This is a test of the p5LiveMedia webrtc library and associated service.
// Open this sketch up 2 times to send video back and forth

let myVideo;
let otherVideo;
let getwordButton;
let drawthis;


function setup() {

    let canvas = createCanvas(windowWidth*0.6, windowHeight * 0.6);
    canvas.parent('sketch-canvas');
  
    myVideo = createCapture(VIDEO, 
      function(stream) {
        let p5l = new p5LiveMedia(this, "CAPTURE", stream, "charades");
        p5l.on('stream', gotStream);
      }
    );  
    myVideo.muted = true;     
    myVideo.hide();
}

function draw() {
  background(220);
  stroke(255);
  if (myVideo != null) {
    image(myVideo,0,0,width/2,height);
    text("My Video", 10, 10);
  }
  ellipse(mouseX,mouseY,100,100);

  if (otherVideo != null) {
    image(otherVideo,width/2,0,width/2,height);
    text("Their Video", width/2+10, 10);
  }  
}

// We got a new stream!
function gotStream(stream, id) {
  // This is just like a video/stream from createCapture(VIDEO)
  otherVideo = stream;
  //otherVideo.id and id are the same and unique identifiers
  otherVideo.hide();
}


// window.addEventListener("load", () => { 
//   getwordButton = document.getElementById('getword-button');
//   drawthis = document.getElementById("generated");
// })

// function generateWord(){
//   console.log('click');
//   fetch('word.json')
//      .then(response => response.json())
//      .then(data => {
//         console.log(data);
//         //Do something with 'data'
//         let wordlist = data.words;
//         let randomItem = wordlist[Math.floor(Math.random() * wordlist.length)];
//         console.log(randomItem);

//         //send the data to update for all
//         socket.emit('generatedword','');
//         console.log("this"+ randomItem);
//      });
// };

// // Listen for word named 'displayrandomword' from the server - only applied to the drawer
// socket.on('displayrandomword', function (data) {
//    console.log("displayrandomword arrived");
//    console.log(data);

//    //Create a message string and page element
//    let receiveword = data;
//    currentword = receiveword;
//    drawthis.innerHTML = receiveword;

//    //A perosn who draws can't guess the word
//    sendButton.disabled = true;
//    msgInput.disabled = true;
//    sendButton.style.opacity(0.6);
// });


// socket.on('drawclicked', function (data) {
//   console.log("drawclicked");
// });


// function startTimer() {
//   console.log('startTimer');
//   generateWord();
// }