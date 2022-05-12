EXPLORE NYUAD Documentation
----------------------

### SETUP 
* Run `npm install` to load the necessary node packages
* Run the browser pointing to `localhost:2000`

## Title
[NYUAD EXPO](https://explore-nyuad.glitch.me/)

## Description and Inspiration 
This is a multiplayer game that is inspired by Expo 2020. Similar to the idea of how visitors went around the different pavilions to experience the unique cultures of countries from all over the world, this game is meant to allow players to digitally explore the NYU Abu Dhabi campus. They do that by exploring 6 different pavilions that consist of D2: the dining hall, C2: the campus center, A2: a classroom, Dorm: a dorm room on campus, D1: An outside area and the Outdoor Field. In each of the pavilions, they get to play a 2-player game encompassing aspects related to the NYU Abu Dhabi campus.

On the landing page, users join by adding in their name and get redirected to another page that displays a map of campus showing 6 clickable locations and the number of players inside each. The players can then click on the pavilion of their choice and get redirected to a specific game page. At the D2 pavilion, players are given orders that are specific to what D2 makes, and the goal is to complete as many orders as possible within 1 minute. At C2 palm trees, players get to play Pictionary with relevant NYU Abu Dhabi words. In the A2 classroom, players play a game where they need to collectively write down all majors on campus and get to see the final score. At the dorm room, the game uses machine learning to detect objects that students can find in their dorm room and they should find as many as possible. In D1, the users play a tricky game of thinking using icons of different objects across Abu Dhabi to try to find a matching card from 5, the goal is to get it before the other user. Finally, on the Field, players get to play a digital version of tug of war against each other.

Landing Page        |  Home/Map Page with user count    
:-------------------------:|:-------------------------:
![Landing Page](/images/landing.png)  |  ![Map](/images/connected-players.png)

The 6 games:
<p float="center">
  <img src="/images/field.png" width="33%" />
  <img src="/images/a2.png" width="33%" /> 
  <img src="/images/d2.png" width="33%" />
</p>
<p float="center">
  <img src="/images/d1.png" width="33%" />
  <img src="/images/dorm.png" width="33%" /> 
  <img src="/images/c2.png" width="33%" />
</p>

## Process
The first thing I did was set up all of the folders and files that we would be needing for the full application. I created separate folders for each of the games with the files needed, as well as the server, establishing connections between the clients and servers as well creating the basic HTML for each to ensure that the users would be redirected to the requested page. Initially, I just had it as a form where the users add their names and choose the location from a drop-down menu and save that date in session storage, adding such data in 2 separate dictionaries. One of them consists of key-value pairs of the name of the room and the number of players and the other one stores the username and their ID, to later be used and accessed. 

At the same time, Soojin worked on establishing a common basic design that we would later use for all of the games in order for them to be standardized and cohesive. She also designed the map page based on a 3D model of campus, but after discussing it, we felt that a 2D map would be more user-friendly and easier to navigate. However, we couldn't find an official map that shows all of the locations we want to use, so I got one that already exists and used Illustrator to add the Field to it, using the same colors and designs as the actual map.

The Original Map        |  After Illustrator  
:-------------------------:|:-------------------------:
![The Original Map](images/campus-map.png)  |  ![After Illustrator](images/edited-map.png)

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

### Project 3 Additions
The first thing I worked on was an issue that has been frustrating us since Project 2 that we weren’t able to fix; showing the number of users in each room on the map. Although it was working to some extent, it was not accurate when the users went to the map as they technically never “joined” the map and so the value was only decremented when they joined in another room. I tried to fix the problem in many different ways until I finally reached a solution.

The issue was that the user never joined the map as it was never saved to session storage when they clicked on the home button, which redirects to the map. I then made sure that it decrements correctly when they leave and added the line below for all of the games when going back to the map, mid-game, or at the end of the game. 
```
sessionStorage.setItem('room', "map"); //save to session storage
```
Next, I created the files for the new dorm game while Soojin created the helper.js and helper.css files and then added some functions to both of the helper files. I then added temporary divs on the map for both of the newly added games, mine and Soojin’s, and setup the JS functions needed to display the number of people in both rooms on the map. I also created the necessary emissions to make sure that they are working properly and redirecting correctly, emitting connection and disconnection information, and displaying the number of people in each room on the map. 

Working on the new dorm game

Ideally, the dorm game would be played from inside someone’s dorm and the goal is to find as many items as possible from the printed list on the screen before the time is up. This game uses a camera where the user can see themselves and ML5 is used to detect the object in front of the screen. 

First, I set up the initial code for the game. I loaded in the necessary files for both, ML5 and p5 as both libraries are needed together for this game. I then added all of the necessary containers in the HTML for the start screen, game screen, and end screen, also focusing on the styling to maintain the common theme between all games. 

Next, I worked on the JS side of the game, which is the actual game using ML5 and P5. I set up the initial code following [Dan Shiffman’s tutorial](https://thecodingtrain.com/learning/ml5/1.3-object-detection.html) and made the necessary changes before working on the game mechanics. The first thing was the setup() function which sets up the canvas, the camera, and the detector, which I later changed so that the camera is not turned on as soon as the HTML file is open but rather after the user reads the instructions and presses on the start button. In this game, I am using the Coco SSD model that is pre-trained on specific objects for accurate detection. Then there’s the code for detecting objects on the screen which I made major changes to so that it’s specific to our game and removed all unnecessary functions. Initially, in the draw() function, I also printed the name of the item displayed on the screen for reference but later removed it. Since the dataset consists of many words that are not all relevant to the game, I made my own JSON file that contains the objects that can be found in a student’s dorm room and connected that file to the game where I loaded the data in the JS file and added it to an array for later comparison. Whenever an object is detected on the screen from the Coco SSD model, I loop through my list and compare the item if it’s available and if yes, then this item is valid. I also worked a lot on the styling of the page and added relevant functions to the helper.js file.

Next, I implemented the timer for the dorm game and created a specifyItem() function that randomizes the display of a word from our list on the screen which I later changed as I believed that the player would not be able to proceed and could get stuck on an item if they don’t have it in their room; will not be able to get any more points. I also learned how to look over Dan Schiffman’s code, understand it line-by-line and make changes again based on our expectations of the game.

Then, I added some comments to the server as some of the functions we wrote earlier were a bit confusing for us. I then worked on setting up a scoreboard and sending the data to the server, however, we discussed this and realized that it’s better not to have one as some of the games weren’t collaborative and others, such as Tug of War, only gave one point, so it did not make sense to us to maintain a scoreboard. In the dorm code, as stated earlier, randomizing one item on the screen did not really make sense so instead, I created two columns at the sides of the webcam display and added half of the list words to the left column and half on the right column so that both users can see all words at the same time and try to find as many as possible before the time is up. Adding the items to the columns was done in the load function by creating and adding “li” elements but I kept getting an “appendChild is not a function Error”, which is discussed in the challenges below. 

The code segment for adding the items to the list could be found below, where I split the list into 2, and added each half to a column, setting the attributes and printing the words with a capital letter at the beginning. 

```
            let length = items_array.length;
            left = document.getElementsByClassName("left-column")[0];
            right = document.getElementsByClassName("right-column")[0];
            left.style.display = "none";
            right.style.display = "none";
            for (let i = 0; i < length; i++) {
                let obj = document.createElement('li'); 
                obj.classList.add(items_array[i]);
                obj.setAttribute('id', 'list-item');
                obj.textContent = items_array[i].charAt(0).toUpperCase() + items_array[i].slice(1);                
                if (i < length / 2) {
                    left.appendChild(obj);
                }
                else {
                    right.appendChild(obj);
                }
            }
```

When the detections were accurate and going through, I started working on the emissions of the data and ensuring that no one player can start before the second player joins and also presses start, also working on the timer and decrementing it for the other user.

When detecting the objects in front of the screen, I checked if the label of the most accurate item displayed on the screen is included in our array, and only then I would work with this object/word. Inside that function, I checked to see the confidence and only claimed an object was correct if the confidence is greater than 0.88, as this was the best value based on trial and error. It is still not the most accurate for a few of the words, but the chance of this being incorrect is very minor and so 0.88 was the best option. If the item is found, I incremented the score and emitted the data to the other user with the array index. This index is used to .splice(), or remove the element from the array for both users so that each item is only found once and removed straight away. The words are also striked-through from the list of items printed on the screen with a green color if the first-person player gets it and red if the other person does. Below is the segment of code for this functionality:
```
if (items_array.includes(results[i].label)) {
            let item = results[i];
            let label = item.label;
            // to yield more accurate results
            if (item.confidence > 0.88) {
                detections[label] = [item];
                for (let i = 0; i < items_array.length; i++) {
                    // check if item found is in our array
                    if (items_array[i] == label) {
                        myScore++;
                        let scores = document.getElementById('score');
                        scores.textContent = "My score: " + myScore + "   |   Their score: " + theirScore;
                        socket.emit('gotItem', label, i, myScore);
                        let strike = document.getElementsByClassName(label)[0];
                        strike.style.textDecoration = "line-through";
                        strike.style.color = myColor;
                        items_array.splice(i, 1);
                    }
                }
            }
```
With most of the functionality completed, I went back to the Field code to see if there is room for improvement. When user-testing, I noticed that when users refresh the page or press on any button, it is often annoying as an alert is printed, and so I added one line to check if the buttons being clicked are specifically the left and right arrow buttons. 

```
        if (keyCode == 37 || keyCode == 39) {
            alert("Please wait for another player to join!");
        }

```
I then worked on perfecting all of the games. In the dorm, I added some more necessary emissions to ensure that I could strike through the words correctly, displayed the end screen with the results, changed class names that were copied from other games to make more sense, and changed some variable names for the same reason.  For the other games, I also changed variable names and fixed styling to maintain a common feel between all games.

Next, since most of the functionality for the d1 and dorm game were complete, I edited the images for the map once again, using Figma, to crop it to the size of the specific areas, and added these images to the map, fixing their position on top of the darkened one using trial and error. 

Following the professor’s feedback, I worked on the D2 code to avoid the repetition of the addAnswer() function for each and every item on the menu and rather based it on the class names, loading them in as the page is opened and checking the clicks. I had some trouble working on that, also described below. 

Another aspect that was annoying to me in the dorm game is that the camera would automatically turn on when the user joins the room rather than after they click start, since it was called in the setup function. This was solved with the professor’s help by creating a separate function outside to only be called when the start button was pressed. Another issue was that the model took so much time to load and the screen would freeze, making it unclear to the user, to solve this problem, I added a loading visual, explained below. 

When testing out the game, I tried to show all of the objects to the screen to see the reliability of the detector, and this made me notice a bunch of errors in the objects being detected. Examples include scissors being written as that rather than “scissor”, two-word objects that weren’t compare correctly, such as “cell phone”, and so on. 

Another minor change that I made was in the d2 code, where the items on the menu were loaded as sources each time from online sources on the internet, making it difficult to play and test the game in the absence of an internet connection, so I downloaded all of the images and added their paths instead. I also worked a lot on the styling as I noticed that it wasn’t displayed well on the projector, so, also using trial and error, I fixed the display for all screen sizes, excluding phones, since the games are all meant to be played on a laptop, or landscape screens in general.  

Another problem that we encountered across all games was the condition we set to start the game, where players are only allowed to start when both players have clicked on the start button and are able to see the game screen. This only worked when one player joined and clicked start, and after they did press start the other player went in, but it didn’t work when both players were on the instructions page and then one of them pressed start, this player was still able to play the game. With changing the condition, several aspects of the code had to be rearranged. The solution for the start condition problem is also in the challenges section below. 

When setting up and fixing the condition in Soojin’s new game in D1, I came across a few errors, including the randomization of the set of cards being displayed where she was using “index = int(random(1,5));”, which did not work properly from my device and printed errors, so I changed it to “index = Math.floor(Math.random() * 5) + 1;” instead. 


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

### Project 3 Challenges
* Dorm: Displaying list in the columns on sides of the webcam, I kept getting an "appendChild is not a function" error
When adding the objects in the JavaScript file. To solve this problem, I kept console.logging the column divs to try to find a solution and I researched until I came across [this link](https://bobbyhadz.com/blog/javascript-typeerror-appendchild-is-not-a-function) which I then used also by console.logging until I reached that the div in my case should be reached using “document.getElementsByClassName("left-column")[0]”; adding [0] after some trial and error fixed this issue. 

* Dorm: Striking out elements from array for both users
I had trouble removing the item from the array for both users to make sure that the same item cannot be obtained more than once and is removed straight away after either of the users finds it. This is the first time I had to emit more than one aspect at a time, as I needed to commit the name of the word that was detected, the index of it in the array had to also be gotten so that the other user could get the information from the server and remove that specific item from the array. I solved this issue using the code segment below, where I also had the same issue mentioned above but was able to fix it.

```
      socket.emit('gotItem', label, i, myScore);
      let strike = document.getElementsByClassName(label)[0];
      strike.style.textDecoration = "line-through";
      strike.style.color = myColor;
      items_array.splice(i, 1);
```

* D2: adding items to tray in JS
In the feedback received from Professor Mathura in Project 2, it would be better to call on the function once in the JS file and loop through to add the specific dish to the tray without needing to make changes in the html file every time a change has to be made. Since I had more than one ID and Classname for the elements and had more than one of each, I researched until I reached the solution below, which I had to load in a jquery library for:

```
$(".appetizers").on('click', function() {
        addAnswer($(this))
    });
 ```
 
 an issue with the library loaded is that it was not supported in HTTPS and so when we changed to HTTP, the games using a camera stopped working and so I found another, newer version of the library that I loaded in instead.

Another change that had to be made was as follows, to access the different attributes of the elements given to the addAnswer() function:

```
let image = img.attr('src');

      if (img.attr('class') ==  'appetizers') {
          chosenAppetizer = getKeyByValue(allAppetizers, image);
      }
```

* Dorm: Model loading and blocking user interactions
I had a problem where whenever the game starts, the ML5 model and trained data set take a few seconds to load where any click on the screen is not considered. I tried loading it in at the very beginning and saving it into session storage but I had some issues retrieving the data so instead, I decided to show a loading icon at the beginning. Most of the loader code was adapted from [this link](https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_loader5) and amended based on the design and time needed. 

* All games: Game Start condition
A bug that we had that would sometimes arise was allowing users to start the game only after both players have clicked on the Start button and not when they entered the HTML page. Our problem would occur if both players are on the instructions page and then one of us presses start, at that point, they actually do have the ability to start the game. To fix this, I added two new emissions and made some other changes:

At the client side when user presses start button:
```
socket.emit("userClickedStart", sessionStorage.getItem('room'));
```

At the server side when they receive the emission:
```
socket.on('userClickedStart', (room) => {
        console.log('clicked start', room);
        io.in(room).emit("gameUsersInFromServer", '');
}
```

At the client side when the clients receive the information from the server:
```
let usersIn = 0;

socket.on('gameUsersInFromServer', () => {
   usersIn++;
   console.log("users in", usersIn);
   if (usersIn == 2) {
      socket.emit('A2canStart', ''); //start game for the rest of the users
   }
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

Dorm
* Show which user got which item
* The accuracy is set too high, decreasing the confidence level would make the game run smoother
* Not very clear that the user should stand up and move to find items

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
* I Learned how to use ML5 and the different applications of it and went through many libraries within it and documentation that made me a better learner

### The Next Steps (Project 2):
* Maintain highscores for all of the users that played the game - we felt that it is unnecessary and not fair across games
* Fix issue of number of people not showing on map when the users that have been on the game press on the home button -- completed
* Fix the tray position for larger screens -- completed
* Add the names of the users to be identifiable -- would be nicer to implement 

### The Next Steps (Project 3)
* Add the names of the users to be identifiable - would be nicer to implement 
* In the dorm - Make it clearer for the users that they need to get up and move
* Maybe for the dorm room add more items that are NYU Abu Dhabi specific, such as ID or room card

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
Link for the loader code: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_loader5
