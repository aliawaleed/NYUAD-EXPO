window.addEventListener('load', () => {
    let joinForm = document.getElementById('join-form');
    
    joinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let name = document.getElementById('name-input').value;
      let room = document.getElementById('room-input').value;
      console.log(name, room);
      //save the name and the room in session storage
      sessionStorage.setItem('name', name);
      sessionStorage.setItem('room', room);

      //redirect the user to game.html
      window.location = '/game.html';
    })
})