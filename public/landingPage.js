window.addEventListener('load', () => {
    let game = document.getElementById('container');
    game.style.display = "none";

    let rules = document.getElementById('rules');
    rules.style.display = "block";

    let joinForm = document.getElementById('join-form');
    
    joinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let name = document.getElementById('name-input').value;
      //save the name and the room in session storage
      sessionStorage.setItem('name', name);
      rules.style.display = "none";
      game.style.display = "block";
      
    })
})

function joinRoom(img) {
    let room = img.id;
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
    sessionStorage.setItem('room', room); //save to session storage
}