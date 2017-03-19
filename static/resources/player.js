//gets a handle to the element with id background-canvas
var canvas = document.getElementById("player-canvas");
//gets a 2D context for the canvas
var context = canvas.getContext("2d");

function player (x,y,width,height,speed){
	this.x =x;
	this.y =y;
	this.width = width;
	this.height = height;
	this.speed = speed;
	
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
				
			context.clearRect(0, 0, canvas.width, canvas.height);
			
			if (KEY_STATUS.left) {
				this.x -= this.speed
				if (this.x <= 10){ //aprox 10px from the left canvas edge
					this.x = 10;
				}
			} 	
			if (KEY_STATUS.right) {
				this.x += this.speed
				if (this.x >= canvas.width - 30){ //approx 10px from the right canvas edge
					this.x = canvas.width - 30;
				}
			} 	
			if (KEY_STATUS.up) {
				this.y -= this.speed
				if (this.y <= 800){ //only allow the object to move up to (x,800)
					this.y = 800;
				}
			} 	
			if (KEY_STATUS.down) {
				this.y += this.speed
				if (this.y >= canvas.height - 130){ //approx 10px from the bottom canvas edge
					this.y = canvas.height - 130;
				}
			}
		}//if
		playerObject.draw();
	}//move
}//player

playerObject = new player(900,900,20,20,10);

function init(){
	playerObject.move();
	window.requestAnimationFrame(init);
}//init

//the keycodes that will be mapped when a user presses a button
//original code by doug mcinnes https://github.com/dmcinnes/HTML5-Asteroids/blob/master/game.js
KEY_CODES = {
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

init();