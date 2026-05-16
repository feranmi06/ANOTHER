# L-BUY — Full Stack E-Commerce (Django + Vanilla JS)

A fashion e-commerce web app with a Django REST API backend and a Vanilla JS frontend.
Built as a group project — frontend by one team member, backend integration by another.

---

## Table of Contents

1. [How the App Works](#how-the-app-works)
2. [Project Structure](#project-structure)
3. [Local Setup (Backend)](#local-setup-backend)
4. [Local Setup (Frontend)](#local-setup-frontend)
5. [API Reference](#api-reference)
6. [Deploying the Backend to Railway](#deploying-the-backend-to-railway)
7. [Deploying the Frontend to Vercel](#deploying-the-frontend-to-vercel)
8. [Development Workflow (Git)](#development-workflow-git)
9. [Django Admin Panel](#django-admin-panel)
10. [Environment Variables](#environment-variables)

---

## How the App Works

The app is split into two independent parts that talk to each other over HTTP.

```
+---------------------------------+         +--------------------------------+
|           FRONTEND              |         |           BACKEND              |
|                                 |         |                                |
|  HTML / CSS / JavaScript        | ──────► |  Django REST API               |
|  Runs on port 5500              |  fetch  |  Runs on port 8000             |
|  (or Vercel in production)      | ◄────── |  (or Railway in production)    |
|                                 |  JSON   |                                |
+---------------------------------+         +--------------------------------+
                                                          |
                                                          v
                                                  +---------------+
                                                  |   Database    |
                                                  |  (SQLite /    |
                                                  |  PostgreSQL)  |
                                                  +---------------+
```

When you click "Add to Cart" on the frontend, the JavaScript sends a request to
the Django API. Django checks who you are, saves the item to the database, and
sends back a response. The frontend never touches the database directly.

The file that wires everything together is frontend/js/api.js. Every other
JS file uses apiFetch() from that file to communicate with Django.

- In development: both servers run on your machine simultaneously.
- In production: frontend is on Vercel, backend is on Railway. Same flow, different URLs.

---

## Project Structure

```
lbuy-ecommerce/
|
+-- README.md
|
+-- backend/                           Django project (the API)
|   +-- manage.py                      Django CLI entry point
|   +-- requirements.txt               Python dependencies
|   +-- .env.example                   Environment variable template
|   |
|   +-- lbuy/                          Core Django config
|   |   +-- settings.py                All app settings
|   |   +-- urls.py                    Root URL router
|   |   +-- wsgi.py                    Production server entry point
|   |
|   +-- accounts/                      Handles users and authentication
|   |   +-- serializers.py             Converts User objects to/from JSON
|   |   +-- views.py                   register, login, logout, profile
|   |   +-- urls.py                    /api/auth/ routes
|   |
|   +-- store/                         Handles all shop logic
|       +-- models.py                  Product, Cart, Order, Wishlist tables
|       +-- serializers.py             Converts models to/from JSON
|       +-- views.py                   All shop API logic
|       +-- urls.py                    /api/ routes
|       +-- admin.py                   Registers models in Django Admin
|       +-- management/commands/
|           +-- seed_products.py       Loads initial product data
|
+-- frontend/                          The HTML/CSS/JS storefront
    +-- pages/                         All HTML pages
    +-- css/                           Stylesheets (one per page)
    +-- js/
    |   +-- api.js                     Shared API helper — included on every page
    |   +-- index.js                   Homepage logic
    |   +-- login.js                   Auth logic
    |   +-- cart.js                    Cart page logic
    |   +-- product.js                 Product detail logic
    |   +-- checkout.js                Order placement logic
    |   +-- account.js                 Profile and orders
    |   +-- wishlist.js                Wishlist logic
    |   +-- search.js                  Search results logic
    +-- image/                         Product images
```

---

## Local Setup (Backend)

Do this once when setting up for the first time.

**Prerequisites:** Python 3.10 or higher installed.

### Step 1 — Create a virtual environment

A virtual environment keeps this project's dependencies isolated.
Always activate it before working on the backend.

```bash
cd lbuy-ecommerce/backend

# Create the environment (only once)
python -m venv venv

# Activate — macOS / Linux
source venv/bin/activate

# Activate — Windows
venv\Scripts\activate
```

You will see (venv) appear in your terminal. That means it is active.

### Step 2 — Install dependencies

```bash
pip install -r requirements.txt
```

### Step 3 — Set up your environment file

```bash
cp .env.example .env
```

Open the .env file and paste in a secret key. Generate one by running:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Step 4 — Run database migrations

Creates all the database tables.

```bash
python manage.py makemigrations
python manage.py migrate
```

### Step 5 — Load the product catalogue

Loads all 14 L-BUY products into the database.

```bash
python manage.py seed_products
```

### Step 6 — Create an admin account

```bash
python manage.py createsuperuser
```

Follow the prompts to set your username and password.

### Step 7 — Start the server

```bash
python manage.py runserver
```

The API is now live at http://127.0.0.1:8000

---

## Local Setup (Frontend)

The frontend is plain HTML. It needs to be served from a local server
(not opened as a file) so the API requests work correctly.

**Option A — VS Code Live Server (recommended)**

1. Install the "Live Server" extension in VS Code
2. Right-click frontend/pages/index.html
3. Click "Open with Live Server"

**Option B — Python**

```bash
cd lbuy-ecommerce/frontend
python -m http.server 5500
```

Then open: http://127.0.0.1:5500/pages/index.html

**Both servers must be running at the same time:**

| What         | URL                                          |
|--------------|----------------------------------------------|
| Django API   | http://127.0.0.1:8000                        |
| Frontend     | http://127.0.0.1:5500/pages/index.html       |

---

## API Reference

All endpoints are prefixed with /api/

Protected endpoints require this header:
```
Authorization: Token <your-token>
```

The token is returned automatically when you register or log in.

### Auth

| Method | Endpoint               | Description           |
|--------|------------------------|-----------------------|
| POST   | /api/auth/register/    | Create account        |
| POST   | /api/auth/login/       | Login, returns token  |
| POST   | /api/auth/logout/      | Invalidate token      |
| GET    | /api/auth/me/          | Get current user      |
| PUT    | /api/auth/me/update/   | Update name           |

### Products

| Method | Endpoint                          | Description            |
|--------|-----------------------------------|------------------------|
| GET    | /api/products/                    | All products           |
| GET    | /api/products/?q=dress            | Search by name         |
| GET    | /api/products/?category=bags      | Filter by category     |
| GET    | /api/products/?flash_sale=true    | Flash sale items only  |
| GET    | /api/products/<id>/               | Single product detail  |

Categories: fashion, bags, shoes, jewelry, beauty, luxury, accessories, trending

### Cart (protected)

| Method | Endpoint               | Description       |
|--------|------------------------|-------------------|
| GET    | /api/cart/             | View cart         |
| POST   | /api/cart/add/         | Add item          |
| PUT    | /api/cart/item/<id>/   | Update quantity   |
| DELETE | /api/cart/item/<id>/   | Remove one item   |
| DELETE | /api/cart/clear/       | Empty cart        |

### Wishlist (protected)

| Method | Endpoint                   | Description  |
|--------|----------------------------|--------------|
| GET    | /api/wishlist/             | View list    |
| POST   | /api/wishlist/add/         | Add item     |
| DELETE | /api/wishlist/item/<id>/   | Remove item  |

### Orders (protected)

| Method | Endpoint               | Description           |
|--------|------------------------|-----------------------|
| GET    | /api/orders/           | Order history         |
| POST   | /api/orders/create/    | Place order from cart |
| GET    | /api/orders/<id>/      | Single order detail   |

---

## Deploying the Backend to Railway

Railway is the easiest platform for hosting Django. Free tier available.

### Step 1 — Add deployment files

Inside the backend/ folder, create two new files:

**backend/Procfile** (no file extension — exactly this name):
```
web: gunicorn lbuy.wsgi --log-file -
```

**backend/runtime.txt**:
```
python-3.11.0
```

### Step 2 — Install production packages

```bash
cd backend
pip install gunicorn whitenoise psycopg2-binary dj-database-url
pip freeze > requirements.txt
```

### Step 3 — Update settings.py for production

Add these changes to backend/lbuy/settings.py:

```python
import dj_database_url

# Replace the entire DATABASES block with this:
DATABASES = {
    'default': dj_database_url.config(
        default=f'sqlite:///{BASE_DIR / "db.sqlite3"}',
        conn_max_age=600,
    )
}

# Add whitenoise to MIDDLEWARE, directly after SecurityMiddleware:
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # add this line
    # ... rest stays the same
]

# Add at the bottom:
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
STATIC_ROOT = BASE_DIR / 'staticfiles'
```

### Step 4 — Push everything to GitHub

```bash
git add .
git commit -m "Add Railway deployment config"
git push origin main
```

### Step 5 — Create a Railway project

1. Go to railway.app and sign up with your GitHub account
2. Click New Project
3. Click Deploy from GitHub repo
4. Select your repository
5. Set the Root Directory to backend
6. Railway detects Python and starts building automatically

### Step 6 — Set environment variables

In Railway: your project → Variables tab → add these:

```
SECRET_KEY     your-generated-secret-key
DEBUG          False
```

### Step 7 — Add a PostgreSQL database

1. In Railway, click New → Database → PostgreSQL
2. Railway sets DATABASE_URL automatically in your environment
3. dj-database-url picks it up — nothing else needed

### Step 8 — Set the start command

In Railway: your service → Settings → Deploy → Start Command:

```
python manage.py migrate && python manage.py seed_products && gunicorn lbuy.wsgi --log-file -
```

### Step 9 — Update the frontend API URL

Once Railway gives you a live URL (e.g. https://lbuy-backend.railway.app),
open frontend/js/api.js and update this one line:

```js
// Change this:
const API_BASE = 'http://127.0.0.1:8000/api';

// To this:
const API_BASE = 'https://your-app-name.railway.app/api';
```

---

## Deploying the Frontend to Vercel

The frontend is plain HTML so Vercel handles it with zero configuration.

1. Go to vercel.com and sign in with GitHub
2. Click New Project and import your repository
3. Set the Root Directory to frontend
4. Leave all other settings as default
5. Click Deploy

Vercel gives you a URL like https://lbuy.vercel.app — share that as your live site.

---

## Development Workflow (Git)

### First time setup after cloning

```bash
git clone https://github.com/your-username/lbuy-ecommerce.git
cd lbuy-ecommerce/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_products
python manage.py createsuperuser
python manage.py runserver
```

### Every day before you start working

```bash
# Get the latest changes from the team
git pull origin main

# Activate your virtual environment
source venv/bin/activate          # Windows: venv\Scripts\activate

# Install any new packages a teammate may have added
pip install -r requirements.txt

# Apply any new database migrations a teammate may have added
python manage.py migrate
```

### Saving and sharing your changes

```bash
# See what files you changed
git status

# Stage your changes
git add .

# Save with a clear description
git commit -m "Fix cart total calculation"

# Push to GitHub
git push origin main
```

### Working on a new feature (recommended for teams)

```bash
# Create a branch for your feature
git checkout -b feature/order-tracking

# Work, then commit when done
git add .
git commit -m "Add order tracking status endpoint"
git push origin feature/order-tracking

# On GitHub, open a Pull Request to merge into main
# Teammate reviews, then merges
```

### The .gitignore file

Make sure a .gitignore exists at the project root with at least:

```
venv/
__pycache__/
*.pyc
db.sqlite3
.env
media/
staticfiles/
.DS_Store
Thumbs.db
.vscode/
```

Never push .env (contains your secret key).
Never push db.sqlite3 (everyone on the team uses their own local database).

---

## Django Admin Panel

Visit http://127.0.0.1:8000/admin/ locally, or your Railway URL in production.
Log in with the superuser credentials you created during setup.

| Section  | What you can do                                              |
|----------|--------------------------------------------------------------|
| Products | Add, edit, delete. Toggle flash sale. Update price, stock.  |
| Orders   | View all orders. Change status (pending → shipped, etc.)    |
| Users    | See registered accounts. Deactivate accounts.               |
| Cart     | Inspect any user's cart. Useful for debugging.              |
| Wishlist | See what products users have saved.                         |
| Tokens   | Delete a token to force a user to log out.                  |

---

## Environment Variables

| Variable       | Required         | Description                                    |
|----------------|------------------|------------------------------------------------|
| SECRET_KEY     | Yes              | Django secret key — never share or push this   |
| DEBUG          | Yes              | True in development, False in production       |
| DATABASE_URL   | Production only  | Set automatically by Railway with PostgreSQL   |

Copy .env.example to .env and fill in your values.
The .env file is listed in .gitignore and will never be pushed to GitHub.
