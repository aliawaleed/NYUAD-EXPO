//client connects to the server
let socket = io(); //opens and connects to the socket

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

// assigning key-value pairs for the image sources of the different food categories
let allAppetizers = {'salad': 'https://creazilla-store.fra1.digitaloceanspaces.com/cliparts/22476/salad-clipart-xl.png', 'soup': 'https://creazilla-store.fra1.digitaloceanspaces.com/cliparts/59674/egg-soup-clipart-xl.png', 'fries': 'https://www.i2clipart.com/cliparts/d/c/4/5/clipart-pommes-frites-french-fries-512x512-dc45.png'};
let allMainCourses = {'burger':'https://i.pinimg.com/originals/3a/f9/bf/3af9bf97ef3708b1738468c775f7def4.png', 'salmon': 'https://gallery.yopriceville.com/var/albums/Free-Clipart-Pictures/Fast-Food-PNG-Clipart/Grilled_Steak_PNG_Clipart.png?m=1434276761', 'pasta': 'https://gallery.yopriceville.com/var/albums/Free-Clipart-Pictures/Fast-Food-PNG-Clipart/Pasta_PNG_Clipart_Image.png?m=1435200901'};
let allDesserts = {'cake': 'https://clipart.world/wp-content/uploads/2020/12/Piece-Cake-clipart-transparent.png', 'acai': 'https://i.pinimg.com/originals/7e/2f/7d/7e2f7d5b8f44cb0fd0ba3e766dc21448.png', 'profiterole': 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/03d1e79f-6f8e-4a3b-8d2b-67a2687e4b06/d58uknl-04aaec66-d0a3-4ad6-b2ae-dcf81a539b8a.png/v1/fill/w_512,h_512,strp/choux_creme_icon_by_yamshing_d58uknl-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NTEyIiwicGF0aCI6IlwvZlwvMDNkMWU3OWYtNmY4ZS00YTNiLThkMmItNjdhMjY4N2U0YjA2XC9kNTh1a25sLTA0YWFlYzY2LWQwYTMtNGFkNi1iMmFlLWRjZjgxYTUzOWI4YS5wbmciLCJ3aWR0aCI6Ijw9NTEyIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.DDdK8pQ3fvbfPz7-b3flNBINMqfZ0WU-Uf_yGGeMNmM'};

let answerNumber = 0; //to check how many fooditems the user clicked
let myCompletedOrders = 0; //to track number of correct completed orders
let timeLeft = 29; //initialized at 29 as the timer takes 1 second to start

let orderAppetizer = 0;
let orderMainCourse = 0;
let orderDessert = 0;

let chosenAppetizer = 1;
let chosenMainCourse = 1;
let chosenDessert = 1;

window.addEventListener("load", () => { // on load    
    let game = document.getElementById('container');
    game.style.display = "none";
    let completed = document.getElementById('completed-orders');
    completed.style.display = "none";

    let rules = document.getElementById('rules');
    rules.style.display = "block";

    let app1 = document.getElementById('appetizer1');
    app1.src = allAppetizers['salad'];

    let app2 = document.getElementById('appetizer2');
    app2.src = allAppetizers['soup'];

    let app3 = document.getElementById('appetizer3');
    app3.src = allAppetizers['fries'];

    let main1 = document.getElementById('main-course1');
    main1.src = allMainCourses['burger'];

    let main2 = document.getElementById('main-course2');
    main2.src = allMainCourses['salmon'];

    let main3 = document.getElementById('main-course3');
    main3.src = allMainCourses['pasta'];

    let dessert1 = document.getElementById('dessert1');
    dessert1.src = allDesserts['cake'];

    let dessert2 = document.getElementById('dessert2');
    dessert2.src = allDesserts['acai'];

    let dessert3 = document.getElementById('dessert3');
    dessert3.src = allDesserts['profiterole'];
})

//function to start game
function startGame(){
    let rules = document.getElementById('rules');
    rules.style.display = "none";
    let completed = document.getElementById('completed-orders');
    completed.style.display = "block";
    let game = document.getElementById('container');
    game.style.display = "block";
}


// function to generate order
function generateOrder(){
    let order = document.getElementById('generated');
    let button = document.getElementById('generate-button');
    button.style.display = 'none';

    // get the keys for each of the categories
    const appetizers = Object.keys(allAppetizers);
    const mainCourses = Object.keys(allMainCourses);
    const desserts = Object.keys(allDesserts);

    // choose a random key (item from each category)
    orderAppetizer = appetizers[Math.floor(Math.random() * appetizers.length)];
    orderMainCourse = mainCourses[Math.floor(Math.random() * mainCourses.length)];
    orderDessert = desserts[Math.floor(Math.random() * desserts.length)];

    order.innerHTML = 'I want to order: ' + orderAppetizer + ', ' + orderMainCourse + ', ' + orderDessert;

    let instructions = document.getElementById('instructions');
    instructions.innerHTML = 'Click on the food items to make the order.';
}

//function to start a 30 second timer and have it initialized on the screen
function startTimer(){
    let timer = document.getElementById('timer');
    timer.innerHTML = 'Time left: 30'; //preset before the timer starts
    generateOrder();
    socket.emit('start', ''); //start game for the rest of the users
}

//to ensure starting the game only once for the other users (that didn't press on the order button)
let started = 0;
socket.on('startDataFromServer', ()=>{
    if (started == 0){
        console.log("game started"); // shows how many orders the other player completed 
        startTimer();
        //to decrement timer
        let timerId = setInterval(countdown, 1000);
        
        function countdown() {
            if (timeLeft == -1) {
                clearTimeout(timerId);
                
                //remove elements on the screen when time is up
                let menu = document.getElementById('menu');
                let tray = document.getElementById('choices');
                menu.style.display = "none";
                tray.style.display = "none";

                // alert("Time is up!");
                socket.emit('finish', myCompletedOrders);
            } else {
                timer.innerHTML = 'Time left: ' + timeLeft;
                console.log(timeLeft);
                timeLeft--;
            }
        }
    }
    started = 1;
})

//to get the key given the value of it
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

// function to add clicked images to tray
function addAnswer(img) {
    let image = img.src;

    // get the name of the item that the user has pressed within each category and store in vrespective ariable;
    if(img.className == 'appetizers') {
        console.log(getKeyByValue(allAppetizers,image));
        chosenAppetizer = getKeyByValue(allAppetizers,image);
    }
    
    else if(img.className == 'main-courses'){
        console.log(getKeyByValue(allMainCourses,image));
        chosenMainCourse = getKeyByValue(allMainCourses,image);
    }
    else if(img.className == 'desserts'){
        console.log(getKeyByValue(allDesserts,image));
        chosenDessert = getKeyByValue(allDesserts,image);
    }

    //depending on number of items on the tray, add to specific position defined in CSS
    if (answerNumber == 0) {
        let answerBox = document.getElementById('ans1')
        answerBox.src = img.src;
        answerNumber++;
    }
    else if (answerNumber == 1){
        let answerBox = document.getElementById('ans2')
        answerBox.src = img.src;
        answerNumber++;
    }
    else if (answerNumber == 2){
        let answerBox = document.getElementById('ans3')
        answerBox.src = img.src;
        answerNumber++;
    }
    else{
        let instructions = document.getElementById('instructions');
        instructions.innerHTML = 'You already have 3 items on the tray! Remove by clicking on the items on the tray!';   
    }
}

// submit order to check the answer
function submitOrder(){
    let complete = document.getElementById('completed-orders');
    if (orderAppetizer == chosenAppetizer && orderMainCourse == chosenMainCourse && orderDessert == chosenDessert) {
        // increase the number of completed orders and reflect it on the screen
        myCompletedOrders++;
        complete.textContent = "Completed orders: " + myCompletedOrders;
        //empty the tray
        removeItem('ans1');
        removeItem('ans2');
        removeItem('ans3');
        //generate new order and display on the screen
        generateOrder();
    }
    else{
        alert("Wrong!");
    }
}

// to remove item from the tray and decrement the answer number
function removeItem(clickedItem){
    let item = document.getElementById(clickedItem);
    item.src = "";
    answerNumber--;
}

socket.on('finishDataFromServer', (theirCompletedOrders)=>{
    let instructions = document.getElementById('instructions');
    instructions.innerHTML = 'Them: ' + theirCompletedOrders + ' You: ' + myCompletedOrders;  
})


//code used for timer https://stackoverflow.com/questions/4435776/simple-clock-that-counts-down-from-30-seconds-and-executes-a-function-afterward