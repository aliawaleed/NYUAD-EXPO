// JavaScript file for A2
// opens and connect to socket
let socket = io();
let majorList = [ "Arab Crossroads Studies",
"Art and Art History",
"Bioengineering",
"Biology",
"Business Organizations and Society",
"Chemistry",
"Civil Engineering",
"Computer Engineering",
"Computer Science",
"Economics",
"Electrical Engineering",
"Film and New Media",
"General Engineering",
"History",
"Interactive Media",
"Legal Studies",
"Literature and Creative Writing",
"Mathematics",
"Mechanical Engineering",
"Music",
"Philosophy",
"Physics",
"Psychology",
"Social Research and Public Policy",
"Theater"];

let majors = [];

//listen for confirmation of socket; confirms that the client is connected
socket.on('connect', () => {
    console.log("client connected via sockets");
    // now that client has connected to server, emit name and room information
    let data = {
        'name' : sessionStorage.getItem('name'),
        'room' : sessionStorage.getItem('room'),
    }
    socket.emit('userData', data);
 })



//p5.js code
function setup() {
    let canvas = createCanvas(windowWidth/2, windowHeight*0.6);
    canvas.parent('sketch-canvas');
    background(255);
 }
 
 //emit information of Canvas position everytime mouse moves
 function windowResized() {
    resizeCanvas(windowWidth/2, windowHeight*0.6);
    background(255);
  }
  

//When user submit, check if the written word matches any major from the list
let submitButton = document.getElementById('submit');
let majorInput = document.getElementById('name');

submitButton.addEventListener('click', function () {
//Load the word.json data file 
//  fetch('word.json')
//  .then(response => response.json())
//  .then(data => {
//    console.log(data);
//    //Do something with 'data'
//    let majorlist = data.words.value;
//    // get the keys for each of the categories
//    //let majors = Object.keys(majorlist);
//    console.log(majors);

   //Send the randomword to the server to be sent to all clients
   //socket.emit('randomwordguess', randomItem);

   //Send the randomword to the server to be displayed by specific client
   //socket.emit('displayrandomword', randomItem);
//});

  //Effor alert: If there is no entry for name show alert
  if (majorInput.value.length == 0) {
    alert('Type in the major');
   }
   checkMajor();

  //empty input section after submission 
  document.querySelector("#name").value = "";
});


function checkMajor(){
    if (majorList.includes(majorInput)){
        console.log('includes major')

    }

};


 /* Instruction for Major Hunt */
socket.on('player1', () => {
    player1 = "Hello player 1! Please wait for another player to join!";
    let inst = document.getElementById('instructions');
    inst.textContent = player1;
 })
 
 socket.on('player2', (player2) => {
    player2 = "Hello player 2! Start Guessing what the other player is drawing";
    let inst = document.getElementById('instructions');
    inst.textContent = player2;
 })
 
 socket.on('morePlayers', (morePlayers) => {
    morePlayers = "Please wait! There are 2 players in the game already!";
    let inst = document.getElementById('instructions');
    inst.textContent = morePlayers;
 })
 
 socket.on('message', () => {
    let inst = document.getElementById('instructions');
    inst.textContent = "Another player has joined. Click Pick Button to Receive the word ";
 })
