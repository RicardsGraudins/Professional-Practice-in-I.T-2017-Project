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
6. Player Shoot & Collision Detection: The player can shoot and it hits the enemy a collision is detected - enemy "dies".
7. Documentation: Added documentation for overall project and commits 1-6.
8. Documentation: Additional documentation for commits 1-6.

##### How to run:
1. Have python, flask, flask-pymongo and bcrypt installed.
2. CD to the project and either python runme.py or py runme.py depending on your version of python.

#### Project Tasklist
- [x] Host locally on Flask
- [x] MongoDB: User can register/login
- [x] Background Canvas
- [x] Player & Enemy Movement
- [x] Player can shoot & collision detection for enemies
- [ ] Enemies can shoot & collision detection for player
- [ ] Classic mode
- [ ] 2 Boss fights
- [ ] Placeholder visuals replaced
- [ ] Menu
- [ ] Power ups
- [ ] Redis
- [ ] MySQL
- [ ] Customization
- [ ] Host on AWS EC2 Server

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
