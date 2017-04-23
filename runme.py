from flask import Flask, render_template, request, session, redirect, flash, url_for
from flask_pymongo import PyMongo
import bcrypt

app = Flask(__name__)

#Name of DB hosted on mlab.com and link to it using username:password for authenication -> allows the db to be modified
app.config['MONGO_DBNAME'] = 'player_login'
app.config['MONGO_URI'] = 'mongodb://Richard:password@ds155529.mlab.com:55529/player_login'

mongo = PyMongo(app)

#http://127.0.0.1:5000/ = homepage, template for the game
@app.route('/')
def index():
	return render_template('game.html')

#Register, if the method is post - check for username in database, if username does not exist then add the record to the database
#Password is hashed using bcrypt for security and the hashpass value is stored on the database instead of the password
#Session is then created and redirects user to profile
#If the method is get - return register.html
@app.route('/register', methods=['POST', 'GET'])
def register():
    if request.method == 'POST':
        users = mongo.db.users
        existing_user = users.find_one({'name' : request.form['username']})
	
        if existing_user is None:
            hashpass = bcrypt.hashpw(request.form['pass'].encode('utf-8'), bcrypt.gensalt())
            users.insert({'name' : request.form['username'], 'email' : request.form['email'], 'password' : hashpass})
            session['username'] = request.form['username']
            return redirect(url_for('profile'))
        
        return 'That username already exists!'

    return render_template('register.html')
	
#Login, if the username exists in database then check if the correct password is entered
#On success, create session and redirect to profile
#Otherwise invalid information entered or the account does not exist
@app.route('/login', methods=['POST'])
def login():
    users = mongo.db.users
    login_user = users.find_one({'name' : request.form['username']})

    if login_user:
		#if bcrypt.hashpw(request.form['pass'].encode('utf-8'), login_user['password'].encode('utf-8')) == login_user['password'].encode('utf-8'):
        if bcrypt.hashpw(request.form['pass'].encode('utf-8'), login_user['password']) == login_user['password']:
            session['username'] = request.form['username']
            return redirect(url_for('profile'))

    flash('Wrong username/password!')
    return render_template('login.html')
	
#Profile, if theres a username saved in session - return profile.html
#Otherwise go to login.html which asks for login details
@app.route('/profile')
def profile():
    if 'username' in session:
        return render_template('profile.html')

    return render_template('login.html')
	
#Logout, when user clicks on logout button, pop the session and redirect to profile
@app.route('/logout')
def logout():
	session.pop('username', None)
	return redirect(url_for('profile'))
	
#DeleteAccount, when user clicks on delete account button, remove record from database and pop session
@app.route('/deleteAccount')
def deleteAccount():
	users = mongo.db.users
	delUser = session['username']
	users.remove({"name": delUser})
	session.pop('username', None)
	return redirect(url_for('profile'))
	
#ChangeEmail, if the user is logged in:
#If the method is post - change email, otherwise method is get - return changeEmail.html
@app.route('/changeEmail', methods=['POST', 'GET'])
def changeEmail():
	if 'username' in session:
		if request.method == 'POST':
			users = mongo.db.users
			user = users.find_one({'name' : session['username']})
			user['email'] = request.form['newEmail']
			users.save(user)
			flash('Email Changed!')
		return render_template('changeEmail.html')
	return render_template('login.html')
	
#UploadScore, if the user is not logged in redirect to profile
#If the user is logged in and the method is post:
#Take the score from game.html and save it as the new score
@app.route('/uploadScore', methods=['GET','POST'])
def uploadScore():
	if 'username' in session:
		if request.method == 'POST':
			users = mongo.db.users
			user = users.find_one({'name' : session['username']})
			user['score'] = request.form['score']
			users.save(user)
		return redirect(url_for('profile'))
	return redirect(url_for('profile'))
	
#HighScore, if the user is not logged in redirect to profile
#If the user is logged in render template highScore.html
#In highScore.html flash the user's high score and display the highest and lowest scores in a table
@app.route('/highScore', methods=['GET','POST'])
def highScore():
	if 'username' in session:
		users = mongo.db.users
		userHighScore = users.find_one({'name' : session['username']}, {"_id":0, "score":1})
		flash('Your high score is:')
		#a = users.find().sort({score:-1}).limit(1)
		#b = users.find().sort({score:+1}).limit(1)
		a = users.find(sort=[("score", -1)]).limit(1)
		b = users.find(sort=[("score", +1)]).limit(1)
		return render_template('highScore.html', userHighScore = userHighScore, a = a, b = b)
	return redirect(url_for('profile'))

if __name__ == "__main__":
	app.secret_key = 'mysecret'
	app.run()