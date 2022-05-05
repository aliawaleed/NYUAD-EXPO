//client connects to the server
let socket = io(); //opens and connects to the socket

//listen for confirmation of socket; confirms that the client is connected
socket.on('connect', () => {
  console.log("client connected via sockets to map");
  // now that client has connected to server, emit name and room information
  let data = {
    'name': sessionStorage.getItem('name'),
    'room': sessionStorage.getItem('room'),
  }
  socket.emit('userData', data);
})

//to print the number of players in each room on the map 
window.addEventListener("load", () => { // on load    
  //listen to number of players in room A2
  socket.on('A2PlayerNum', (data) => {
    if (data == null) {
      data = 0;
    }
    console.log("a2: ", data);
    let A2Num = document.getElementById('A2Num');
    A2Num.innerHTML = '(' + data + '/2)';
  });

  //listen to number of players in room C2
  socket.on('C2PlayerNum', (data) => {
    if (data == null) {
      data = 0;
    }
    console.log("c2: ", data);
    let C2Num = document.getElementById('C2Num');
    C2Num.innerHTML = '(' + data + '/2)';
  });

  //listen to number of players in room D2
  socket.on('D2PlayerNum', (data) => {
    if (data == null) {
      data = 0;
    }
    console.log("d2: ", data);
    let D2Num = document.getElementById('D2Num');
    D2Num.innerHTML = '(' + data + '/2)';
  });

  //listen to number of players in room Field
  socket.on('FieldPlayerNum', (data) => {
    if (data == null) {
      data = 0;
    }
    console.log("field: ", data);
    let FieldNum = document.getElementById('FieldNum');
    FieldNum.innerHTML = '(' + data + '/2)';
  });

  //listen to number of players in room A2
  socket.on('D1PlayerNum', (data) => {
    if (data == null) {
      data = 0;
    }
    console.log("d1: ", data);
    let D1Num = document.getElementById('D1Num');
    D1Num.innerHTML = '(' + data + '/2)';
  });

  //listen to number of players in room A2
  socket.on('dormPlayerNum', (data) => {
    if (data == null) {
      data = 0;
    }
    console.log("dorm: ", data);
    let dormNum = document.getElementById('dormNum');
    dormNum.innerHTML = '(' + data + '/2)';
  });


//   socket.on('dormHighScore', (score) => {
//     console.log("dorm score: ", score);
//     let dScore = document.getElementById('dScore');
//     dScore.innerHTML = score;
//  });
})


function joinRoom(img) {
  let room = img.id;
  //redirect the user to game.html
  console.log(room);
  if (room == 'Field') {
    window.location = '/field/field.html';
  }
  else if (room == 'A2') {
    window.location = '/a2/a2.html';
  }
  else if (room == 'C2') {
    window.location = '/c2/c2.html';
  }
  else if (room == 'D2') {
    window.location = '/d2/d2.html';
  }
  else if (room == 'D1') {
    window.location = '/d1/d1.html';
  }
  else if (room == 'dorm') {
    window.location = '/dorm/dorm.html';
  }
  sessionStorage.setItem('room', room); //save to session storage
}