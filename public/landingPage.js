window.addEventListener('load', () => {
    let joinForm = document.getElementById('join-form');
    
    joinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let name = document.getElementById('name-input').value;
      let room = document.getElementById('room-input').value;
      //save the name and the room in session storage
      sessionStorage.setItem('name', name);
      sessionStorage.setItem('room', room);

      //redirect the user to game.html
      console.log(room)
      if (room == 'Field') {
        window.location = '/field/field.html';
      }
      else if (room == 'A2'){
        window.location = '/a2/a2.html';
      }
      else if (room == 'C2'){
        window.location = '/c2/c2.html';
      }
      else if (room == 'D2'){
        window.location = '/d2/d2.html';
      }
      else{ //to be changed
        alert("not available")
      }
    })
})