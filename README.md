# Task Manager

A full-stack task management web app built with vanilla HTML/CSS/JavaScript on the frontend and Flask + SQLAlchemy on the backend. Create, edit, complete, and delete tasks — all persisted to a real database, protected by user authentication, and fully deployed live.

**Live demo:** [Frontend (GitHub Pages)](https://asav098.github.io/Task-Manager/) · Backend hosted on [Render](https://render.com)

## Features

### Authentication
- **User Signup** — create an account with a username and password
- **Secure Password Storage** — passwords are never stored in plain text; hashed using `werkzeug.security` before being saved
- **JWT-Based Login** — successful login returns a signed JSON Web Token (JWT), valid for 24 hours
- **Persistent Login** — the token is stored in the browser's `localStorage`, so refreshing the page keeps you logged in
- **Protected Routes** — every task-related endpoint requires a valid token; requests without one are rejected with `401 Unauthorized`
- **Per-User Task Ownership** — each task is linked to the user who created it via a foreign key; users can only view, edit, or delete their own tasks (enforced server-side with `403 Forbidden` for mismatched ownership)
- **Logout** — clears the stored token and returns to the login screen
- **Dynamic UI Switching** — the login/signup forms and the task manager itself show/hide automatically based on whether a valid token is present

### Core CRUD Functionality
- **Create Tasks** — add new tasks via an input field, submit with a button click or by pressing Enter
- **Read/View Tasks** — fetches and displays only the logged-in user's tasks
- **Update Tasks** — toggle completion status via checkbox; edit task titles inline
- **Delete Tasks** — remove tasks with a single click

### Inline Editing
- **Edit Mode Toggle** — a single button switches every task's title into an editable input field
- **Save on Enter or Blur** — changes save automatically when the user presses Enter or clicks away from the input

### UI/UX
- **Sequential Display Numbering** — tasks are numbered 1, 2, 3... based on display order, independent of database IDs
- **Scrollable Task List** — a fixed-height container with its own internal scroll
- **Responsive Layout** — flexbox-based structure for clean alignment

### Backend Architecture
- **RESTful API Design** — dedicated routes for each CRUD and auth operation
- **SQLAlchemy ORM** — class-based models mapped directly to database tables
- **Foreign Key Relationships** — `Task.user_id` references `User.id`, tying data ownership at the database level
- **SQLite Database** — lightweight, file-based storage
- **CORS Enabled** — properly configured for a frontend hosted on a different origin than the backend
- **Environment Variables** — the JWT signing secret (`SECRET_KEY`) is read from an environment variable, never hardcoded or committed to the repo

## Tech Stack

- **Frontend:** HTML5, CSS3 (Flexbox), Vanilla JavaScript (ES6+)
- **Backend:** Python, Flask, Flask-SQLAlchemy, Flask-CORS, PyJWT, Werkzeug (password hashing)
- **Database:** SQLite
- **Deployment:** Render (backend), GitHub Pages (frontend)
- **Production Server:** Gunicorn (WSGI server)

## Project Structure

```
Task-Manager/
├── index.html          # Main frontend page (auth forms + task manager)
├── CSS/
│   └── style.css       # Styling
├── JS/
│   └── index.js        # Frontend logic (auth, fetch calls, DOM rendering, event handling)
├── python/
│   └── app.py           # Flask backend (models, auth routes, task routes)
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

3. Set your JWT secret key (optional locally — a fallback is used if unset):
   ```bash
   $env:SECRET_KEY="your-random-secret-here"   # PowerShell
   ```

4. Run the Flask server:
   ```bash
   python app.py
   ```

5. The API will be live at `http://127.0.0.1:5000`

### Frontend Setup

1. Open `index.html` in your browser (or use a Live Server extension).
2. Update the `API_URL` constant in `JS/index.js` to point to `http://127.0.0.1:5000` for local testing.

## API Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|--------------|
| `POST` | `/api/signup` | No | Create a new user account (expects `{ "username", "password" }`) |
| `POST` | `/api/login` | No | Authenticate and receive a JWT token |
| `GET` | `/api/tasks` | Yes | Fetch all tasks belonging to the logged-in user |
| `POST` | `/api/tasks` | Yes | Create a new task for the logged-in user |
| `PUT` | `/api/tasks/<id>` | Yes | Update a task's `completed` status and/or `title` (must be the task's owner) |
| `DELETE` | `/api/tasks/<id>` | Yes | Delete a specific task (must be the task's owner) |

Protected routes expect an `Authorization: Bearer <token>` header. Missing tokens return `401`; valid tokens for the wrong task's owner return `403`.

## How It Works

### Authentication Flow
1. User signs up — password is hashed with `generate_password_hash()` before being stored.
2. User logs in — password is verified with `check_password_hash()`; on success, a JWT is created containing the user's `id` and an expiration time, signed with a server-side secret key.
3. The frontend stores this token in `localStorage`.
4. Every subsequent request to a task route includes `Authorization: Bearer <token>` in its headers.
5. The backend decodes and verifies the token on each request via a shared `get_token()` helper, extracting the `user_id` to determine who's making the request — or rejecting the request if the token is missing, invalid, or expired.

### Ownership Enforcement
Each task route follows the same pattern: verify the token → confirm the requested task exists → confirm `task.user_id` matches the token's `user_id` → only then proceed. This ensures users can never read, edit, or delete another user's tasks, even if they guess a valid task ID.

### Data Flow (Tasks)
1. Frontend JS sends HTTP requests (`fetch()`) to the Flask backend's REST API, with the token attached.
2. Flask routes parse the request, verify the token, query/update the database via SQLAlchemy, and respond with JSON.
3. Frontend receives the JSON response and re-renders the task list to reflect the current state.

### Database Models
```python
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
```

## Key Learnings & Design Patterns

- **JWT-based authentication** — a stateless approach to auth well-suited to a frontend and backend hosted on separate origins, avoiding cross-domain cookie complications
- **Password hashing** — never storing or comparing raw passwords; always hashing before storage and comparing hashes on login
- **Foreign keys and data ownership** — modeling a one-to-many relationship (one user, many tasks) and enforcing it at the query level
- **Layered authorization checks** — distinguishing `401` (not authenticated at all) from `403` (authenticated, but not permitted) from `404` (resource doesn't exist), and getting the order of these checks right to avoid crashes on `None` values
- **Environment variables for secrets** — keeping the JWT signing key out of the public repository entirely
- **Client-side state driven by localStorage** — using the presence of a token to drive which UI section is visible, re-checked on every page load
- **RESTful API design** — using HTTP methods semantically (GET for reading, POST for creating, PUT for updating, DELETE for removing)
- **Deployment troubleshooting** — diagnosing build/start command mismatches, missing dependencies (`pyjwt` not in `requirements.txt`), and schema changes requiring a fresh database

## Known Limitations & Future Enhancements

- [ ] **Token refresh** — tokens currently expire after 24 hours with no refresh mechanism; users must log in again after expiry
- [ ] **Password reset flow** — no "forgot password" functionality yet
- [ ] **Persistent free-tier hosting** — Render's free tier spins down after inactivity, and its filesystem is ephemeral (database resets on redeploy)
- [ ] Due dates and reminders
- [ ] Task categories/priority levels
- [ ] Search and filter functionality
- [ ] Drag-and-drop task reordering
- [ ] Migration to a hosted production database (e.g., PostgreSQL) for persistent storage across deploys

## Deployment Notes

- **Backend (Render):** deployed as a Python web service with `gunicorn --chdir python app:app` as the start command, `pip install -r requirements.txt` as the build command, and `SECRET_KEY` set as an environment variable in Render's dashboard
- **Frontend (GitHub Pages):** deployed directly from the `main` branch's root directory
- **CORS:** enabled via `flask-cors` to allow the GitHub Pages frontend to communicate with the Render-hosted backend across origins
- **Database resets on redeploy:** Render's free tier uses an ephemeral filesystem, so schema changes (like adding the `user_id` column) require no manual migration — a fresh deploy naturally creates a clean database


**Built as a hands-on introduction to full-stack development** — connecting a vanilla JS frontend to a real Flask backend, complete with authentication, a live database, and a full deployment pipeline.
