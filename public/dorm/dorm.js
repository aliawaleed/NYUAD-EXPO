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
        for(let i = 0; i < allItems.length; i++){
            items_array.push(allItems[i]);
        }
    })
})

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


    /*************check if result exists in dataset for uni***********/


    let labels = Object.keys(detections);
    for (let label of labels) {
        let items = detections[label];
        for (let item of items) {
            item.taken = false;
        }
    }

    // loop through all objects found 
    for (let i = 0; i < results.length; i++) {
        let item = results[i];
        let label = item.label;
        
        if (detections[label]) {
            let existing = detections[label];
            if (existing.length == 0) {
                item.timer = 100;
            } else {
                // Find the object closest?
                let recordDist = Infinity;
                let closest = null;
                for (let candidate of existing) {
                    let d = dist(candidate.x, candidate.y, item.x, item.y);
                    if (d < recordDist && !candidate.taken) {
                        recordDist = d;
                        closest = candidate;
                    }
                }
                if (closest) {
                    let amt = 0.75; //0.75;
                    // lerp is to find a value between the item and the closest one
                    closest.x = lerp(item.x, closest.x, amt);
                    closest.y = lerp(item.y, closest.y, amt);
                    closest.width = lerp(item.width, closest.width, amt);
                    closest.height = lerp(item.height, closest.height, amt);
                    closest.taken = true;
                    closest.timer = 100;
                } else {
                    item.timer = 100;
                }
            }
        } else {
            detections[label] = [item];
            item.timer = 100;
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
            if (item.label !== "person") {
                stroke(0, 255, 0);
                strokeWeight(4);
                fill(0, 255, 0, item.timer);
                rect(item.x, item.y, item.width, item.height);
                noStroke();
                fill(0);
                textSize(32);
                text(item.label, item.x + 10, item.y + 24);
            }
            item.timer -= 2;
            if (item.timer < 0) {
                item.splice(i, 1);
            }
        }
    }
}