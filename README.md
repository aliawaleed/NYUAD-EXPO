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


## Challenges 

## Lessons and Next Steps

## References 
