let initial_instructions = "This game involves a camera. Stand up and get ready! ";

let playersInstructions = "Press on the SHOW button to start!";
let timeLeft = 89; //initialized at 59 as the timer takes 1 second to start

// for player scores
let myScore = 0;
let theirScore = 0;

let video;
let detector;
let detections = {}; //the latest detections
// to load the data from the JSON file
let allItems;
let items_array = [];

//columns for words
let left;
let right;

let load_time;

// set font color for both players
let myColor = "green";
let theirColor = "red";

// loading JSON data into array
window.addEventListener("load", () => { // on load
    fetch("./items.json") //fetch the information from the json file
        .then(response => response.json()) //returning promise object
        .then((data) => {
            allItems = data.items;
            // adding items from the JSON file in the arrow
            for (let i = 0; i < allItems.length; i++) {
                items_array.push(allItems[i].item);
            }
            let length = items_array.length;
            left = document.getElementsByClassName("left-column")[0]; //////////// solved with: https://bobbyhadz.com/blog/javascript-typeerror-appendchild-is-not-a-function - console.log(left);
            right = document.getElementsByClassName("right-column")[0];
            left.style.display = "none";
            right.style.display = "none";
            // create list elements for the items in the array and add to both columns
            for (let i = 0; i < length; i++) {
                let obj = document.createElement('li'); //create an li for the objects
                obj.classList.add(items_array[i]);
                obj.setAttribute('id', 'list-item');
                obj.textContent = items_array[i].charAt(0).toUpperCase() + items_array[i].slice(1); // to capitalize the first letter
                if (i < length / 2) {
                    left.appendChild(obj);
                }
                else {
                    right.appendChild(obj);
                }
            }
        })
    // initial states
    allow_start = false; //to disallow one player from starting the game alone
    let item = document.getElementById("generate-button");
    item.style.opacity = "0.6";
    item.disabled = true;
    let inner_text = document.getElementById("inner-text");
    inner_text.style.display = "none";
    let inst = document.getElementById("player-instructions");
    inst.textContent = initial_instructions;
    startLoading(); //prints loading icon on the screen
})

// to show loading page until the model is loaded
function startLoading() {
    load_time = setTimeout(showPage, 2500);
}

// when done loading show the instructions
function showPage() {
    document.getElementById("rules-instructions").innerHTML = "Instructions";
    document.getElementById("loader").style.display = "none";
    document.getElementById("inner-text").style.display = "block";
}

// when two players are in
function twoPlayers() {
    let item = document.getElementById("generate-button");
    item.style.opacity = "1";
    item.disabled = false;
    let players = document.getElementById('players');
    players.innerHTML = playersInstructions;
    allow_start = true;
}

//to ensure starting the game only once for the other users (that didn't press on the order button)
let started = 0;
socket.on('dormStartTimerFromServer', () => {
    if (started == 0) {
        decrementTimerForAll();
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
            // sessionstorage.setItem("dormScore", myScore);
            // socket.emit('dormScore', myScore);
            //remove elements on the screen when time is up
            let sketch = document.getElementById('game-container');
            sketch.style.display = "none";
            left.style.display = "none";
            right.style.display = "none";
            socket.emit('dormEnd', "");
        } else {
            timer.innerHTML = 'Time left: ' + timeLeft;
            timeLeft--; //decrement the time
        }
    }
}

//function to start a 90 second timer and have it initialized on the screen
function startTimer() {
    if (allow_start == true) {
        socket.emit('dormStart', ''); //start game for the rest of the users
        let timer = document.getElementById('timer');
        timer.innerHTML = 'Time left: 90'; //preset before the timer starts
        printItems();
    }
    else {
        alert("Please wait for another player to join!");
    }
}

// add list of items on the screen and change instructions to start game
function printItems() {
    let startInstructions = document.getElementById('players');
    let button = document.getElementById('generate-button');
    button.style.display = 'none';
    startInstructions.innerHTML = "Start searching! ";
    left.style.display = "block";
    right.style.display = "block";
}

// when the game ends and the server the other user
socket.on('dormEndFromServer', () => {
    displayResults();
})

// when object detection has been made
function gotDetections(error, results) {
    //in case there is an error
    if (error) {
        console.error(error);
    }

    //loop through all of the results seen
    for (let i = 0; i < results.length; i++) {
        // if the element exists in our JSON file
        if (items_array.includes(results[i].label)) {
            let item = results[i];
            let label = item.label;
            console.log("label: ", item.label, item.confidence);
            // to yield more accurate results
            if (item.confidence > 0.88) {
                detections[label] = [item];
                for (let i = 0; i < items_array.length; i++) {
                    // check if item found is in our array
                    if (items_array[i] == label) {
                        myScore++;
                        let scores = document.getElementById('score');
                        scores.textContent = "My score: " + myScore + "   |   Their score: " + theirScore;
                        socket.emit('gotItem', label, i, myScore);
                        console.log("item: ", items_array[i]);
                        let strike = document.getElementsByClassName(label)[0];
                        strike.style.textDecoration = "line-through";
                        strike.style.color = myColor;
                        items_array.splice(i, 1);
                    }
                }
            }
        }
    }
    // detect objects within video
    detector.detect(video, gotDetections);
}

// receiving the data from the server for the number of completed orders of the other user
socket.on('gotItemFromServer', (label, i, score) => {
    console.log(label, i)
    let strike = document.getElementsByClassName(label)[0];
    strike.style.textDecoration = "line-through";
    strike.style.color = theirColor;
    items_array.splice(i, 1);
    theirScore = score;
    // console.log("their order", their_orders);
    let scores = document.getElementById('score');
    scores.textContent = "My score: " + myScore + "   |   Their score: " + score;
})

//loading the Coco ssd dataset
function preload() {
    detector = ml5.objectDetector('cocossd');
}

function setup() {
    var canvas = createCanvas(640, 480);
    canvas.parent('p5'); //add to div to position it correctly on the screen
}

// turn on webcam
function camOn() {
    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide();
    // detect objects within video
    detector.detect(video, gotDetections);
}


function draw() {
    // turn the camera on
    if (turnCamOn == true) {
        camOn();
        turnCamOn = false;
    }
    //draw every frame in the video
    if (video) {
        image(video, 0, 0);
    }
}
