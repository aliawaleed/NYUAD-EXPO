let roomStart = 'D1'

//Instruciton Page
let Player1Instruction = "You will start with Acting"
let Player2Instruction = "You will start with Guessing"



let video;
let ovideo;
let otherVideo;

//p5.js Canvas for video Camera
function setup() {
    let canvas = createCanvas(windowWidth, windowHeight * 0.6);
    canvas.parent('sketch-canvas');
    video = createCapture(VIDEO, function(stream) {
        p5l = new p5Live(this,"CAPTURE",stream)
        p5l.on('stream', gotStream);
    });  
    video.muted = true;     
	video.hide();

 }
 
 function draw() {
    image(video,0,0,width/2,height);
    if (ovideo != null) {
        image(ovideo,width/2,0,width,height);
    }
    image(otherVideo,width/2,0,width/2,height);
}		

// We got a new stream!
function gotStream(stream) {
    // This is just like a video/stream from createCapture(VIDEO)
    ovideo = stream;
    //ovideo.hide();
}