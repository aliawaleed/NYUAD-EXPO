let video;
let detector;
let detections = {}; //the latest detections
// to load the data from the JSON file
let allItems;
let items_array = [];

// loading JSON data into array 
window.addEventListener("load", () => { // on load
    fetch("./items.json") //fetch the information from the json file
        .then(response => response.json()) //returning promise object 
        .then((data) => {
            allItems = data.items;
            // adding everyone in the array
            for (let i = 0; i < allItems.length; i++) {
                items_array.push(allItems[i].item);
            }
        })
})

//function to start a 30 second timer and have it initialized on the screen
function startTimer() {
    // socket.emit('dormstart', ''); //start game for the rest of the users
    // if (allow_start == true) {
    let timer = document.getElementById('timer');
    timer.innerHTML = 'Time left: 60'; //preset before the timer starts
    specifyItem();
    // }
    // else {
    // alert("Please wait for another player to join!");
    // }
}

function specifyItem() {
    let item = document.getElementById('generated');
    let button = document.getElementById('generate-button');
    button.style.display = 'none';

    // choose a random item from the array
    itemName = items_array[Math.floor(Math.random() * items_array.length)];
    item.innerHTML = 'Find: ' + itemName;
}

//loading the Coco ssd dataset
function preload() {
    detector = ml5.objectDetector('cocossd');
}

// when object detection has been made
function gotDetections(error, results) {
    //in case there is an error
    if (error) {
        console.error(error);
    }

    // loop through all objects found 
    for (let i = 0; i < results.length; i++) {
        let item = results[i];
        let label = item.label;
        console.log("label", results[i].label, results[i].confidence);
        
        // console.log("1:   ",items_array);
        // check if item is included in our array
        if (items_array.includes(label)) {
            // to yield more accurate results
            if (item.confidence > 0.7) {
                detections[label] = [item];
                // items_array.splice(i, 1);
                // console.log("2:   ",items_array);
            }
        }
    }
    // detect objects within video
    detector.detect(video, gotDetections);
}

function setup() {
    var canvas = createCanvas(640, 480);
    canvas.parent('p5'); //add to div to position it correctly on the screen
    // for webcam
    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide();
    // detect objects within video
    detector.detect(video, gotDetections);
}

function draw() {
    //draw every frame in the video
    image(video, 0, 0);

    let labels = Object.keys(detections);
    for (let label of labels) {
        let items = detections[label];
        for (let i = items.length - 1; i >= 0; i--) {
            let item = items[i];
            stroke(0, 255, 0);
            strokeWeight(4);
            fill(0, 255, 0, 0);
            rect(item.x, item.y, item.width, item.height);
            noStroke();
            fill(0);
            textSize(32);
            text(item.label, item.x + 10, item.y + 24);
        }
    }
}