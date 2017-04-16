# Galaxian
This repository contains code and information for my third-year undergraduate project for the module **Professional Practice in I.T.** The module is taught to undergraduate students at [GMIT](http://www.gmit.ie/) in the Department of Computer Science and Applied Physics. The lecturer is Damien Costello and this project is supervised by [Ian McLoughlin](https://ianmcloughlin.github.io/).

This project revolves around the creation of my own variation of the arcade game [Galaxian 1979](https://en.wikipedia.org/wiki/Galaxian).
![Design Plan](https://github.com/RicardsGraudins/Professional-Practice-in-I.T-2017-Project/blob/master/Documentation/Design%20Graph.png)
The game is to be developed using the [Flask](http://flask.pocoo.org/) framework to host the game locally and provide templates for user login, high scores, game modes and customization. User login information is stored using [MongoDB](http://searchdatamanagement.techtarget.com/definition/MongoDB) over at [mlab.com](https://mlab.com/) which is a cloud database service that hosts MongoDB databases. Successful user authentication allows access to the customization template which allows the user to modify certain parts of the game, primarily the player's spaceship. [Redis](https://redis.io/) is used to store player's high score and the user has the option of saving that high score which is stored on a MYSQL database and then displayed on the high score template. Once the project is complete it will be hosted on an [AWS] EC2 Server which will allow users remote access to the game.

##### Commit Summary:
1. Flask Setup: Project runs on localhost.
2. MongoDB Login: User can register/login, data stored on mlab.com
3. Background Canvas: Added background space animation.
4. Player Canvas: The player can move on the canvas.
5. Enemy Movement: Several enemies spawn and move on the canvas.
6. Player Shoot & Collision Detection: The player can shoot and it hits the enemy a collision is detected - enemy "dies".
7. Documentation: Added documentation for overall project and commits 1-6.

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

Login template, the method is POST. If the username exists in the database then check if the correct password is entered, if the password is correct create a session and direct to profile. If invalid data is entered a flash occurs that says "Wrong username/password!". The user is free to attempt to login endlessly and ideally there should be a timeout after a few invalid login attempts but it is not really necessary for this application as there is no **super private** being stored.

Profile template, if this template is attempted to be accessed without a saved session then it redirects the user to the login page. There are 3 links on this template which when clicked routes the user to one of the following functions change email, delete account or log out inside runme.py.
