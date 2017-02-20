from flask import Flask, render_template
from flask_pymongo import PyMongo

app = Flask(__name__)

#Name of DB hosted on mlab.com and link to it using username:password for authenication -> allows the db to be modified
app.config['MONGO_DBNAME'] = 'player_login'
app.config['MONGO_URI'] = 'mongodb://Richard:dbpassword@ds155529.mlab.com:55529/player_login'

mongo = PyMongo(app)

#http://127.0.0.1:5000/ = homepage, template for the game
@app.route('/')
def index():
	return render_template('game.html')
	
@app.route('/localHighScore')
def localHighScore():
	return render_template('localHighScore.html')
	
@app.route('/highScore')
def highScore():
	return render_template('highScore.html')
	
@app.route('/login')
def login():
	return render_template('login.html')
	
@app.route('/profile')
def profile():
	return render_template('profile.html')

if __name__ == "__main__":
	app.run()