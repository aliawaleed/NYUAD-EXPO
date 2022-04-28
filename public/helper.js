let socket = io();
console.log("helper is conected");

//listen for confirmation of socket; confirms that the client is connected
socket.on('connect', () => {
   console.log("client connected via sockets");
   // now that client has connected to server, emit name and room information
   let data = {
      'name': sessionStorage.getItem('name'),
      'room': sessionStorage.getItem('room'),
   }
   socket.emit('userData', data);
})

// let game;
// let finished;
// let timer;
// let rules;

// window.addEventListener("load", () => {
//     game = document.getElementById('main-container');
//     finished = document.getElementById('finished');
//     rules = document.getElementById('rules');
//     timer = document.getElementById('timer');

//     game.style.display = "none";
//     // console.log("helper style", game.style);
//     timer.style.display = "none";
//     finished.style.display = "none";
//     rules.style.display = "block";
// })