//gets a handle to the element with id background-canvas
var canvas = document.getElementById("player-canvas");
//gets a 2D context for the canvas
var context = canvas.getContext("2d");

var moved = false;

function player (x,y,width,height,speed){
	this.x = x;
	this.y = y;
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
	
	//if an arrow key is pressed: playerObject (x,y) is modified and moved is set to true
	//if moved is set to true, clear the canvas and set moved back to false then draw the object at the new (x,y)
	this.move = function(){
		if(moved = true){
			context.clearRect(0,0,canvas.width,canvas.height);
			moved = false;
		}//if
		this.draw();
	}//move
}//player

playerObject = new player(900,900,20,20,10);

function init(){
	playerObject.move();
	requestAnimationFrame(init);
}//init

window.addEventListener("keypress", function(event) { 
  //just log the event to the console.
  console.log(event);
});

//if the object tries to go beyond the boundaries set, set (x,y) to keep the object within the canvas
$(document.body).on('keydown', function(e) {
  console.log(e.which);
  switch (e.which) {
  // key code for left arrow
  case 37:
	  playerObject.x -= playerObject.speed;
	  moved = true;
	  if(playerObject.x <= 10){ //aprox 10px from the left canvas edge
		playerObject.x = 10;
	  }
	  break;
  // key code for up arrow
  case 38:
	  playerObject.y -= playerObject.speed;
	  moved = true;
	  if(playerObject.y <= 800){ //only allow the object to move up to (x,800)
		playerObject.y = 800;
	  }
	  break;
  // key code for right arrow
  case 39:
	  playerObject.x += playerObject.speed;
	  moved = true;
	  if(playerObject.x >= canvas.width - 30){ //approx 10px from the right canvas edge
		playerObject.x = canvas.width - 30;
	  }
	  break;
  // key code for down arrow
  case 40:
	  playerObject.y += playerObject.speed;
	  moved = true;
	  if(playerObject.y >= canvas.height - 130){ //approx 10px from the bottom canvas edge
		playerObject.y = canvas.height - 130;
	  }
	  break;
  }
});

init();