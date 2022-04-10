window.addEventListener('load', () => {
    let joinForm = document.getElementById('join-form');
    
    joinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let name = document.getElementById('name-input').value;
      //save the name and the room in session storage
      sessionStorage.setItem('name', name);
    })
})

function joinRoom() {
    window.location = '/map/index.html';
    sessionStorage.setItem('room', "map"); //save to session storage
}