//gets a handle to the element with id background-canvas
var canvas = document.getElementById("background-canvas");
//gets a 2D context for the canvas
var ctx = canvas.getContext("2d");

//creates a random int between 2 numbers(inclusive)
//hue var selects value of 0, 60, or 240
//and for sat var a number from 50 to 100
function getRandom(min,max) {
	return Math.floor(Math.random() * (max - min + 1)) +min;
}//getRandom

//range for hue
colorrange = [0,60,240];

//function star is one of javascripts ways of creating an object, star consists of the following:
//(x,y) cords, r = radius, dy is speed on y axis, hue & sat is HSL related
//instead of having a simple fillStyle = "white" every star stores a value for hue & sat which gives it a color
function star (x,y,r,dy,hue,sat) {
	this.x = x;
	this.y = y;
	this.r = r;
	this.dy = dy;
	this.hue = hue;
	this.sat = sat;
	
	//every star has a draw function - which draws the star on the canvas
	this.draw = function(){
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI); //circle shape
		ctx.fillStyle = "hsl(" + hue + ", " + sat + "%, 88%)"; //although fillStyle takes in variables hue & sat, luminosity 88% is constant which keeps the stars predominantly white to look bright in space with a hint of color 
		ctx.fill();
		
		//star goes down the canvas to give the illusion the spaceship is actually traversing through space
		this.y -= this.dy;
		
		//if y cord is greater than canvas height, reset y to 0 -> draw the star back at the top of the canvas at random x location
		if(this.y + this.dy > canvas.height) {
			this.x = Math.random() * canvas.offsetWidth; //random x location inside canvas
			this.y = 0;
			this.dy = Math.random() * -2; //changes fall speed
			this.r = Math.random() * .9; //changes radius
			hue = colorrange[getRandom(0,colorrange.length - 1)]; //changes hue
			sat = getRandom(50,100); //changes sat
		}//if
	}//draw
}//star

//array stars that is populated by star objects defined by the howMany variable
var stars = {};
var howMany = 150;

for (var s = 0; s < howMany; s++) {
  stars[s] = new star(150, canvas.height - 1, 1, -2, 60, 50);
}//for


//update function clears the canvas and then draws the stars
function update(){
	ctx.clearRect(0,0, canvas.width, canvas.height);

	for (var i = 0; i < howMany; i++){
	stars[i].draw();
	}//for
}//update

function init(){
setInterval(update, 10); //preform the update function every 10 milliseconds
}//init

init();