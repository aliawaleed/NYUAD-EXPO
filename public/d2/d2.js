//client connects to the server
let socket = io(); //opens and connects to the socket

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

// assigning key-value pairs for the image sources of the different food categories
let allAppetizers = { 'salad': '/d2/images/salad.png', 'soup': '/d2/images/soup.png', 'fries': '/d2/images/fries.png' };
let allMainCourses = { 'burger': '/d2/images/burger.png', 'salmon': '/d2/images/salmon.png', 'pasta': '/d2/images/pasta.png' };
let allDesserts = { 'cake': '/d2/images/cake.png', 'acai': '/d2/images/acai.png', 'profiterole': '/d2/images/profiterole.png' };

let myCompletedOrders = 0; //to track number of correct completed orders
let their_orders = 0;

let timeLeft = 59; //initialized at 29 as the timer takes 1 second to start

let orderAppetizer = 0;
let orderMainCourse = 0;
let orderDessert = 0;

let chosenAppetizer = 1;
let chosenMainCourse = 1;
let chosenDessert = 1;

let allow_start = false;

//on load, load the data and show the game rules
window.addEventListener("load", () => {
    let game = document.getElementById('container');
    game.style.display = "none";
    let completed = document.getElementById('completed-orders');
    completed.style.display = "none";
    let end = document.getElementById('end');
    end.style.display = "none";

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

    // to track clicked items from the menu 
    $(".appetizers").on('click', function(){
        addAnswer($(this))
    });

    $(".main-courses").on('click', function() {
        addAnswer($(this))
    });
    $(".desserts").on('click', function() {
        addAnswer($(this))
    });   

    socket.on('player1', () => {
        console.log('wait for another player to join');
    })

    // when there are more than 2 players in the room, send the player back to the map
    socket.on('morePlayers', () => {
        alert("There are 2 players in the game already! Please try again later!");
        window.location = '/map/index.html';
    })

    // dim buttons before game is allowed to start
    let submit = document.getElementById("submit-button");
    submit.style.opacity = "0.6";
    let order = document.getElementById("generate-button");
    order.style.opacity = "0.6";
})

//two players are in
function twoPlayers() {
    let players = document.getElementById('players');
    players.innerHTML = 'Press on the ORDER button to begin! ';
    let submit = document.getElementById("submit-button");
    let order = document.getElementById("generate-button");
    order.style.opacity = "1";
    submit.style.opacity = "1";
    allow_start = true;
}

let usersIn = 0;

socket.on('usersInFromServer', () => {
    usersIn++;
    console.log("users in", usersIn);
    if (usersIn == 2) {
        socket.emit('canStart', ''); //start game for the rest of the users
    }
})

//function to start game
function startGame() {
    // usersIn++;
    socket.emit("clickedStart", sessionStorage.getItem('room'));
    let rules = document.getElementById('rules');
    rules.style.display = "none";
    let completed = document.getElementById('completed-orders');
    completed.style.display = "block";
    let game = document.getElementById('container');
    game.style.display = "block";
}


// allow the game to start
socket.on('canStartDataFromServer', () => {
    twoPlayers();
})

// receiving the data from the server for the number of completed orders of the other user 
socket.on('submitDataFromServer', (completed) => {
    their_orders = completed;
    console.log("their order", their_orders);
    let complete = document.getElementById('completed-orders');
    complete.textContent = "My orders: " + myCompletedOrders + "   |   Their orders: " + their_orders;
})

let canAdd = false;
// function to generate order
function generateOrder() {
    canAdd = true; // to allow items to be added only after the game has started
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
function startTimer() {
    socket.emit('D2start', ''); //start game for the rest of the users
    if (allow_start == true) {
        let timer = document.getElementById('timer');
        timer.innerHTML = 'Time left: 60'; //preset before the timer starts
        generateOrder();
    }
    else {
        alert("Please wait for another player to join!");
    }
}

//to ensure starting the game only once for the other users (that didn't press on the order button)
let started = 0;
socket.on('startDataFromServer', () => {
    if (allow_start == true) {
        if (started == 0) {
            console.log("game started"); // shows how many orders the other player completed 
            startTimer();
            //to decrement timer
            let timerId = setInterval(decrementTimer, 1000);
    
            function decrementTimer() {
                //if timer is up
                if (timeLeft == -1) {
                    clearTimeout(timerId);
                    //remove elements on the screen when time is up
                    let menu = document.getElementById('game-container');
                    let tray = document.getElementById('container');
                    menu.style.display = "none";
                    tray.style.display = "none";
    
                    // alert("Time is up!");
                    socket.emit('finish', myCompletedOrders);
                } else {
                    timer.innerHTML = 'Time left: ' + timeLeft;
                    timeLeft--; //decrement the time
                }
            }
        }
        started = 1; // so that the timer does not start again 
    }
})

//to get the key given the value of it
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

let array = [0, 0, 0]; // boolean array for the 3 locations to add items on the tray 
let num = 0; // count for number of items that have been added 
let free = -1; // to find a free spot on the tray

// function to add dishes to tray 
function addAnswer(img) {
    if (canAdd == true) {
        // if there are 3 items on the tray
        if (array[0] == 1 && array[1] == 1 && array[2] == 1) {
            alert("The tray is full, please remove an item from the tray first by clicking on it!");
        }
        else {
            let image = img.attr('src');

            if (img.attr('class') ==  'appetizers') {
                chosenAppetizer = getKeyByValue(allAppetizers, image);
            }

            else if (img.attr('class') == 'main-courses') {
                chosenMainCourse = getKeyByValue(allMainCourses, image);
            }
            else if (img.attr('class') == 'desserts') {
                chosenDessert = getKeyByValue(allDesserts, image);
            }

            // if more than 3 dishes have been added 
            if (num == 3) {
                // find the first free slot on the tray to place the newly added item
                for (let i = 0; i < array.length; i++) {
                    if (array[i] == 0) {
                        free = i;
                        break;
                    }
                }
                let answerBox = document.getElementById('ans' + free);
                answerBox.src = img.attr('src');
                array[free] = 1;
            }
            // if we're in the first 3 items, add them, increment the count, and change boolean to 1
            else {
                let answerBox = document.getElementById('ans' + num);
                // console.log(answerBox, num);
                answerBox.src = img.attr('src');
                array[num] = 1;
                num++;
            }
        }
    }
    else {
        alert("The game needs to start first!");
    }
}

// to remove item from the tray and decrement the answer number
function removeItem(clickedItem) {
    let item = document.getElementById(clickedItem);
    item.src = ""; //remove the source/image
    // change boolean in array from 1 to 0 when item is removed
    if (item.id == "ans0") {
        array[0] = 0;
    }
    else if (item.id == "ans1") {
        array[1] = 0;
    }
    else if (item.id == "ans2") {
        array[2] = 0;
    }
}

// submit order to check the answer
function submitOrder() {
    if (allow_start == true) {
        let complete = document.getElementById('completed-orders');
        if (orderAppetizer == chosenAppetizer && orderMainCourse == chosenMainCourse && orderDessert == chosenDessert) {
            // increase the number of completed orders and reflect it on the screen
            myCompletedOrders++;
            complete.textContent = "My orders: " + myCompletedOrders + "   |   Their orders: " + their_orders;
            socket.emit('submit', myCompletedOrders);
            //empty the tray
            removeItem('ans0');
            removeItem('ans1');
            removeItem('ans2');
            //generate new order and display on the screen
            generateOrder();
        }
        else {
            alert("Wrong!");
        }
    }
    else {
        alert("Please wait for another player to join!");
    }
}

// when the game ends and the server the other user
socket.on('finishDataFromServer', (theirCompletedOrders) => {
    let complete = document.getElementById('completed-orders');
    complete.style.display = "none";
    let end = document.getElementById('end');
    end.style.display = "block";
    let rules = document.getElementById('rules');
    rules.style.display = "none";

    let winner = document.getElementById('winner');

    //compare the order numbers to print the winner
    if (myCompletedOrders > theirCompletedOrders) {
        winner.innerHTML = "You won!";
    }
    else if (myCompletedOrders < theirCompletedOrders) {
        winner.innerHTML = "They won!";
    }
    else {
        winner.innerHTML = "It's a draw!";
    }

    let results = document.getElementById('results');
    results.innerHTML = 'Them: ' + theirCompletedOrders + ' You: ' + myCompletedOrders;
})

//to go back to home page
function goHome() {
    socket.emit('userLeft', '');
    window.location = '/map/index.html';
    sessionStorage.setItem('room', "map"); //save to session storage
}