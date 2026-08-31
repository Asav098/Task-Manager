from flask import Flask, jsonify , request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime,timedelta
import os


app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key= True)
    name = db.Column(db.String(80),unique=True,nullable = False)
    password_hash = db.Column(db.String(200), nullable = True)
    
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200),nullable = False)
    completed = db.Column(db.Boolean,default = False)

with app.app_context():
    db.create_all()

@app.route('/api/sigup',methods = ['POST'])
def signup():
    data = request.get_json();
    username = data.get('username');
    password = data.get('password');

    if not username or not password:
        return jsonify({"error": "Username and Password Required"}), 400

    existing_user = User.query.filter_by(username = username).first()

    if existing_user:
        return jsonify({"error" : "Üsername Already Exists"}),400

    hashed_password = generate_password_hash(password)
    new_user = User(username = username, password_hash = hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User Created Successfully", "id":new_user.id})

import os

SECRET_KEY = os.environ.get('SECRET_KEY', 'fallback')

@app.route('/api/login',methods=['POST'])
def login():
    data= request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username = username).first()

    if not user or not check_password_hash(user.password_hash,password):
        return jsonify({"error": "Invalid Username or Password"}), 401

    token = jwt.encode({
    'user_id': user.id,
    'exp': datetime.utcnow() + timedelta(hours=24)
    }, SECRET_KEY, algorithm='HS256')

    return jsonify({"token":token, "username":user.username})
@app.route('/api/tasks',methods=['POST'])
def create_task():
    data = request.get_json()
    new_task = Task(title=data['title'])
    db.session.add(new_task)
    db.session.commit()
    return jsonify({"id": new_task.id,"title":new_task.title,"completed":new_task.completed})

@app.route('/api/tasks',methods=['GET'])
def read_task():
    tasks=Task.query.all()
    result=[]
    for task in tasks:
        result.append({"id":task.id,"title":task.title,"completed":task.completed})
    return jsonify(result)

@app.route('/api/tasks/<int:task_id>',methods=['PUT'])
def update_task(task_id):
    task= Task.query.get(task_id)
    if not task:
        return jsonify({"error":"Task not found"}), 404
    data = request.get_json()
    task.title = data.get('title',task.title)
    task.completed= data.get('completed',task.completed)
    db.session.commit()
    return jsonify({"id": task.id,"title": task.title, "completed": task.completed})

@app.route('/api/tasks/<int:task_id>',methods=['DELETE'])
def delete_task(task_id):
    task=Task.query.get(task_id)
    if not task:
            return jsonify({"error":"Task not found"}), 404
    db.session.delete(task)
    db.session.commit()

    return jsonify({"message": "Task deleted"})


if __name__ == '__main__':
    app.run(debug=True)