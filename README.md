# L-BUY — Full Stack E-Commerce (Django + Vanilla JS)

A fashion e-commerce web app with a Django REST API backend and a Vanilla JS frontend.
Built as a group project — frontend by one team member, backend integration by another.

---

## Table of Contents

1. [How the App Works](#how-the-app-works)
2. [Project Structure](#project-structure)
3. [Local Setup (Backend)](#local-setup-backend)
4. [Local Setup (Frontend)](#local-setup-frontend)
5. [Development Workflow (Git)](#development-workflow-git)
6. [Django Admin Panel](#django-admin-panel)
7. [Environment Variables](#environment-variables)

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
