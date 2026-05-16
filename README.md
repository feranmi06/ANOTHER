# L-BUY E-Commerce — Full Stack (Django + Vanilla JS)

A fashion e-commerce site with a Django REST API backend and a Vanilla JS frontend.

---

## Folder Structure

```
lbuy-ecommerce/
├── backend/                        # Django project
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example                # Copy to .env before starting
│   ├── lbuy/                       # Core Django config
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── accounts/                   # Auth app (register, login, logout, profile)
│   │   ├── models.py               # Uses Django's built-in User model
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   └── store/                      # Shop app (products, cart, wishlist, orders)
│       ├── models.py               # Product, Cart, CartItem, Wishlist, Order, OrderItem
│       ├── serializers.py
│       ├── views.py
│       ├── urls.py
│       ├── admin.py
│       └── management/commands/
│           └── seed_products.py    # Loads all 14 L-BUY products into the DB
│
└── frontend/                       # Your existing HTML/CSS/JS frontend
    ├── pages/                      # All HTML pages
    ├── css/                        # Stylesheets
    ├── js/
    │   ├── api.js                  # NEW — shared API helper (include on every page)
    │   ├── index.js                # Updated — search, cart, wishlist via API
    │   ├── login.js                # Updated — real auth via API
    │   ├── cart.js                 # Updated — cart CRUD via API
    │   ├── product.js              # Updated — add to cart via API
    │   ├── checkout.js             # Updated — place real orders via API
    │   ├── account.js              # Updated — profile + order history via API
    │   ├── wishlist.js             # Updated — wishlist CRUD via API
    │   └── search.js               # Updated — live product search via API
    └── image/                      # Product images
```

---

## Backend Setup

### 1. Create and activate a virtual environment

```bash
cd backend
python -m venv venv

# macOS / Linux
source venv/bin/activate

# Windows
venv\Scripts\activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Create your .env file

```bash
cp .env.example .env
```

### 4. Run migrations

```bash
python manage.py migrate
```

### 5. Seed the database with products

```bash
python manage.py seed_products
```

### 6. Create a superuser (for Django Admin)

```bash
python manage.py createsuperuser
```

### 7. Start the development server

```bash
python manage.py runserver
```

The API will be live at **http://127.0.0.1:8000**

---

## Frontend Setup

Open the frontend using **VS Code Live Server** (recommended) or any static server:

```bash
# Option 1 — Python simple server
cd frontend
python -m http.server 5500

# Option 2 — Node http-server (if installed)
npx http-server frontend -p 5500
```

Then open **http://127.0.0.1:5500/pages/index.html** in your browser.

> The Django backend must be running at port 8000 at the same time.

---

## API Endpoints

### Auth — `/api/auth/`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register a new user |
| POST | `/api/auth/login/` | Login, returns auth token |
| POST | `/api/auth/logout/` | Logout (invalidates token) |
| GET | `/api/auth/me/` | Get current user profile |
| PUT | `/api/auth/me/update/` | Update name |

### Products — `/api/products/`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products/` | List all products |
| GET | `/api/products/?q=dress` | Search by name |
| GET | `/api/products/?category=bags` | Filter by category |
| GET | `/api/products/?flash_sale=true` | Flash sale items only |
| GET | `/api/products/<id>/` | Single product detail |

### Cart — `/api/cart/` *(requires auth token)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart/` | Get current cart |
| POST | `/api/cart/add/` | Add item `{product_id, quantity}` |
| PUT | `/api/cart/item/<id>/` | Update quantity `{quantity}` |
| DELETE | `/api/cart/item/<id>/` | Remove one item |
| DELETE | `/api/cart/clear/` | Empty the entire cart |

### Wishlist — `/api/wishlist/` *(requires auth token)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/wishlist/` | Get wishlist |
| POST | `/api/wishlist/add/` | Add `{product_id}` |
| DELETE | `/api/wishlist/item/<id>/` | Remove item |

### Orders — `/api/orders/` *(requires auth token)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders/` | List order history |
| POST | `/api/orders/create/` | Place order from current cart |
| GET | `/api/orders/<id>/` | Single order detail |

---

## Authentication

The API uses **token authentication**. After login or register, a token is returned and stored in `localStorage` as `lbuy_token`. Every subsequent request includes:

```
Authorization: Token <your-token>
```

This is handled automatically by `api.js`.

---

## Django Admin

Visit **http://127.0.0.1:8000/admin/** to manage products, orders, users, and more.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Django 4.2, Django REST Framework |
| Database | SQLite (dev) — swap for PostgreSQL in production |
| Auth | DRF Token Authentication |
| CORS | django-cors-headers |
| Frontend | Vanilla HTML, CSS, JavaScript |
| Images | Pillow (Django ImageField) |
