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

To make sure that I have a functioning game, I started off by making it for one player and making sure that the logic is correct before I start emitting information. I started off by creating the basic and initializing the necessary divs. I wasn't sure how I would like the food menu items to be presented but decided to make it as a table so that it's intuitive and easy to follow when the order is displayed. I then created arrays for each of the food categories and found images of dishes that are sold in D2 with transparent backgrounds. I also made an order button to display an order consisting of an appetizer, main course, and dessert as well as another button to submit an order. The game mechanism is as follows: the user presses on the order button, the order gets displayed, and then, as fast as they can, they click on these 3 items on the menu, have them displayed on the tray, and then they can submit. When they do, I then check if the order is correct. To do this, I initialized 3 variables, 1 for each of the order items, and 3 variables, 1 for each of the user's chosen items. I then randomized the order item from the given arrays and stored them in these values. Later on, when the user clicks on the food item from the menu, the JS then tracks the click, gets the class name of the dish, gets the key, or dish name from the value of the array and stores it in the chosen dish variable. An example of this is as follows, this stores the name of the food item:  

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
This is the final code for this section as I later built on it, and will discuss it later in the documentation. But what this code segment does, is that it checks if each of the order items and chosen items are the same, and in that case, increments the number of completed orders to keep track of the score, print it and emit such information to the other user, and remove all items from the tray while generating a new order so that the same cycle would start again. I also worked on the styling to make sure that this is the design that I am set on. 

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



## Challenges 
* Tug of War --> resetting transparent background 
* Tug of War --> rope doesn't look like it's mobing


## Lessons and Next Steps

## References 
