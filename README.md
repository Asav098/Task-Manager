
# Task Manager

A full-stack task management web app built with vanilla HTML/CSS/JavaScript on the frontend and Flask + SQLAlchemy on the backend. Create, edit, complete, and delete tasks — all persisted to a real database and fully deployed live.

**Live demo:** [Frontend (GitHub Pages)](https://asav098.github.io/Task-Manager/) · Backend hosted on [Render](https://render.com)

## Features

### Core CRUD Functionality
- **Create Tasks** — add new tasks via an input field, submit with a button click or by pressing Enter
- **Read/View Tasks** — fetches and displays all tasks from the database on page load
- **Update Tasks** — toggle completion status via checkbox; edit task titles inline
- **Delete Tasks** — remove tasks with a single click

### Inline Editing
- **Edit Mode Toggle** — a single button switches every task's title into an editable input field
- **Save on Enter or Blur** — changes save automatically when the user presses Enter or clicks away from the input, no separate "save" button needed
- **Seamless Mode Switching** — toggling edit mode off reverts all titles back to plain, read-only text

### UI/UX
- **Sequential Display Numbering** — tasks are numbered 1, 2, 3... based on display order, independent of their actual database IDs (so numbering stays clean even after deletions)
- **Scrollable Task List** — a fixed-height container with its own internal scroll, so the input/add bar always stays visible and accessible
- **Responsive Layout** — flexbox-based structure for clean alignment of task rows

### Backend Architecture
- **RESTful API Design** — dedicated routes for each CRUD operation (`GET`, `POST`, `PUT`, `DELETE`) under `/api/tasks`
- **SQLAlchemy ORM** — Python class-based models mapped directly to database tables, no raw SQL required
- **SQLite Database** — lightweight, file-based storage, ideal for a project at this scale
- **CORS Enabled** — properly configured cross-origin resource sharing so the frontend (hosted separately) can communicate with the backend

## Tech Stack

- **Frontend:** HTML5, CSS3 (Flexbox), Vanilla JavaScript (ES6+)
- **Backend:** Python, Flask, Flask-SQLAlchemy, Flask-CORS
- **Database:** SQLite
- **Deployment:** Render (backend), GitHub Pages (frontend)
- **Production Server:** Gunicorn (WSGI server)

## Project Structure

```
Task-Manager/
├── index.html          # Main frontend page
├── CSS/
│   └── style.css       # Styling
├── JS/
│   └── index.js        # Frontend logic (fetch calls, DOM rendering, event handling)
├── python/
│   └── app.py           # Flask backend (routes, models, database logic)
├── requirements.txt      # Python dependencies
└── README.md             # This file
```

## Getting Started (Local Development)

### Backend Setup

1. Navigate to the `python/` folder:
   ```bash
   cd python
   ```

2. Install dependencies:
   ```bash
   pip install -r ../requirements.txt
   ```

3. Run the Flask server:
   ```bash
   python app.py
   ```

4. The API will be live at `http://127.0.0.1:5000`

### Frontend Setup

1. Open `index.html` in your browser (or use a Live Server extension).
2. Update the `API_URL` constant in `JS/index.js` to point to `http://127.0.0.1:5000` for local testing.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|--------------|
| `GET` | `/api/tasks` | Fetch all tasks |
| `POST` | `/api/tasks` | Create a new task (expects `{ "title": "..." }`) |
| `PUT` | `/api/tasks/<id>` | Update a task's `completed` status and/or `title` |
| `DELETE` | `/api/tasks/<id>` | Delete a specific task |

## How It Works

### Data Flow
1. Frontend JS sends HTTP requests (`fetch()`) to the Flask backend's REST API.
2. Flask routes parse the request, query/update the database via SQLAlchemy, and respond with JSON.
3. Frontend receives the JSON response and re-renders the task list to reflect the current state.

### Database Model
```python
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    completed = db.Column(db.Boolean, default=False)
```

### Edit Mode Logic
When edit mode is active, each task's title renders as an `<input>` instead of a `<span>`, pre-filled with the current title. Listening for both `keydown` (Enter key) and `blur` (clicking away) ensures the update saves whichever way the user chooses to confirm their edit.

## Key Learnings & Design Patterns

- **Separating frontend and backend concerns** — two independently deployable pieces communicating purely over HTTP
- **RESTful API design** — using HTTP methods semantically (GET for reading, POST for creating, PUT for updating, DELETE for removing)
- **SQLAlchemy ORM patterns** — `db.session.add()` / `.commit()` staging pattern, `.query.get()` vs `.query.all()`, safe dictionary lookups with `.get(key, default)`
- **CORS understanding** — recognizing and resolving cross-origin request blocking between a frontend and backend on different origins
- **Deployment troubleshooting** — diagnosing build/start command mismatches, root directory misconfigurations, and missing committed files during real deployment
- **Consistent template literal usage** — a recurring bug pattern (single quotes vs. backticks breaking `${}` interpolation) and the discipline to catch it

## Known Limitations & Future Enhancements

- [ ] **User Authentication** — currently all visitors share one global task list; planned addition of user accounts for private, per-user task lists
- [ ] **Persistent free-tier hosting** — Render's free tier spins down after inactivity, causing a slow "cold start" on the first request after idle periods
- [ ] Due dates and reminders
- [ ] Task categories/priority levels
- [ ] Search and filter functionality
- [ ] Drag-and-drop task reordering

## Deployment Notes

- **Backend (Render):** deployed as a Python web service with `gunicorn --chdir python app:app` as the start command, `pip install -r requirements.txt` as the build command
- **Frontend (GitHub Pages):** deployed directly from the `main` branch's root directory
- **CORS:** enabled via `flask-cors` to allow the GitHub Pages frontend to communicate with the Render-hosted backend across origins

## License

MIT

---

**Built as a hands-on introduction to full-stack development** — connecting a vanilla JS frontend to a real Flask backend, complete with a live database and full deployment pipeline.
