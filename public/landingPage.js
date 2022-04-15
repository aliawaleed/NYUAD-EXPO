// to get the name of the user and store it in session storage
window.addEventListener('load', () => {
    let joinForm = document.getElementById('join-form');
    
    joinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let name = document.getElementById('name-input').value;
      //save the name and the room in session storage
      sessionStorage.setItem('name', name);
    })
})

//move user from landing page to the map of campus
function joinRoom() {
    window.location = '/map/index.html';
    sessionStorage.setItem('room', "map"); //save to session storage
}