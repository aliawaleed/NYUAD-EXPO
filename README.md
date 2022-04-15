Project 2 Documentation
----------------------

### SETUP 
* Run `npm install` to load the necessary node packages
* Run the browser pointing to `localhost:2000`

## Title
[NYUAD EXPO](https://nyuad-expo.glitch.me/)

## Description and Inspiration 
This is a multiplayer game that is inspired by Expo 2020. Similar to the idea of how visitors went around the different pavilions to experience the unique cultures of countries from all over the world, this game is meant to allow players to digitally explore the NYU Abu Dhabi campus. They do that by exploring 4 different pavilions that consist of D2: the dining hall, C2: the campus center, A2: a classroom, and the Outdoor Field. In each of the pavilions, they get to play a 2-player game encompassing aspects related to the NYU Abu Dhabi campus.

On the landing page, users join by adding in their name and get redirected to another page that displays a map of campus showing 4 clickable locations and the number of players inside each. The players can then click on the pavilion of their choice and get redirected to a specific game page. At the D2 pavilion, players are given orders that are specific to what D2, and the goal is to complete as many orders as possible within 1 minute. At C2 palm trees, players get to play Pictionary with relevant NYU Abu Dhabi words. In the A2 classroom, players play a game where they need to collectively write down all majors on campus and get to see the final score. Finally, on the Field, players get to play a digital version of tug of war against each other.

Landing Page        |  Home/Map Page with user count    
:-------------------------:|:-------------------------:
![Landing Page](/images/landing.png)  |  ![Map](/images/connected-players.png)

## Process
The first thing I did was set up all of the folders and files that we would be needing for the full application. I created separate folders for each of the games with the files needed, as well as the server, establishing connections between the clients and servers as well creating the basic HTML for each to ensure that the users would be redirected to the requested page. Initially, I just had it as a form where the users add their names and choose the location from a drop-down menu and save that date in session storage, adding such data in 2 separate dictionaries. One of them consists of key-value pairs of the name of the room and the number of players and the other one stores the username and their ID, to later be used and accessed. 

At the same time, Soojin worked on establishing a common basic design that we would later use for all of the games in order for them to be standardized and cohesive. She also designed the map page based on a 3D model of campus, but after discussing it, we felt that a 2D map would be more user-friendly and easier to navigate. However, we couldn't find an official map that shows all of the locations we want to use, so I got one that already exists and used Illustrator to add the Field to it, using the same colors and designs as the actual map.

**The original map:**

![The Original Map](images/campus-map.png) 

**After Illustrator:**

![After Illustrator](images/edited-map.png)

The next step was to work on the individual games, where we worked asynchronously, for the most part. I made the games for the Field and D2 while Soojin made the games for A2 and C2. The game used for the Field was [Tug of War](https://tug-of-war-alia.glitch.me/), which I made for my previous assignment, the documentation for the game could be accessed [here](https://github.com/aliawaleed/tugOfWar#readme). Although a lot of changes had to be made for D2, seeing that the design has changed completely and a lot of error checking had to be made and fixed, I decided to work on the D2 game first as I was excited to work on something new. 

To make sure that I have a functioning game, I started off by making it for one player and making sure that the logic is correct before I start emitting information. I started off by creating the basic and initializing the necessary divs. I wasn't sure how I would like the food menu items to be presented but decided to make it a table so that it's intuitive and easy to follow when the order is displayed. I then created arrays for each of the food categories and found images of dishes that are sold in D2 with transparent backgrounds. I also made an order button to display an order consisting of an appetizer, main course, and dessert as well as another button to submit an order. The game mechanism is as follows: the user presses the order button, the order gets displayed, and then, as fast as they can, they click on these 3 items on the menu and have them displayed on the div that represents the tray, and then they can submit. When they do, I then check if the order is correct. To do this, I initialized 3 variables, 1 for each of the order items, and 3 variables, 1 for each of the user's chosen items. I then randomized the ordered item from the given arrays and stored them in these values. Later on, when the user clicks on the food item from the menu, the JS then tracks the click, gets the class name of the dish, gets the key, or dish name from the value of the array, and stores it in the chosen dish variable. An example of this is as follows, this stores the name of the food item:  

```
      if(img.className == 'appetizers') {
          chosenAppetizer = getKeyByValue(allAppetizers,image);
      }
```

I then wrote the code for the submit button, when clicked to check if the order is correct, I wanted to leave the user with the freedom to pick and choose the items out of order and so the code for this section is as follows:

```
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
else{
      alert("Wrong!");
}
```
This is the final code for this section as I later built on it, and will discuss it later in the documentation. But what this code segment does, is that it checks if each of the order items and chosen items are the same, and in that case, increments the number of completed orders to keep track of the score, print it, and emit such information to the other user, and remove all items from the tray div while generating a new order so that the same cycle would start again. I also worked on the styling to make sure that this is the design that I am set on. 

The next thing I did was go back to the server code to fix the connections of users, track the number of the users in each room, and track which user it is so that specific instruction would later be sent to them. As this part of the code was necessary for all of the games, I decided to work on it first before emitting information so that we won't need to go back to it and fix it later. Part of it was to also limit the number of people per room since all of the games are for only 2 players. 

I then decided to go back to the Tug of War game to change the design to follow the theme that we had agreed upon. The design we decided to implement was similar to the image below:

Design to Implement        |  My Old Design       
:-------------------------:|:-------------------------:
![Tug of War design](/images/field-design.png) | ![initial design](/images/field-initial-design.png)


The main changes I made were regarding the positioning since I had to set the P5 width to be equal to that of the screen and changed the background to be transparent so that the wallpaper we chose would be set as our background. An issue I had with that is that I couldn't reset the background inside the draw function to hide the previous movement of the rope when the arrows are clicked, since the background was part of the HTML and P5. The solution I reached is in the challenges section below. I had to make a lot of changes in the position of the rope, the triangle at the center, and error-checking when the triangle leaves the screen. With the current code, for error checking and ensuring that the game doesn't go on when one user wins, I set the x value of the triangle to be far outside the screen to later fix it.

**The Final Design:**
![final design](/images/field-final-design.png)

Another issue that I had with the newer design was the fact that the rope didn't really look like it was moving as it was a plain white line and so it only looked like the triangle was moving and not the whole rope and so I fixed this by making minor changes to the design of the rope, also described below in the challenges section. I then fixed the positioning of the instructions for each player as well as the title to standardize what it looks like between all of the games, the ones I made as well as Soojin's. The HTML element is as follows:

```
<p id="moveTitle"> <span style="font-weight:bold"> The Field </span> | Tug of War </p>
```
I then went back to the D2 code once again to work on the emission of data between the clients and the server. I first established a connection and emitted the information of the user name and room back to the server to later be accessed. The first emission I did was that of the submission, as it was the most necessary to me, letting the other clients know what the other user submitted. I then played the game several times to test it and work on what I needed to fix, a problem that I had with the function that checks if the order is correct, is that when the user presses submit without adding anything to the tray, it sees it as a correct answer, accordingly, I equated all of the orders initially to 0 and the chosen ones to 1. I chose to set them as numbers as it was impossible to, later on, have these numbers equal because they are later given dish names. Something else that I had trouble with was finding an image of a tray that fits the theme and so I ended up getting an image and editing it to make the background transparent, which was annoying since the image itself was white and the background was also white, so I had to manually fill it in. I also had so much trouble trying to figure out and somewhat perfect the location of the tray on the screen as an image and adding the dishes on top of it, also discussed below. To work more on the features, I wanted to give the users the ability to remove individual items from the tray and not have to submit and restart. I had to rewrite this function a few times until I figured out the best way to have it at the end because I had trouble with the ways that I initially had where there would be cases where they would not work accurately. 

To add purpose to the game and make it competitive, having a timer was necessary, and so I used the code from [here](https://stackoverflow.com/questions/4435776/simple-clock-that-counts-down-from-30-seconds-and-executes-a-function-afterward) to have a timer that decrements and made some minor changes to it. We later used this timer for 2 of the other games. 

At first, I used it to inform the other user when the other one submits then I decided to change it as it would disrupt the game for the other player, instead, I chose to send the data only once the game ends; the timer is up. Another issue I had was with starting the timer for both users at the same time; when one user presses the order button, the game starts for the other user in the room. I set boolean variables to track the number of people in the room to allow starting and emitting accurate information. I had several problems with that, as well as the counter decrementing twice as fast for one of the players and I later fixed it.  

I then went back to the main screen/home page and made changes to how the rooms are accessed so that it's not a drop-down menu, I added placeholder divs that would redirect to the specific rooms, sending the necessary information of the room name to the server. The redirecting code, which changes the location as well as stores it is as follows:

```
function joinRoom(img) {
    let room = img.id;
    //redirect the user to game.html
    console.log(room);
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
    sessionStorage.setItem('room', room); //save to session storage
}
```

This segment of code gets the id of the image that was clicked on, and I set the IDs to be the names of the rooms for a better flow and understanding of the code. I then went back to the code of the individual games to work on the end conditions. I had some issues with the timer that I fixed with professor Mathura's help to ensure that the timer is decrementing correctly, it is also in the challenges section below. 

Also, to make the competition better, I also emitted the final order number of each player to the other player and had it printed on the screen so that each player knows how many meals they got and how many the other player got. For Tug of War end conditions, instead of setting the triangle to be far outside the screen, I made a condition that checks if the game is not on, and if not, then there won't be a rope on the screen at all, and I printed it outside of the P5 sketch. This is the condition that I set, which checks if the center point of the triangle has left the screen on either of the sides:

```
  if (pos.x < 0 || pos.x > windowWidth){
      gameOn = false;    
  }  
```
Next, was working on user experience so that the user understands what they are doing and the game runs smoothly for them. Accordingly, it was necessary to print the instructions for each game before the game starts, so that the user knows how the game goes. This was also important as we observed how people were interacting with the games during user testing and wanted to ensure that there is no confusion. I added instructions for each of the games as separate divs that would be displayed as soon as the user enters the specific games, with a start button that then leads to the game itself. I did the same thing for the end condition, using the same format of the div to standardize the start and end of the game, displaying the final scores or results at the end, ensuring that each of the divs is shown only when it's supposed to and everything else is hidden. An example of the instructions page and ending page could be seen below:
**Instructions for D2        |  End Screen for D2**        
:-------------------------:|:-------------------------:
![instructions for game](/images/instructions.png)  |  ![end of game](/images/end.png)

I then did the same thing for the landing page where the user would enter their name first then be redirected to the map, but later changed it to two different HTML files and made the map a room so that we could use it to emit user data, showing how many users are in each room and anything else that we would later want to add. Hence, I created a new HTML file with its own CSS and JS that is specific to the map and emits information to the server and receives information from it. 

Since the number of users in the room could now be seen when either of the users is on the instructions page, I needed to add conditions to not allow the user to start the game if one of them can see the screen of the game and the other can see the instructions, as the game mechanics would not make sense and it would be unfair to the user on the instructions page. I needed to set several different boolean variables to allow the game to start and to make the game actually start. This issue took me a long time to fix as I had to make many changes to the code to make sure that what each user is seeing makes sense. I also standardized the buttons to be the same as Soojin's where they would be dimmed and not allow the user to start the game when they are the only ones inside, and later change it when they join to make the opacity 1.0 and clear for the user to press on them. I also worked on assigning each of the players in the field an arrow to use to win and made sure that each player is only assigned one direction and wins when the triangle leaves the screen on their side, irrespective of which player pressed the button as the instructions had specified their assigned arrow. 

Next, to block the users from entering a room that has already started, or has two people inside, I set a function to emit to the 3rd user to enter a room where there are 2 people in the room already and to send them back to the map, asking them to try joining later, I also had to ensure that this user is not counted to be inside the room to not disrupt the games. 

This code segment sends the users back the map, on the client-side:
```
    socket.on('morePlayers',() => {
        alert("There are 2 players in the game already! Please try again later!");
        window.location = '/map/index.html';
    })
```

This code segment ensures that the number of users in the room does not change when they are kicked out, on the server-side:
```
  if (rooms[socket.roomName]) { //if room exists
      // do not increment if there are 2 people in the room 
      if (rooms[socket.roomName] == 2) {
          console.log("Client > 2: ", socket.id);
          socket.emit('morePlayers', '');
      }
      else{
          rooms[socket.roomName]++;
      }
  } else {
      rooms[socket.roomName] = 1;
  }
```

With almost everything working properly and functioning, I worked on the code to emit the number of players in each room to the map for all users while Soojin worked on receiving it and displaying it. The code segment below was used to emit:

```
  // get the number of players in each room and send to map
  let A2 = rooms["A2"];
  let C2 = rooms["C2"];
  let D2 = rooms["D2"];
  let Field = rooms["Field"];

  io.in("map").emit("A2PlayerNum", A2);
  io.in("map").emit("C2PlayerNum", C2);
  io.in("map").emit("D2PlayerNum", D2);
  io.in("map").emit("FieldPlayerNum", Field);
```
I then went back to fix the issue by allowing the game to start, which is discussed in the challenges below, as this was one of the most difficult issues that I spent the longest time on. This was followed by working on the D2 code once again, with two main issues that I needed to fix, the first one was that the users could still add items on the tray even if the game hasn't started, so I made sure to block it, and another issue that also took me some time solve. This was the issue of removing items from the tray and choosing the correct place to add the items on the try again after they were removed, this is also discussed in the challenges section below. 

I then added a home icon on all of the games to be accessed at any point in case any user wants to go back to the home page at any point. We meant to make it small since our goal is for users to start the game and complete it. It was difficult to find an image that looks good and so I also got an image online and edited it to remove the background. I then did some styling changes and added the score of both users to always be sent whenever the submit button is clicked based on the feedback we get from user testing. I also compared the score at the end to display to the users which user won along with the score at the end of the game.

```
let winner = document.getElementById('winner');
if (myCompletedOrders > theirCompletedOrders) {
  winner.innerHTML = "You won!";
}  
else if (myCompletedOrders < theirCompletedOrders) {
  winner.innerHTML = "They won!";
}
else{
  winner.innerHTML = "It's a draw!";
}

let results = document.getElementById('results');
results.innerHTML = 'Them: ' + theirCompletedOrders + ' You: ' + myCompletedOrders; 
```
I also helped Soojin fix a few aspects in her code, such as what elements to display and when, especially when the instructions are shown, and also emitted the color data to make sure that each user is only assigned one random color that is constant and reflected on the screen for the other user, sending it alongside the major and circle when the user submits. 

Lastly, I standardized the format of the instructions for all games, fixed the code, and added comments. 

## Challenges 
* Tug of War: resetting transparent background 
Given that the design was set on a background that was based on the HTML and the P5 was transparent, I had an issue where the rope would keep reprinting every time the users move it since I couldn't reset the background in the draw function. I tried many different things, from trimming the background to deleting the rope until I came across a "clear()" function that deletes everything every time the rope is moved and prints the new one.

* Tug of War: rope doesn't look like it's moving
Given that the color of the rope and triangle was white, and the rope was the full width of the screen, it didn't look like it was moving, so with some trial and error to reach a design that I'm satisfied with, I drew grey lines to imitate an actual rope by initializing some grey lines on the rope and made sure that they move with the rope when it does, giving the impression that it is moving. The code segment is as follows:

```
    for (let i = 1; i < 12; i++) {
        line(x - 100 * i, y, (x - 100 * i) - 30, y);
        line(x + 100 * i, y, (x + 100 * i) + 30, y);
    }
```

* D2: Placing food dishes/items on top of the tray
Since the image of the tray was no longer a normal div, I had a problem placing the dishes on top of the tray when the user clicks them.

This is the div that holds the tray and user choices. 
```
<div class="choices" id="choices">
    <img src="/d2/images/tray.png" alt="tray to add food items" id="tray">
    <img id="ans0" onclick="removeItem(this.id)">
    <img id="ans1" onclick="removeItem(this.id)">
    <img id="ans2" onclick="removeItem(this.id)">
    <button id="submit-button" onclick="submitOrder()"> submit </button>
</div>
```
After doing some research, I reached a solution where I changed the CSS of the tray to have the position as relative, as the parent element, and the chosen answers' positions as absolute, centered them and spaced them out evenly using px. Although this works properly on a Macbook desktop, the location on the screen is not the best when viewed on a projector or zoomed out, since vw was not used like everything else. When used, the location was not accurate, so this is something that I would like to improve. 

* D2: adding items to tray after removing them
Since the items were added and removed based on ID, I had an issue where the items are not added properly if not removed from bottom to top. Accordingly, I created a boolean array initialized as "let array = [0, 0, 0];" where they refer to the first, second, and third items on the tray, respectively. There was a lot of error-checking that took place in this, and I am very proud of the solution that I reached.  

I tracked several aspects at the same time. I had a counter "num" that checks how many items have been clicked. The first 3 items that are placed on the tray are added in order. The code then changes when there are more elements, where it prints out an error if the tray is full, or makes changes if a dish was removed.

The code segment below is to ADD a new item. This iterates through the boolean array, which has 0 for empty (changes when items are removed), and 1 is taken. There is also another variable that tracks the first free space and so the for loop iterates over the array and once it reaches a free space, it breaks the loop and places this new item in that div on the screen.
```
if (num == 3) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] == 0) {
            free = i;
            break;
        }
    }
    let answerBox = document.getElementById('ans' + free);
    answerBox.src = img.src;
    array[free] = 1;
}
else {
    let answerBox = document.getElementById('ans' + num);
    console.log(answerBox, num);
    answerBox.src = img.src;
    array[num] = 1;
    num++;
}
```
When REMOVING an item from the tray, I made changes in the boolean array to set the value back to 0, showing that this space is now free to add other dishes. This can be seen in the code segment below:
```
    if (item.id == "ans0") {
        array[0] = 0;
    }
    else if (item.id == "ans1") {
        array[1] = 0;
    }
    else if (item.id == "ans2") {
        array[2] = 0;
```
* D2: timer
Another issue I had was with the timer, where it decremented twice as fast for one of them and so with professor Mathura's help the fixed code for the timer that I reached was as follows, where I had to separate the function into two different parts to ensure that the timer is accurate and only decrements once:

```
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
```

* D2/Field: allow the game to start only when both players can see the game
Another issue was that with the emissions that we were making, the players would be able to start the game when the second player was in the room and not when they press start to see the game screen. With that, I needed to keep track of two variables; start and allow_start. Allow start would only allow the game to start when the players are on the game screen, initialized as false, and then true when the second player joins. This is then used in the startGame() function that occurs when the user presses the start button and so, as seen in the code section below, from D2 js, the canStart emission that allows starting the game could only take place when the second player presses start, which then sends the data to the server and the server sends it back to the users calling the twoPlayers() function that makes some changes in the display and allows the users to start the game.
```
//function to start game
function startGame() {
    let rules = document.getElementById('rules');
    rules.style.display = "none";
    let completed = document.getElementById('completed-orders');
    completed.style.display = "block";
    let game = document.getElementById('container');
    game.style.display = "block";
    if (allow_start == true) {
        socket.emit('canStart', ''); //start game for the rest of the users
    }
}

socket.on('canStartDataFromServer', () => {
    twoPlayers();
})
```

## User Testing
### Goals
* Do the users understand the games?
* Do they seem like they’re enjoying them? 
* What do they think could be changed or fixed for a smoother experience?
* Is there a game that they prefer playing and why?
* Are the bigger games more clickable?
* Would they rather collaborate or compete?

### Observations and Feedback
D2
* Some users would try to drag and drop -> I added instructions that make it clear throughout the game that they should click as it's faster
* Unable to remove/delete items from tray -> Also added instructions and alert if more than 3 items have been added
* Time was not enough -> increased the time to 1 minute 
* Players prefer seeing the score of the other person during the game -> I added the score and would later want to add the name 

Field 
* Game took a long time as the triangle wasn't moving quickly -> moved it in larger increments

Overall
* Show how many players are in each room  -> changed the map into a room and emitted the information from the other rooms
* People are tempted to go to d2 -> This was an unexpected observation as we felt that D2 was small relative to other locations on the screen yet people chose it more than we had expected
* Make clearer timers -> made the font bigger for clarity
* Move to home when game is up/add home button -> we added a home button at the end screen as well as next to all of the game titles
* Instructions for all -> added instructions before the start of every game

```
Soojin's games and my contributions:

A2 
* Timer increments faster than 1 sec/sec
* Change colors and assign specific colors -> helped Soojin solve this issue
* Enter instead of submit only 
* Notify users if word exists 
* Change input box to major not name -> changed it because some people would write their name instead of a major

C2
* Change brush color to make it clearer 
* Delete or erase option 
* Clear screen 
```

## Lessons and Next Steps
### Lessons
* Many of the lessons learned have been through the challenges that I have encountered and the solutions that I reached 
* That using boolean variables and boolean arrays is very useful and have many implications -
* User testing allows you to see problems from other people's eyes and is very useful, to always prioritize the user experience as at the end of the day the product should be catered towards them
* Working with a partner was very helpful as we would think of everything together and I learned a lot helping with their code since I would try to understand some parts from scratch and help them accordingly

### The Next Steps:
* Maintain highscores for all of the users that played the game
* Fix issue of number of people not showing on map when the users that have been on the game press on the home button
* Fix the tray position for larger screens
* Add the names of the users to be identifiable

## References 
Appetizers links: 
[Salad](https://creazilla-store.fra1.digitaloceanspaces.com/cliparts/22476/salad-clipart-xl.png),
[Soup](https://creazilla-store.fra1.digitaloceanspaces.com/cliparts/59674/egg-soup-clipart-xl.png),
[Fries](https://www.i2clipart.com/cliparts/d/c/4/5/clipart-pommes-frites-french-fries-512x512-dc45.png)

Main Courses links: 
[Burger](https://i.pinimg.com/originals/3a/f9/bf/3af9bf97ef3708b1738468c775f7def4.png),
[Salmon](https://gallery.yopriceville.com/var/albums/Free-Clipart-Pictures/Fast-Food-PNG-Clipart/Grilled_Steak_PNG_Clipart.png?m=1434276761),
[Pasta](https://gallery.yopriceville.com/var/albums/Free-Clipart-Pictures/Fast-Food-PNG-Clipart/Pasta_PNG_Clipart_Image.png?m=1435200901)

Desserts links: 
[Cake](https://clipart.world/wp-content/uploads/2020/12/Piece-Cake-clipart-transparent.png),
[Acai](https://i.pinimg.com/originals/7e/2f/7d/7e2f7d5b8f44cb0fd0ba3e766dc21448.png),
[Profiterole](https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/03d1e79f-6f8e-4a3b-8d2b-67a2687e4b06/d58uknl-04aaec66-d0a3-4ad6-b2ae-dcf81a539b8a.png/v1/fill/w_512,h_512,strp/choux_creme_icon_by_yamshing_d58uknl-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NTEyIiwicGF0aCI6IlwvZlwvMDNkMWU3OWYtNmY4ZS00YTNiLThkMmItNjdhMjY4N2U0YjA2XC9kNTh1a25sLTA0YWFlYzY2LWQwYTMtNGFkNi1iMmFlLWRjZjgxYTUzOWI4YS5wbmciLCJ3aWR0aCI6Ijw9NTEyIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.DDdK8pQ3fvbfPz7-b3flNBINMqfZ0WU-Uf_yGGeMNmM) 

Link for timer code: https://stackoverflow.com/questions/4435776/simple-clock-that-counts-down-from-30-seconds-and-executes-a-function-afterward
