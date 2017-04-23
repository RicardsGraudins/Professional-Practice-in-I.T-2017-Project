# Galaxian
This repository contains code and information for my third-year undergraduate project for the module **Professional Practice in I.T.** The module is taught to undergraduate students at [GMIT](http://www.gmit.ie/) in the Department of Computer Science and Applied Physics. The lecturer is Damien Costello and this project is supervised by [Ian McLoughlin](https://ianmcloughlin.github.io/).

This project revolves around the creation of my own variation of the arcade game [Galaxian 1979](https://en.wikipedia.org/wiki/Galaxian).
![Design Plan](https://github.com/RicardsGraudins/Professional-Practice-in-I.T-2017-Project/blob/master/Documentation/Design%20Graph.png)
The game is to be developed using the [Flask](http://flask.pocoo.org/) framework to host the game locally and provide templates for user login, high scores, game modes and customization. User login information is stored using [MongoDB](http://searchdatamanagement.techtarget.com/definition/MongoDB) over at [mlab.com](https://mlab.com/) which is a cloud database service that hosts MongoDB databases. Successful user authentication allows access to the customization template which allows the user to modify certain parts of the game, primarily the player's spaceship. [Redis](https://redis.io/) is used to store player's high score and the user has the option of saving that high score which would be stored on a MYSQL database and then displayed on the high score template. Once the project is complete it will be hosted on an [AWS](https://aws.amazon.com/) EC2 Server which will allow users remote access to the game.

##### Commit Summary:
1. Flask Setup: Project runs on localhost.
2. MongoDB Login: User can register/login, data stored on mlab.com
3. Background Canvas: Added background space animation.
4. Player Canvas: The player can move on the canvas.
5. Enemy Movement: Several enemies spawn and move on the canvas.
6. Player Shoot & Collision Detection: The player can shoot and when it hits an enemy a collision is detected - enemy "dies".
7. Documentation: Added documentation for overall project and commits 1-6.
8. Documentation: Additional documentation for commits 1-6.
9. Score, Enemy Shoot & Collision Detection: Score implemented, enemies can shoot and collision detected when they hit the player.
10. Menus, Boss Fight, Endless Waves & Power Ups: Implemented main menu and death menu, a boss fight, endless waves and a score power up.
11. Added Audio and Sprites: Added music, sound effects and sprites to every object.
12. Documentation: Added documentation for commits 9-11.
13. High Scores and Template Update: MongoDB now stores score and templates have been modified.
14. Documentation: Added documentation for commit 13.

##### How to run:
1. Have python, flask, flask-pymongo and bcrypt installed.
2. CD to the project and either python runme.py or py runme.py depending on your version of python.

##### Hosted on AWS:
The game is currently hosted on an AWS EC2 Server at the following address http://52.26.150.224:5000/. Keep in mind that it is not the fastest server and takes a while to load and when it does load it may take some time to load in music, sprites etc. Steps taken to host on AWS:  
1. Follow the AWS [guidelines](http://docs.aws.amazon.com/AWSEC2/latest/WindowsGuide/connecting_to_windows_instance.html) to create and connect to the server.
2. Make the server accessable remotely by enabling port 80 HTTP and port 443 HTTPS on the AWS website.
3. Make sure all outbound traffic is set to 0.0.0.0/0 on the AWS website.
4. Inside the AWS instance access windows firewall and enable ports 80 and 443.
5. Install a version of python e.g. [Python 3.5.2](https://www.python.org/downloads/release/python-352/) and add to path.
6. Inside the console type:
> pip install flask   
> pip install flask-pymongo   
> pip install bcypt   
7. Modify runme.py to run it on port 5000 
> app.run(host='0.0.0.0', debug=True, port=5000) 
8. Open port 5000 on the AWS website.
9. Open port 5000 inbound and outbound on the instance.
10. Using console CD to the project directory and run the application by typing
> python runme.py 

#### Project Tasklist
- [x] Host locally on Flask
- [x] MongoDB: User can register/login
- [x] Background Canvas
- [x] Player & Enemy Movement
- [x] Player can shoot & collision detection for enemies
- [x] Enemies can shoot & collision detection for player
- [x] Classic mode
- [x] 2 Boss fights
- [x] Placeholder visuals replaced
- [x] Audio
- [x] Menu
- [x] Power ups
- [x] Score
- [x] Endless Waves
- [ ] Redis
- [ ] MySQL
- [ ] Customization
- [x] Host on AWS EC2 Server

#### Documentation
#### Commits 1-6
Flask - runme.py  
runme.py contains all the necessary code to run the application locally, mlab connection information, template routes and the code necessary to login/register with several features available for the logged in user.

Registration takes place on the register template - if the method is POST, check for username in database, if the username does not exist then add the record to the database. The password is hashed using bcrypt for security and the hashpash value is stored on the database. If registration goes successfully then the user is logged in, a session is created and the user is redirected to profile. If the method is GET then return the register template to the user.

Login template, the method is POST. If the username exists in the database then check if the correct password is entered, if the password is correct create a session and direct to profile. If invalid data is entered a flash occurs that says "Wrong username/password!". The user is free to attempt to login endlessly and ideally there should be a timeout after a few invalid login attempts but it is not really necessary for this application as there is no **super private** information being stored.

Profile template, if this template is attempted to be accessed without a saved session then it redirects the user to the login page. There are 3 links on this template which when clicked routes the user to one of the following functions change email, delete account or log out inside runme.py.

Logout function, when the user clicks on the logout button on the profile template - pop the session and redirect the user.

Delete account function, when the user clicks on the delete account button on the profile template - remove the record from the database and pop the session.

Change email function, when the user clicks on the change email button on the profile template, routes the user to the change email template. If the user is logged in and the method is POST then locate the user inside the database, change the email, save it and flash the message "Email Changed!". If the user is logged in and the method is GET return the template change email. If the user is not logged go to the login template.

Game page - game.html     
This is the template that displays the game. It has two canvas and loads the scripts background.js and player.js. 

Background Canvas - background.js  
This script is designed to display the vast universe by animating stars movement, this gives the illusion the player is traversing space. The array stars is populated by star objects defined by the howMany variable. The function update occurs every 1 second and clears the canvas and then proceeds to draw every star inside the array. Every star has a draw function and utilising the function getRandom, every star gets a random fall speed(movement along y axis), random radius and a different color. The different color is generated at random using the values inside the array colorrange to get hue and saturation while luminosity is constant at 88% which keeps the stars predominately white to look bright. The values selected for hue and saturation aim to avoid the color green.

Player Canvas - player.js  
This script contains all the code for the game.

init function  
The init function's purpose is to control animation. It is the only function that clears the canvas and it triggers player and enemy functions such as move and check collision. The init function starts as soon as the game template is loaded and it uses the requestAnimationFrame() to execute animation.

Player Movement  
The player is represented by the object playerObject. This object has 2 main functions, draw which draws the player on the screen, and the move function that changes (x,y) cords of the player when one of the arrow keys is pressed. The document is set up in such a way that it listens to onkeydown events for the arrow keys and space bar, when one of the arrow keys is pressed (also set up to allow the player to move right/left and up/down simultaneously) the player's position changes and the player object is redrawn. The playerQuery.js script is an alternative for player movement which uses jQuery to listen to onkeydown events however it is has choppy animation and is only provided to show code written for this project.

Player Shoot & Enemy Collision  
Just like the classic game, the player can only shoot one bullet at a time which must either hit an enemy or go outside the canvas to be redrawn. When space bar is pressed shotFired is set to true and the bullet fires from the player's location and flies vertically, if the bullet hits an enemy a collision is detected(shotFired = false) and that particular enemy is no longer drawn, the bullet stops moving and is redrawn at the y cord -500 which is outside the canvas where it sits and waits for space bar to be pressed in order to be redrawn at the player's location and start moving vertically again. The bullet has to be drawn outside the canvas where it cannot collide with any enemy because even if the bullet is not moving or drawn, it's cords are still tracked and it can collide with enemies that move into it if it is inside the canvas. Enemies have a function checkCollision which contains a formula to determine if the player bullet collides and this function executes inside the init function whenever the enemy object moves. If an enemy object collides with the bullet then that particular enemy's parameter "hit" is set to 1 and when that happens the enemy "dies" or in other words is no longer drawn or checked for a collision.

Enemy Movement  
At the moment there are 3 types of enemies - mid, right and left enemies. At the start of the game these objects are loaded into arrays respectively and are spawned off canvas and move into it. The main difference between them is how they move and are positioned. Left enemies continuously move right until they go off the canvas and are then spawned off canvas to the left. Likewise right enemies continuously move left until they go off the canvas and are then spawned off canvas to the right. Mid enemies spawn off canvas at the top and move down until at the y cord 100, afterwards they move right until they hit their right boundary then left until they hit their left boundary and so on.

Most of the objects so far are initiated and stored in arrays. Though repetitive, it is a vital part of the game as it reuses objects instead of creating new ones, as creating new objects for various situations such as enemies going off canvas would eventually make the game very laggy and lead to the browser storing too much data and eventually crashing.

#### Commits 9-11
Score  
The player recieves +1 score every 3 seconds for staying alive, +100 score per enemy killed and +100 score for every hit landed on bosses. The purpose of score is to compare how long a player can survive and will be used as currency for customization.

Enemy Shoot & Player Collision  
The right and left enemies each have a chance to fire a single bullet everytime they move, when the bullet goes outside the canvas bulletFired is set to 0 and the enemy repeats the chance calculation to fire the next shot. Unlike right and left enemies, the mid enemies are co-ordinated therefore they all fire at the same time. Everytime a bullet moves the function bulletCollision executes which determines if a collision between the player and an enemy bullet occurs. If an enemy has fired a bullet and is killed before the bullet goes off the canvas, the functions bulletMove and bulletCollision still execute until the bullet goes off the canvas.

Boss Fight  
The first boss fight of the game is inspired by Terraria's [The Twins](http://terraria.gamepedia.com/The_Twins). The boss fight begins when the player has defeated the first 2 waves of enemies, the twins immediately spawn and start bouncing around the canvas and bouncing off of each other and at the moment that is their main boss mechanic. Their second mechanic that is yet to be implemented, revolves around an object pool consisting of bullet objects, the twins should have their own object pool and fire bullets in various patterns that differs from each other. If one of the twins collide with the player its game over, if the twins collide with each other 3 times phase 2 begins. In phase 2 3 enemies spawn that are called leviathans, each leviathan has 10 health and their shooting pattern is the same as mid enemies that all fire at the same time. Each leviathan has an array of 8 bullets and functions moveDown and bulletCollision are executed on every bullet. Additional features for phase 2 are to be implemented including regular enemies spawning randomly and special abilities for leviathans to make the phase more chaotic. When all 3 leviathans are defeated an outline of the twins is drawn indicating where they will appear in the next 5 seconds. Phase 1 begins once again and if they collide with each other 3 times phase 2 starts. If phase 2 occurs more than twice the twins go on a rampage and become near unstoppable(to be implemented).

Power ups  
There is only 1 power up at the moment and it gives +2000 score when picked up. It spawns only once and it is after the twins are defeated, once picked up endless mode begins. The second power up that is not yet implemented allows the player to shoot multiple bullets. Steps to creating this power up involves having an object pool of objects where unused objects are grabbed from the back of the array and pushed to the front of the array. When using an object, if the object is ready to be removed, it splices the array and pushes the object to the back to be reusued. If the last item in the array is in use, the pool is full.

Endless Waves  
Endless waves of enemies begin to spawn after the first two waves of enemies are defeated, the twins are defeated and the coin power up is picked up. At the moment only mid, right and left enemies spawn in an endless loop until the player is shot down.

Menus  
The main menu is accessed when the user accesses the game template page and then later through the game over menu. The main menu provides 3 options: Play, to start the game, Github, to visit the github page and login. The game over menu is displayed once the player is defeated and it displays the score, a restart button, an upload button to upload score and a menu button to go back to the main menu.

Audio and Sprites  
Music and sound effects have been added to the game that are played using the new [HTML5 audio](https://www.w3schools.com/html/html5_audio.asp) tag and it gets the job done reasonably well for firefox, chrome and opera browsers. The .wav sound effects do not work on internet explorer as the .wav format is not supported. Placeholder sprites have been added to all the objects. The sprites are drawn inside the object hitbox (circles/rectangles) and the object hitbox have all been set to transparent to only display the sprite. Collision detection remains as it was between the object [hitboxes](https://gaming.stackexchange.com/questions/1239/what-is-a-hit-box) and not the images themselves, more complex hitboxes can be implemented however it is not necessary for this game.

#### Commit 13
Templates & Score
All templates have been modified to look more appealing. The game over menu now has a functioning upload button that takes the score achieved in the most recent game and overwrites the score stored in MongoDB for the logged in user. If the upload button is pressed while the user is not logged in, the login template is loaded. The high score template can be accessed if the user is logged in and it currently displays 3 things, the user's score, the highest score and the lowest score. The highest and lowest scores are currently displayed as cursor data and the template will be updated later to display only the top 10 scores. The game is also hosted on an AWS EC2 Server at the following address http://52.26.150.224:5000/ for more information look at the "Hosted on AWS" section on this README.
