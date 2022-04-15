Project 2 Documentation
----------------------

### SETUP 
* Run `npm install` to load the necessary node packages
* Run the browser pointing to `localhost:2000`

## Title
[NYUAD EXPO](https://nyuad-expo.glitch.me/)

## Description and Inspiration 
This is a multiplayer game that is inspired by Expo 2020. Similar to the idea of how visitors went around the different pavilions to experience the unique cultures of countries from all over the world, this game is meant to allow players to digitally explore the NYU Abu Dhabi campus. They do that by exploring 4 different pavilions that consist of D2: the dining hall, C2: the campus center, A2: a classroom, and the Outdoor Field. In each of the pavilions, they get to play a 2-player game encompassing aspects related to the NYU Abu Dhabi campus.

On the landing page, users join by adding in their name and get redirected to another page that displays a map of campus showing 4 clickable locations and the number of players inside each. The players can then click on the pavilion of their choice and get redirected to a specific game page. At the D2 pavilion, players are given orders that are specific to what D2 and the goal is to complete as many orders as possible within 1 minute. At C2 palm trees, players get to play pictionary with relevant NYU Abu Dhabi words. At the A2 classroom, players play a game where they need to collectively write down all majors on campus and get to see the final score. Finally, at the Field, players get to play a digital version of tug of war against each other.

## Process
The first thing I did was setup all of the folders and files that we would be needing for the full application. I created separate folders for each of the games with the files needed, as well as the server, establishing connections between the clients and servers as well creating the basic html for each to ensure that the users would be redirected to the requested page. Initially, I just had it as a form where the users add their names and choose the location from a drop down menu and save that date in session storage, adding such data in 2 separate dictionaries. One of them consists of key-value pairs of the name of the room and the number of players and the other one that stores the username and their ID, to later be used and accessed. 

At the same time, Soojin worked on establishing a common basic design that we would later user for all of the games in order for them to be standardized and cohesive. She also designed the map page based on a 3D model of campus, but after discussing it, we felt that a 2D map would be more user friendly and easier to navigate. However, we couldn't find an official map that shows all of the locations we want to use, and so I got one that already exists and used Illustrator to add the Field to it, using the same colors and designs as the actual map.

The original map ![The Original Map](allImages/campus-map.png) After Illustrator ![After Illustrator](allImages/edited-map.png)

The next step was to work on the individual games, where we worked asynchornously, for the most part. I made the games for the Field and D2 while Soojin made the games for A2 and C2. The game used for the Field was [Tug of War](link), which I made for my previous assignment, the documentation for the game could be accessed [here](link). Although a lot of changes had to be made for D2, seeing that the design has changed completely and a lot of error checking had to be made and fixed, I decided to work on the D2 game first as I was excited to work on something new. 

To make sure that I have a functioning game, I started off by making it for one player and making sure that the logic is correct before I start emitting information. I started off by creating the basic and initializing the necessary divs. I wasn't sure how I would like the food menu items to be presented but decided to make it as a table so that it's intuitive and easy to follow when the order is displayed. I then created arrays for each of the food categories and found images of dishes that are sold in D2 with transparent backgrounds. I also made an order button to display an order consisting of an appetizer, main course, and dessert as well as another button to submit an order. The game mechanism is as follows: the user presses on the order button, the order gets displayed, and then, as fast as they can, they click on these 3 items on the menu, have them displayed on the div that represents the tray, and then they can submit. When they do, I then check if the order is correct. To do this, I initialized 3 variables, 1 for each of the order items, and 3 variables, 1 for each of the user's chosen items. I then randomized the order item from the given arrays and stored them in these values. Later on, when the user clicks on the food item from the menu, the JS then tracks the click, gets the class name of the dish, gets the key, or dish name from the value of the array and stores it in the chosen dish variable. An example of this is as follows, this stores the name of the food item:  

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
This is the final code for this section as I later built on it, and will discuss it later in the documentation. But what this code segment does, is that it checks if each of the order items and chosen items are the same, and in that case, increments the number of completed orders to keep track of the score, print it and emit such information to the other user, and remove all items from the tray div while generating a new order so that the same cycle would start again. I also worked on the styling to make sure that this is the design that I am set on. 

The next thing I did was go back to the server code to fix the connections of users, to track the number of the users in each room and track which user it is so that specific instructions would later be sent to them. As this part of the code was necessary for all of the games, I decided to work on it first before emitting information so that we won't need to go back to it and fix it later. Part of it was to also limit the number of people per room since all of the games are for only 2 players. 

I then decided to go back to the Tug of War game to change the design to follow the theme that we had agreed upon. The design we decided to implement was similar to the image below:

[Tug of War design](/images/field-design.png).

The main changes I made were regarding the positioning since I had to set the p5 width to be equal to that of the screen, changed the background to be transparent so that the wallpaper we chose would be set as our background. An issue I had with that is that I couldn't reset the background inside the draw function to hide the previous movement of the rope when the arrows are clicked, since the background was part of the html and p5. The solution I reached is in the challenges section below. I had to make a lot of changes in the position of the rope, the triangle at the center, and error checking when the triangle leaves the screen. With the current code, for error checking and ensuring that the game doesn't go on when one user wins, I set the x value of the triangle to be far outside the screen to later fix it.

The initial design for tug of war was:
[initial design](/images/field-initial-design.png)

which I then changed in the code to look as follows:
[final design](/images/field-final-design.png)

Another issue that I had with the newer design was the fact that the rope didn't really look like it was moving as it was a plain white line and so it only looked like the triangle was moving and not the whole rope and so I fixed this by making minor changes to the design of the rope, also described below in the challenges section. I then fixed the positioning of the instructions for each players as well as the title to standardize what it looks like between all of the games, the ones I made as well as Soojin's. The html element is as follows:

```
<p id="moveTitle"> <span style="font-weight:bold"> The Field </span> | Tug of War </p>
```
I then went back to the D2 code once again to work on the emission of data between the clients and the server. I first established a connection and emitted the information of the user name and room back to the server to later be accessed. The first emission I did was that of the submission, as it was the most necessary to me, letting the other clients know what the other user submitted. I then played the game several times to test it and work on what I needed to fix, a problem that I had with the function that checks if the order is correct, is that when the user presses submit without adding anything to the tray, it sees it as a correct answer, accordingly, I equated all of the orders initially to 0 and the chosen ones to 1. I chose to set them as numbers as it was impossible to, later on, have these numbers equal because they are later given dish names. Something else that I had trouble with was finding an image of a tray that fits the theme and so I ended up getting an image and editing it to make the background transparent, which was annoying since the image itself was white and the background was also white, so I had to manually fill it in. I also had so much trouble trying to figure out and somewhat perfect the location of the tray on the screen as an image and adding the dishes on top of it, also discussed below. To work more on the features, I wanted to give the users the ability to remove individual items from the tray and not have to submit and restart. I had to rewrite this function a few times until I figured out the best way to have it at the end because I had trouble with the ways that I initially had where there would be cases where they would not work accurately. 

To add purpose to the game and make it competitive, having a timer was necessary, and so I used the code from [here](https://stackoverflow.com/questions/4435776/simple-clock-that-counts-down-from-30-seconds-and-executes-a-function-afterward) to have a timer that decrements and made some minor changes to it. We later used this timer for 2 of the other games. The function used for the timer is below:

```
timer segment 
```
I used this timer sothen decided to change the emission sent when a user submits as it would desrupt the game for the other player, instead, I chose to send the data only once the game ends; the timer is up. I issue I had with that was starting the timer for both sides at the same time, that when one user presses on the order button, the game starts for the other user in the room. I set boolean variables to track the number of people in the room to allow starting and emitting accurate information. I had several problems with that, as well as the counter decrementing twice as fast for one of the players and I later fixed it.  

I then went back to the main screen/home page and made changes to how the rooms are accessed so that it's not a drop down menu, I added place holder divs that would redirect to the specific rooms, sending the necessary information of the room name to the server. The redirecting code, which changes the location as well as storing it is as follows:

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

This segment of code gets the id of the image that was clicked on, and I set the IDs to be the names of the rooms for a better flow and understanding of the code. I then went back to the code of the individual games to work on the end conditions. I had some issues with the timer that I fixed with professor Mathura's help to ensure that the timer is decrementing correctly, and so the fixed code for the timer that I reached was as follows, where I had to separate the function into two different parts to ensure that the timer is accurate and only decrements once:

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

Also, to make the competition better, I also emitted the final order number of each player to the other player and had it printed on the screen so that each player knows how many meals they got and how many the other player got. For Tug of War end conditions, instead of setting the triangle to be far outside the screen, I made a condition that checks if the game is not on, and if not, then there won't be a rope on the screen at all, and I printed it outside of the P5 sketch. This is the condition that I set, which checks if the center point of the triangle has left the screen on either of the sides:

```
  if (pos.x < 0 || pos.x > windowWidth){
      gameOn = false;    
  }  
```



## Challenges 
* Tug of War --> resetting transparent background 
* Tug of War --> rope doesn't look like it's mobing
* D2 --> tray and css
* D2 --> removing items from the tray
* D2 --> timer


## Lessons and Next Steps

## References 
