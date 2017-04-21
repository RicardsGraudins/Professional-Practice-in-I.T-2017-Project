//gets a handle to the element with id background-canvas
var canvas = document.getElementById("player-canvas");
//gets a 2D context for the canvas
var context = canvas.getContext("2d");

var shotFired = true;
var score = 0;
var percentFire = .01;
var chance = 0;
var bossPoints = 0;

var img = document.getElementById("coin");

function player (x, y, width, height, speed, hit){
	this.x =x;
	this.y =y;
	this.width = width;
	this.height = height;
	this.speed = speed;
	this.hit = hit;
	
	playerBullet = new bullet(0, 0, 10, 0);
	
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
function bullet(x,y,r,bulletFired){
	this.x = x;
	this.y = y;
	this.r = r;
	this.bulletFired = bulletFired;
	
	this.draw = function(){
		context.beginPath();
		context.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
		context.fillStyle = "Cyan";
		context.fill();
		context.closePath();
	}//draw
	
	//move upwards 15 pixels - used for playerBullet
	this.move = function(){
		this.draw();
		this.y += -15;
	}//move
	
	//move downwards 5 pixels - used for enemy bullets
	this.moveDown = function(){
		this.draw();
		this.y += 5;
		this.bulletFired = 1;
	}//moveDown
	
	//enemy bullet collision with playerObject
	this.bulletCollision = function(){
		var distX = Math.abs(this.x - playerObject.x - playerObject.width/2);
		var distY = Math.abs(this.y - playerObject.y - playerObject.height/2);
		
		//if the distance is less than half playerObject - collision
		if ((distX <= (playerObject.width/2)) && (distY <= (playerObject.height/2))){
			//console.log("Player hit!");
			gameOver();
		}//if
		
		//using pythagoras theorem to compare the distance between bullet and playerObject centers
		var ax = distX - playerObject.width /2;
		var ay = distY - playerObject.height /2;
		if (ax * ax + ay * ay <= (this.r * this.r)){
			//console.log("Corner hit!");
			gameOver();
		}//if
	}//bulletCollision
	
	//used by the leviathan objects to draw the bullet and detect collision
	//used when the leviathan object has taken 10 shots from the player
	//necessary to keep the bullet from disappearing when the leviathan is dead
	//if the bullet is fired execute functions, once the bullet is outside the canvas set bulletFired = 0
	this.hitAndBulletFired = function(){
		if(this.bulletFired == 1){
			this.moveDown();
			this.bulletCollision();
			
			if(this.y > canvas.height){
				this.bulletFired = 0;
			}//inner if
		}//if
	}//hitAndBulletFired
}//bullet

playerObject = new player(900,900,20,20,10,0);

var leviX = 0;
var wavesKilled = 0;
var enemiesHit = 0;

function init(){
	context.clearRect(0, 0, canvas.width, canvas.height);
	playerObject.move();
	
	//player shot fired
	if (shotFired == true){
		playerBullet.move();
	}//if
	
	//draw score
	drawScore();
	
	//if waves killed < 2 or > 2 spawn enemies mid,right and left
	if (wavesKilled < 2 || wavesKilled > 2){
	
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
	}//waves killed < 2 or > 2
	
	//if the player hits 32 enemies increment wavesKilled and reset mid, right and left enemies
	if(enemiesHit == 32){
		wavesKilled++;
		resetEnemies();
	}//if
	
	//if wavesKilled == 2 and bossPoints are < 3 spawn the bosses
	if (wavesKilled == 2){
		if (bossPoints < 3){
		//if b1 and b2 arent dead execute the bossCollision function
		//after one of them is dead there is no need to determine if they collide with each other
		//check which boss is alive and execute functions for that boss
			if (b1.hp > 0 && b2.hp > 0){
				bossCollision();
			} else if (b1.hp > 0){
				b1.draw();
				b1.checkCollision();
				b1.checkCollisionPlayer();
			} else if (b2.hp > 0){
				b2.draw();
				b2.checkCollision();
				b2.checkCollisionPlayer();
			} else {
				if (goldPowerUp.hit == 0){
					goldPowerUp.move();
					goldPowerUp.drawImage();
					goldPowerUp.checkCollisionPlayer();
				}
			}
		}//bosspoints
		
		//if both bosses are dead and the gold coin is picked up increment wavesKilled to spawn endless enemies
		if (b1.hp == 0 && b2.hp == 0 && goldPowerUp.hit == 1){
			wavesKilled++;
		}//if
		
		//if boss points == 3 (if the bosses collide with each other 3 times) the leviathans become active
		if (bossPoints == 3){
			//if leviathanA has not been hit 10 times by the player execute functions
			if (leviathanA.hit < 10){
				leviathanA.move();
				leviathanA.checkCollision();
			
				//animate bullets stored in the leviA array
				for (var i =0; i < 8; i++){
					leviA[i].moveDown();
					leviA[i].bulletCollision();
					
					//if a bullet goes outside the canvas set (x,y) cords for the bullet
					//the variable leviX makes the bullets spawn apart instead of overlapping
					if (leviA[i].y > canvas.height){
						leviA[i].x = leviathanA.x + leviX;
						leviA[i].y = leviathanA.y + 60;
						leviX = leviX + 50;
						
						if (leviX == 350){
							leviX = 0;
						}//inner if
					}//if
				}//for
			}//leviathanA
	
			//if leviathanB has not been hit 10 times by the player execute functions
			if (leviathanB.hit < 10){
				leviathanB.moveRight();
				leviathanB.checkCollision();
			
				//animate bullets stored in the leviB array
				for (var i =0; i < 8; i++){
					leviB[i].moveDown();
					leviB[i].bulletCollision();
				
					if (leviB[i].y > canvas.height){
						leviB[i].x = leviathanB.x + leviX;
						leviB[i].y = leviathanB.y + 60;
						leviX = leviX + 50;
					
						if (leviX == 350){
							leviX = 0;
						}//inner if
					}//if
				}//for
			}//leviathanB
	
			//if leviathanC has not been hit 10 times by the player execute functions
			if (leviathanC.hit < 10){
				leviathanC.moveLeft();
				leviathanC.checkCollision();
			
				//animate bullets stored in the leviC array
				for (var i =0; i < 8; i++){
					leviC[i].moveDown();
					leviC[i].bulletCollision();
					
					if (leviC[i].y > canvas.height){
						leviC[i].x = leviathanC.x + leviX;
						leviC[i].y = leviathanC.y + 60;
						leviX = leviX + 50;
						
						if (leviX == 350){
							leviX = 0;
						}//inner if
					}//if
				}//for
			}//leviathanC
	 
	
			//if leviathanA has been hit 10 times execute hitAndBulletFired()
			//this is to prevent the bullets from disappearing when the leviathanA is dead
			if (leviathanA.hit == 10){
				for( i = 0; i < 8; i++){
					leviA[i].hitAndBulletFired();
				}//for
			}//if
		
			//if leviathanB has been hit 10 times execute hitAndBulletFired()
			//this is to prevent the bullets from disappearing when the leviathanB is dead
			if (leviathanB.hit == 10){
				for( i = 0; i < 8; i++){
					leviB[i].hitAndBulletFired();
				}//for
			}//if
		
			//if leviathanC has been hit 10 times execute hitAndBulletFired()
			//this is to prevent the bullets from disappearing when the leviathanC is dead
			if (leviathanC.hit == 10){
				for( i = 0; i < 8; i++){
					leviC[i].hitAndBulletFired();
				}//for
			}//if
	
			//if all 3 leviathans have been hit 10 times each draw the outline of b1 and b2 objects
			//drawing the outline warns the player where the bosses will spawn
			if (leviathanA.hit == 10 && leviathanB.hit == 10 && leviathanC.hit == 10){
				b1.drawOutline();
				b2.drawOutline();
				//wait 5 seconds for the final leviathan bullets to go outside the canvas
				window.setTimeout(resetLeviathans, 5000);
			}//if
	
		}//bossPoints ==3
	}//waveskilled
	
	//if the player has not been hit request a new animation frame
	if(playerObject.hit == 0){
	window.requestAnimationFrame(init);
	}//if
}//init

//reset the leviathans A, B and C
function resetLeviathans(){
	leviathanA.hit = 0;
	leviathanB.hit = 0;
	leviathanC.hit = 0;
	leviathanA.x = 800;
	leviathanA.y = -50;
	leviathanB.x = 0;
	leviathanB.y = -150;
	leviathanC.x = canvas.width - 300;
	leviathanC.y = -150;
	bossPoints = 0;
}//resetLeviathans

//reset enemies mid,right and left
function resetEnemies(){
	xLeft = -400;
	xRight = canvas.width + 400;
	enemiesHit = 0;
	
	xMid = 800;
	leftMid = 100;
	rightMid = 500;
	q = 8;
	
	for (el = 0; el < 8; el++){
		enemiesLeft[el].x = xLeft;
		enemiesLeft[el].hit = 0;
		enemiesLeft[el].bulletFired = 0;
		enemiesLeft[el].bulletX = 0;
		enemiesLeft[el].bulletY = 0;
		xLeft = xLeft + 50;
	}//for
	
	for (er = 0; er < 8; er++){
		enemiesRight[er].x = xRight;
		enemiesRight[er].hit = 0;
		enemiesRight[er].bulletFired = 0;
		enemiesRight[er].bulletX = 0;
		enemiesRight[er].bulletY = 0;
		xRight = xRight - 50;
	}//for
	
	for (e = 0; e < howManyMid; e++){
		enemiesMid[e].x = xMid;
		enemiesMid[e].y = -50;
		enemiesMid[e].left = leftMid;
		enemiesMid[e].right = rightMid;
		enemiesMid[e].hit = 0;
		enemiesMid[e].bulletFired = 0;
		enemiesMid[e].dx = 2;
		enemiesMid[e].bulletX = -50;
		enemiesMid[e].bulletY = -50;
		
		enemiesMid[q].x = xMid;
		enemiesMid[q].y = 0;
		enemiesMid[q].left = leftMid;
		enemiesMid[q].right = rightMid;
		enemiesMid[q].hit = 0;
		enemiesMid[q].bulletFired = 0;
		enemiesMid[q].dx = -2;
		enemiesMid[q].bulletX = -50;
		enemiesMid[q].bulletY = -50;
		
		xMid = xMid + 50;
		leftMid = leftMid + 50;
		rightMid = rightMid - 50;
		q++
	}//for
}//resetEnemies

function resetPlayer(){
	playerObject.x = 900;
	playerObject.y = 900;
	playerObject.hit = 0;
}//resetPlayer

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

//abstract function enemy
function enemy(){
	this.spawn = function(){}
	this.move = function(){}
	
	//draw the bullet
	this.bulletSpawn = function(){
		context.beginPath();
		context.arc(this.bulletX, this.bulletY, 5, 0, 2 * Math.PI);
		context.fillStyle = "DeepPink";
		context.fill();
		context.closePath();
	}//bulletSpawn
	
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
			enemiesHit++;
		}//if
	}//checkCollision
	
	//everytime this function is executed theres a chance this.bulletFired gets set to 1 unless its already set to 1
	//once this.bulletFired is set to 1 draw the bullet as it moves across the canvas until it goes off the canvas, then set bulletFired back to 0
	//same for left and right enemies, different function for mid because they shoot at the same time
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
			gameOver();
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
			enemiesHit++;
		}//if
	}//checkCollision
}//right

//draw score on canvas
function drawScore() {
	context.font = "16px sans-serif";
	context.fillStyle = "white";
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

//object for boss b1 and b2
function bossOne(x, y, r, dx, dy, mass, hp) {
	this.x = x;
	this.y = y;
	this.r = r;
	this.dx = dx;
	this.dy = dy;
	this.mass = mass;
	this.hp = hp;
	
	//draw the object
	this.draw = function(){
		context.beginPath();
		context.arc (this.x, this.y, this.r, 0, Math.PI * 2, false);
		context.fillStyle = color;
		context.fill();
		
		//movement along x and y axis
		this.x += this.dx;
		this.y += this.dy;
	
		//if x cord is greater than canvas width or x cord less than ball radius, change dx sign
		if(this.x + this.dx > canvas.width-this.r || this.x + this.dx < this.r){
			this.dx = -this.dx; 
		}//if
		
		//if y cord is greater than canvas height or y cord is less than ball radius, change dy sign
		if(this.y + this.dy > canvas.height-this.r - 100 || this.y + this.dy < this.r){
			this.dy = -this.dy;
		}//if
	}//draw
	
	//change the radius
	this.resize = function (radius){
		this.r = radius;
	}//resize
	
	//collision between the boss and playerBullet
	this.checkCollision = function(){
		//horizontal and vertical distance between 2 circles
		var colX = playerBullet.x - this.x;
		var colY = playerBullet.y - this.y;
		
		//distance between 2 circle center points
		var distance = Math.sqrt(Math.pow(colX,2) + Math.pow(colY,2));
		
		//if distance is less than the two radii added togather
		if (distance <= playerBullet.r + this.r){
			//console.log("Collision Right!");
			this.hp = this.hp - 1;
			shotFired = false;
			playerBullet.y = -500;
			score = score + 100;
		}//if
	}//checkCollision
	
	//collision between this object and the playerObject
	this.checkCollisionPlayer = function(){
		var distX = Math.abs(this.x - playerObject.x - playerObject.width/2);
		var distY = Math.abs(this.y - playerObject.y - playerObject.height/2);
		
		//vertical and horizontal distance between the circle's center(boss) and the rectangle's center(player)
		if ((distX <= (playerObject.width/2)) && (distY <= (playerObject.height/2))){
			//console.log("You Died!");
			gameOver();
		}//if
		
		var ax = distX - playerObject.width /2;
		var ay = distY - playerObject.height /2;
		if (ax * ax + ay * ay <= (this.r * this.r)){
			//console.log("Corner hit!");
			gameOver();
		}//if
	}//checkCollision
	
	//draw the outline of the boss
	this.drawOutline = function(){
		context.beginPath();
		context.arc (this.x, this.y, this.r, 0, Math.PI * 2, false);
		context.fillStyle = "pink";
		context.fill();
	}//drawOutline
}//ball
	
//var b1 = new bossOne(300, 300, 60, 4, -2, 10, 10);
//var b2 = new bossOne(400, 400, 60, 2, -4, 10, 10);
var b1 = new bossOne(300, 300, 60, 14, -2, 10, 10);
var b2 = new bossOne(400, 400, 60, 12, -4, 10, 10);

//reset b1 and b2
function resetBossOne(){
	b1.x = 300;
	b1.y = 300;
	b1.dx = 14;
	b1.dy = -2;
	b1.mass = 10;
	b1.hp = 10;
	
	b2.x = 400;
	b2.y = 400;
	b2.dx = 12;
	b2.dy = -4;
	b2.mass = 10;
	b2.hp = 10;
	
	bossPoints = 0;
}//resetBossOne

//variables for collision between b1 and b2 and their response
var colX;
var colY;
var colAngle;
var distance;
var magnitude_1;
var magnitude_2;
var direction_1;
var direction_2;
var new_dy_1;
var new_dy_2;
var new_dx_1;
var new_dx_2;
var final_dx_1;
var final_dx_2
var final_dy_1;
var final_dy_2;
var color = '#B22222';
	
//collision between b1 and b2
function bossCollision(){
	b1.draw();
	b2.draw();
	
	b1.checkCollision();
	b2.checkCollision();
	b1.checkCollisionPlayer();
	b2.checkCollisionPlayer();
	
	//horizontal and vertical distance
	colX = b1.x - b2.x;
	colY = b1.y - b2.y;
	//console.log(colX);
	//console.log(colY);
	
	// distance between 2 circles
	distance = Math.sqrt(Math.pow(colX,2) + Math.pow(colY,2));
	//distance = Math.sqrt(colX^^2 + colY^^2);
	//console.log(distance);
	
	//if distance <= b1 radius + b2 radius
	if (distance <= b1.r + b2.r){
		console.log('Collision Detected');
		bossPoints = bossPoints +1;
		//b1.resize(40);
		//b2.resize(40); intersect b1 and b2 for spinning effect

		//collision angle
		colAngle = Math.atan2(colY, colX);
		//console.log(colAngle);
		
		magnitude_1 = Math.sqrt(b1.dx * b1.dx + b1.dy * b1.dy) //b1 speed
		magnitude_2 = Math.sqrt(b2.dx * b2.dx + b2.dy * b2.dy) //b2 speed
		
		direction_1 = Math.atan2(b1.dy, b1.dx); //b1 direction
		direction_2 = Math.atan2(b2.dy,b2.dx) //b2 direction
		
		//new dx velocity
		new_dx_1 = magnitude_1 * Math.cos(direction_1 - colAngle);
		
		//new velocity for other vectors
		new_dy_1 = magnitude_1 * Math.sin(direction_1 - colAngle);
		new_dx_2 = magnitude_2 * Math.cos(direction_2 - colAngle);
		new_dy_2 = magnitude_2 * Math.sin(direction_2 - colAngle);
		
		//final dx for b1
		final_dx_1 = ((b1.mass - b2.mass) * new_dx_1 +(b2.mass + b2.mass)* new_dx_2)/(b1.mass + b2.mass);
		
		//final dy for b2
		final_dx_2 = ((b1.mass + b1.mass)* new_dx_1 +(b2.mass - b1.mass)* new_dx_2)/(b1.mass + b2.mass);
		
		//y speed does not change (1d collision)
		final_dy_1 = new_dy_1;
		final_dy_2 = new_dy_2;
		
		//determine x and y on the original axis system using trig
		b1.dx = Math.cos(colAngle) * final_dx_1 + Math.cos(colAngle + Math.PI /2) * final_dy_1;
		b1.dy = Math.sin(colAngle) * final_dx_1 + Math.sin(colAngle + Math.PI /2) * final_dy_1;
		b2.dx = Math.cos(colAngle) * final_dx_2 + Math.cos(colAngle + Math.PI /2) * final_dy_2;
		b2.dy = Math.sin(colAngle) * final_dx_2 + Math.sin(colAngle + Math.PI /2) * final_dy_2;
	}//if
}//bossCollision
	

//leviathan object - spawn these after b1 and b2 collide
function leviathan(x, y, dx, dy, width, height, hit){
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.width = width;
	this.height = height;
	this.left = left;
	this.right = right;
	this.hit = hit;
	
	//draw the object
	this.spawnLeviathan = function(){
		context.beginPath();
		context.rect(this.x,this.y,this.width,this.height);
		context.fillStyle = "purple";
		context.fill();
		context.closePath();
	}//spawnLeviathan
	
	//move function for leviathanA
	this.move = function(){
		this.spawnLeviathan();
		
		//move along y axis until at 100 y
		if (this.y != 100){
			this.y += this.dy;
		}//if
	}//move
	
	//move function for leviathanB
	this.moveRight = function(){
		this.spawnLeviathan();
		
		//move along y axis until at 100 y
		if (this.y != 300){
			this.y += this.dy;
		}//if
	
		//if y == 100 then start moving right until end of canvas is reached, change dx to go left until end of canvas is reached then reverse dx and so on
		if (this.y == 300){
			this.x += this.dx;
			if(this.x + this.dx > canvas.width/2 - this.width || this.x + this.dx < 0) {
				this.dx = -this.dx;
			}//inner if
		}//if
	}
		
	//move function for leviathanC
	this.moveLeft = function(){
		this.spawnLeviathan();
		
		//move along y axis until at 100 y
		if (this.y != 300){
			this.y += this.dy;
		}//if
	
		//if y == 100 then start moving right until end of canvas is reached, change dx to go left until end of canvas is reached then reverse dx and so on
		if (this.y == 300){
			this.x += this.dx;
			if(this.x + this.dx > canvas.width - this.width || this.x + this.dx < canvas.width/2){
				this.dx = -this.dx;
			}
		}//if
	}//moveLeft
	
	//collision between playerBullet and leviathan
	this.checkCollision = function(){
		//vertical and horizontal distance between the circle's center(playerBullet) and the rectangle's center(leviathan)
		var distX = Math.abs(playerBullet.x - this.x-this.width/2);
		var distY = Math.abs(playerBullet.y - this.y-this.height/2); 
		
		//if the distance is less than half rectangle then they are colliding
		if ((distX <= (this.width/2)) && (distY <= (this.height/2))){
			this.hit += 1;
			shotFired = false;
			playerBullet.y = -500;
			score = score + 100;
		}//if
	}//checkCollision
	
	}//leviathan

//creating 3 leviathan objects
leviathanA = new leviathan(800,-50,2,2,300,50,0, 10);
leviathanB = new leviathan(0, -150,2,2,300,50, 0, 10);
leviathanC = new leviathan(canvas.width - 300, -150,2,2,300,50, 0, 10);

//every leviathan fires 8 bullets each - creating 3 arrays and populating them with 8 bullet objects
leviA = [];
lright = 200;

for (var i = 0; i < 8; i++){
	leviA[i] = new bullet(lright, 1000, 5, 0);
	lright = lright + 50;
}//for
	
leviB = [];
lright = 200;

for (var i = 0; i < 8; i++){
	leviB[i] = new bullet(lright, 1000, 5, 0);
	lright = lright + 50;
}//for

leviC = [];
lright = 200;

for (var i = 0; i < 8; i++){
	leviC[i] = new bullet(lright, 1000, 5, 0);
	lright = lright + 50;
}//for

/* Power Ups */
function powerUp(x,y,r,dx,dy,q,hit){
	this.x = x;
	this.y = y;
	this.r = r;
	this.dx = dx;
	this.dy = dy;
	this.q = q;
	this.hit = hit;

	var color = 'rgba(0, 0, 0, 0.01)'; //transparent

	//draw the object
	this.draw = function(){
		context.beginPath();
		context.arc (this.x, this.y, this.r, 0, Math.PI * 2, false);
		context.fillStyle = color;
		context.fill();
	}//draw

	//move along y axis until 250 y from the bottom of the canvas
	this.move = function(){
		this.draw();
		
		if (this.y != canvas.height - 250){
			this.y += this.dy;
		}//if
	}//move

	//draw the image inside the object
	this.drawImage = function(){
		context.drawImage(this.q, this.x - 15, this.y - 16);
	}//drawImage

	//collision between this object and playerObject
	this.checkCollisionPlayer = function(){
		//vertical and horizontal distance between the circle's center(powerup) and the rectangle's center(playerObject)
		var distX = Math.abs(this.x - playerObject.x - playerObject.width/2);
		var distY = Math.abs(this.y - playerObject.y - playerObject.height/2);
	
		//vertical and horizontal distance between the circle's center(powerup) and the rectangle's center(playerObject)
		if ((distX <= (playerObject.width/2)) && (distY <= (playerObject.height/2))){
			score = score += 2000;
			this.hit = 1;
		}//if
	
		var ax = distX - playerObject.width /2;
		var ay = distY - playerObject.height /2;
		if (ax * ax + ay * ay <= (this.r * this.r)){
			score = score += 2000;
			this.hit = 1;
		}//if
	}//checkCollision
}//powerUp

//coin power up, boost to score
goldPowerUp = new powerUp(canvas.width/2,-50, 15, 2,2, img,0);

//reset goldPowerUp
function resetGoldPowerUp(){
	goldPowerUp.x = canvas.width/2;
	goldPowerUp.y = -50;
	goldPowerUp.hit = 0;
}//resetGoldPowerUp

//reset playerBullet
function resetPlayerBullet(){
	playerBullet.x = 0;
	playerBullet.y = 0;
	playerBullet.bulletFired = 0;
}//resetPlayerBullet

//pass the score to html
passScore = function(){
	document.getElementById("scoreHTML").innerHTML = score;
}//passScore

//stops init(), loads the game over menu and fades player-canvas
gameOver = function(){
	playerObject.hit = 1;
	document.getElementById("game-over").style.display = "block";
	document.getElementById("player-canvas").setAttribute("class", "fade");
	passScore();
}//gameOver

//hide the game over menu, set player-canvas transparency back to normal, reset everything and start the init function
restart = function(){
	document.getElementById("game-over").style.display = "none";
	document.getElementById("player-canvas").setAttribute("class", "reset");
	resetBossOne();
	resetPlayer();
	resetEnemies();
	resetLeviathans();
	resetGoldPowerUp();
	resetPlayerBullet();
	score = 0;
	wavesKilled = 0;
	enemiesHit = 0;
	init();
}//restart

//hide the game over screen & player-canvas and display menu div
menu = function(){
	document.getElementById("game-over").style.display = "none";
	document.getElementById("player-canvas").style.display = "none";
	document.getElementById("menu").style.display = "block";
}//menu

//display the player-canvas, set player-canvas transparency to normal and hide the menu
menuPlay = function(){
	document.getElementById("player-canvas").style.display = "block";
	document.getElementById("player-canvas").setAttribute("class", "reset");
	document.getElementById("menu").style.display = "none";
	restart();
}//menuPlay

//open a new tab in the browser to the github repository
github = function(){
	var win = window.open("https://github.com/RicardsGraudins/Professional-Practice-in-I.T-2017-Project", "_blank");
	if (win) {
		//browser has allowed it to be opened
		win.focus();
	} else {
		//browser has blocked it
		alert('Please allow popups for this website');
	}
}//github

//open a new tab in the browser to the login template
login = function(){
	var win = window.open("127.0.0.1:5000/login", "_blank");
	if (win) {
		//browser has allowed it to be opened
		win.focus();
	} else {
		//browser has blocked it
		alert('Please allow popups for this website');
	}
}//login

window.setInterval(incrScore, 3000);
init();