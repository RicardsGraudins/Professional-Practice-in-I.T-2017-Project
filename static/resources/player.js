//gets a handle to the element with id background-canvas
var canvas = document.getElementById("player-canvas");
//gets a 2D context for the canvas
var context = canvas.getContext("2d");

var shotFired = true;
var score = 0;

var percentFire = .01;
var chance = 0;

function player (x,y,width,height,speed){
	this.x =x;
	this.y =y;
	this.width = width;
	this.height = height;
	this.speed = speed;
	
	playerBullet = new bullet(0, 0, 10);
	
	this.draw = function(){
		context.beginPath();
		context.rect(this.x,this.y,this.width,this.height);
		context.fillStyle = "DeepSkyBlue";
		context.fill();
		context.closePath();
	}//draw
	
	//if an arrow key is pressed: clear the canvas and depending on the button pressed modify player(x,y) and draw the object
	//if the object tries to go beyond the boundaries set, set (x,y) to keep the object within the canvas
	this.move = function(){
		if (KEY_STATUS.left || KEY_STATUS.right ||
			KEY_STATUS.down || KEY_STATUS.up) {
				
			//context.clearRect(0, 0, canvas.width, canvas.height);
			
			if (KEY_STATUS.left) {
				this.x -= this.speed
				if (this.x <= 10){ //aprox 10px from the left canvas edge
					this.x = 10;
				}//inner if
			}//if
			if (KEY_STATUS.right) {
				this.x += this.speed
				if (this.x >= canvas.width - 30){ //approx 10px from the right canvas edge
					this.x = canvas.width - 30;
				}//inner if
			}//if	
			if (KEY_STATUS.up) {
				this.y -= this.speed
				if (this.y <= 800){ //only allow the object to move up to (x,800)
					this.y = 800;
				}//inner if
			}//if	
			if (KEY_STATUS.down) {
				this.y += this.speed
				if (this.y >= canvas.height - 130){ //approx 10px from the bottom canvas edge
					this.y = canvas.height - 130;
				}//inner if
			}//if
		}//if
		playerObject.draw();
		//if space bar is pressed, set shotFired to true (triggers playerBullet.move inside init function) and if the bullet is off the canvas set it to player's location
		if (KEY_STATUS.space){
			shotFired = true;
			if (playerBullet.y < 0){
				playerBullet.x = this.x + 10;
				playerBullet.y = this.y + 5;
			}//inner if
		}//if
	}//move
}//player

//bullet object for player and enemy bosses
function bullet(x,y,r){
	this.x = x;
	this.y = y;
	this.r = r;
	
	this.draw = function(){
		context.beginPath();
		context.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
		context.fillStyle = "Cyan";
		context.fill();
		context.closePath();
	}//draw
	
	//move upwards 15 pixels
	this.move = function(){
		this.draw();
		this.y += -15;
	}//move
}//bullet

playerObject = new player(900,900,20,20,10);

function init(){
	context.clearRect(0, 0, canvas.width, canvas.height);
	playerObject.move();

	//only execute these functions if the object has not been hit by the player's bullet
	for (var i =0; i < 16; i++){
		if (enemiesMid[i].hit == 0){
			enemiesMid[i].move();
			enemiesMid[i].bulletY += 5;
			enemiesMid[i].checkCollision();
			enemiesMid[i].bulletMove();
			enemiesMid[i].bulletCollision();
		}//if
	}//for
	
	//execute these functions if the enemy is hit and has also fired a shot
	//without this loop the enemy bullet would disappear along with the hit enemy
	//only execute these functions if the bullet is in inside the canvas (bulletY < canvas.height) otherwise the bullet remains at 1080 y where it can do no harm
	for (i = 0; i < 16; i++){
		if(enemiesMid[i].hit == 1 && enemiesMid[i].bulletFired == 1){
			if(enemiesMid[i].bulletY < canvas.height){
				enemiesMid[i].bulletMove();
				enemiesMid[i].bulletY += 5;
				enemiesMid[i].bulletCollision();
			}//inner if
		}//if
	}//for
	
	//left enemies same idea as mid except all the bullet functions are inherited from abstract enemy
	for (i = 0; i < 8; i++){
		if (enemiesLeft[i].hit == 0){
			enemiesLeft[i].move();
			enemiesLeft[i].checkCollision();
			enemiesLeft[i].bulletMove();
			enemiesLeft[i].bulletCollision();
		}//if
	}//for
	
	for (i = 0; i < 8; i++){
		if(enemiesLeft[i].hit == 1 && enemiesLeft[i].bulletFired == 1){
			if(enemiesLeft[i].bulletY < canvas.height){
				enemiesLeft[i].bulletMove();
				enemiesLeft[i].bulletCollision();
			}//inner if
		}//if
	}//for
	
	//right enemies same idea as mid except all the bullet functions are inherited from abstract enemy
	for (i = 0; i < 8; i++){
		if(enemiesRight[i].hit == 0){
			enemiesRight[i].move();
			enemiesRight[i].checkCollision();
			enemiesRight[i].bulletMove();
			enemiesRight[i].bulletCollision();
		}//if
	}//for
	
	for (i = 0; i < 8; i++){
		if(enemiesRight[i].hit == 1 && enemiesRight[i].bulletFired == 1){
			if(enemiesRight[i].bulletY < canvas.height){
				enemiesRight[i].bulletMove();
				enemiesRight[i].bulletCollision();
			}//inner if
		}//if
	}//for
	
	
	if (shotFired == true){
		playerBullet.move();
	}//if
	
	//draw the score on the canvas
	drawScore();
	
	window.requestAnimationFrame(init);
}//init

//the keycodes that will be mapped when a user presses a button
//original code by doug mcinnes https://github.com/dmcinnes/HTML5-Asteroids/blob/master/game.js
KEY_CODES = {
  32: 'space',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down'
}//KEY_CODES

//creates the array to hold the KEY_CODES and sets all their values to false 
//checking true/flase is the quickest way to check status
//of a key press and which one was pressed when determining
//when to move and which direction
KEY_STATUS = {};
for (code in KEY_CODES) {
  KEY_STATUS[ KEY_CODES[ code ]] = false;
}//for

//sets up the document to listen to onkeydown events (fired when
//any key on the keyboard is pressed down) when a key is pressed,
//it sets the appropriate direction to true to let us know which key it was
 
document.onkeydown = function(e) {
  //firefox and opera use charCode instead of keyCode to return which key was pressed
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
	e.preventDefault();
	KEY_STATUS[KEY_CODES[keyCode]] = true;
  }//if
}//onkeydown

//sets up the document to listen to ownkeyup events (fired when
//any key on the keyboard is released). When a key is released,
//it sets the appropriate direction to false to let us know which key it was
document.onkeyup = function(e) {
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
	e.preventDefault();
	KEY_STATUS[KEY_CODES[keyCode]] = false;
  }//if
}//onkeyup

//----------------------------
//abstract function
function enemy(){
	this.spawn = function(){}
	this.move = function(){}
	
	this.checkCollision = function(){
		//vertical and horizontal distance between the circle's center and the rectangle's center
		//this is for mid and left because they are rectangles and the playerBullet is a circle
		var distX = Math.abs(playerBullet.x - this.x-this.width/2);
		var distY = Math.abs(playerBullet.y - this.y-this.height/2); 
		
		//if the distance is less than half rectangle then they are colliding
		if ((distX <= (this.width/2)) && (distY <= (this.height/2))){
			this.hit = 1;
			shotFired = false;
			playerBullet.y = -500;
			score = score + 100;
		}//if
	}//checkCollision
	
	//draw the bullet
	this.bulletSpawn = function(){
		context.beginPath();
		context.arc(this.bulletX, this.bulletY, 5, 0, 2 * Math.PI);
		context.fillStyle = "DeepPink";
		context.fill();
		context.closePath();
	}//bulletSpawn
	
	//everytime this function is executed theres a chance this.bulletFired gets set to 1 unless its already set to 1
	//once this.bulletFired is set to 1 draw the bullet as it moves across the canvas until it goes off the canvas, then set bulletFired back to 0
	//same for left and right, different function for mid because they shoot at the same time
	this.bulletMove = function(){
		chance = Math.floor(Math.random()*101);
		if (this.bulletFired == 0 && (chance/100 < percentFire)){
			this.bulletY = this.y + 25; //its necessary to set bulletX and bulletY here because
			this.bulletX = this.x + 10; //without them the first bullet that spawns would spawn at the passed bulletX and bulletY
			this.bulletSpawn();
			this.bulletFired = 1;
		}//if
		
		if (this.bulletFired == 1){
			this.bulletY += 5;
			this.bulletSpawn();
			if (this.bulletY > canvas.height){
				//set this.bulletFired to 0 so that it is not spawned right away - repeat the chance calculation
				this.bulletFired = 0;
			}//inner if
		}//if
	}//bulletMove
		
	//collision detection for an enemy bullet hitting the player object
	this.bulletCollision = function(){
		//vertical and horizontal distance between the circle's center(bullet) and the rectangle's center(player)
		var distX = Math.abs(this.bulletX - playerObject.x - playerObject.width/2);
		var distY = Math.abs(this.bulletY - playerObject.y - playerObject.height/2);
		
		//if the distance is less than half rectangle then they are colliding
		if ((distX <= (playerObject.width/2)) && (distY <= (playerObject.height/2))){
			console.log("Player hit!");
		}//if
	}//bulletCollision
}//enemy

//enemies mid
function mid(x, y, dx, dy, width, height, left, right, hit, bulletX, bulletY, bulletFired){
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.width = width;
	this.height = height;
	this.left = left;
	this.right = right;
	this.hit = hit;
	this.bulletX = bulletX;
	this.bulletY = bulletY;
	this.bulletFired = bulletFired;
	
	this.spawn = function(){
		context.beginPath();
		context.rect(this.x,this.y,this.width,this.height);
		context.fillStyle = "yellow";
		context.fill();
		context.closePath();
	}//spawn
	
	this.move = function() {
		this.spawn();
		
		//move along y axis until at 100 y
		if (this.y != 100){
			this.y += this.dy;
		}//if
		
		//if y == 100 then start moving right until right boundary is reached, change dx to go left until left boundary is reached then reverse dx and so on
		if (this.y == 100){
			this.x += this.dx;
			if(this.x + this.dx > canvas.width - this.right || this.x + this.dx < 0 + this.left) {
				this.dx = -this.dx;
			}//inner if
		}//if
	}//move
	
	//overwriting enemy move function - these enemies fire at the same time
	this.bulletMove = function(){
		
		if (this.bulletFired == 0){
			this.bulletSpawn();
			this.bulletFired = 1;
		}//if
		
		if (this.bulletFired == 1){
			this.bulletSpawn();
			//this.bulletY += 5;
			
			if (this.bulletY > canvas.height){
				this.bulletY = this.y + 25;
				this.bulletX = this.x + 10;
				this.bulletFired = 0;
			}//inner if
		}//if
	}//bulletMove
}//mid

//enemies on the left will continuously move to the right until they are off the canvas and then spawn a bit off the canvas on the left and move right until destroyed
function left(x, y, dx, dy, width, height, hit, bulletX, bulletY, bulletFired){
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.width = width;
	this.height = height;
	this.hit = hit;
	this.bulletX = bulletX;
	this.bulletY = bulletY;
	this.bulletFired = bulletFired;
	
	this.spawn = function(){
		context.beginPath();
		context.rect(this.x,this.y,this.width,this.height);
		context.fillStyle = "red";
		context.fill();
		context.closePath();
	}//spawn
	
	this.move = function() {
		this.spawn();
		
		this.x += this.dx;
		if(this.x + this.dx > canvas.width) {
			this.x = -20;
		}//inner if
	}//move
}//left

//enemies on the right will continuously move to the left until they are off the canvas and then spawn a bit off the canvas on the right and move left until destroyed
function right(x, y, dx, dy, r, hit, bulletX, bulletY, bulletFired){
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.r = r;
	this.hit = hit;
	this.bulletX = bulletX;
	this.bulletY = bulletY;
	this.bulletFired = bulletFired;
	
	this.spawn = function(){
		context.beginPath();
		context.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
		context.fillStyle = "blue";
		context.fill();
		context.closePath();
	}//spawn
	
	this.move = function() {
		this.spawn();
		
		this.x -= this.dx;
		if(this.x + this.dx < 0) {
			this.x = canvas.width + 20;
		}//inner if
	}//move
	
	//overwriting enemy checkCollision function because unlike mid and left this is a circle
	this.checkCollision = function(){
		//horizontal and vertical distance between 2 circles
		var colX = playerBullet.x - this.x;
		var colY = playerBullet.y - this.y;
		
		//distance between 2 circle center points
		var distance = Math.sqrt(Math.pow(colX,2) + Math.pow(colY,2));
		
		//if distance is less than the two radii added togather
		if (distance <= playerBullet.r + this.r){
			//console.log("Collision Right!");
			this.hit = 1;
			shotFired = false;
			playerBullet.y = -500;
			score = score + 100;
		}//if
	}//checkCollision
}//right

//draw score on canvas
function drawScore() {
	context.font = "16px sans-serif";
	context.fillStyle = "green";
	context.fillText("SCORE: " + score, 10, 20);
}//drawScore

//increment score by 1 (window.setInterval(incrScore, 3000);) every 3 seconds
function incrScore(){
	score = score + 1;
}//incrScore

mid.prototype = new enemy();
left.prototype = new enemy();
right.prototype = new enemy();

//initializing enemies mid
var enemiesMid = {};
var howManyMid = 8;
var xMid = 800;
var leftMid = 100;
var rightMid = 500;
var q = 8;

for (var e = 0; e < howManyMid; e++){
	enemiesMid[e] = new mid(xMid, -50, 2, 2, 40, 40, leftMid, rightMid, 0, -50, -50, 0);
	enemiesMid[q] = new mid(xMid, 0, 2, 2, 40, 40, leftMid, rightMid, 0, -50, -50, 0);
	xMid = xMid + 50;
	leftMid = leftMid + 50;
	rightMid = rightMid - 50;
	q++;
}//for

//initializing enemies on the left
enemiesLeft = {};
xLeft = -400;

for (var el = 0; el < 8; el++){
enemiesLeft[el] = new left(xLeft, 250, 2, 2, 20, 20, 0, 0, 0, 0);
xLeft = xLeft + 50;
}//for

//initializing enemies on the right
enemiesRight = {}
xRight = canvas.width + 400;

for (var er = 0; er < 8; er++){
enemiesRight[er] = new right(xRight, 350, 2, 20, 20, 0, 0, 0, 0);
xRight = xRight - 50;
}//for

window.setInterval(incrScore, 3000);
init();