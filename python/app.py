from flask import Flask, jsonify , request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
db = SQLAlchemy(app)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200),nullable = False)
    completed = db.Column(db.Boolean,default = False)

with app.app_context():
    db.create_all()

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