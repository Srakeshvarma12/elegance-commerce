# Elegance Commerce

Full-stack e-commerce application with a React + Vite frontend and a Django REST backend. It supports product discovery, cart and checkout, user accounts, admin management, Razorpay payments, and Cloudinary-hosted media.

**Highlights**
- Product catalog with search, category filtering, featured and latest collections.
- Product variants (size, color) and media hosted on Cloudinary.
- Cart, checkout, orders, and order status tracking.
- JWT authentication, profile, and password reset flow.
- Wishlist and product reviews.
- Admin panel for product and order management.

**Tech Stack**
- Frontend: React, Vite, React Router, Redux, Tailwind CSS, Axios.
- Backend: Django, Django REST Framework, Simple JWT, PostgreSQL, Cloudinary, Razorpay.
- Deployment: Render (backend), Vercel (frontend SPA routing).

**Project Structure**
- `backend/` Django project and API.
- `frontend/` React app.
- `render.yaml` Render deployment config.
- `frontend/vercel.json` SPA routing for Vercel.

**Local Setup**
Prerequisites:
- Node.js (LTS recommended)
- Python 3.10+ and `pip`
- A PostgreSQL database (or set `DATABASE_URL` to your hosted DB)

Backend:
1. `cd backend`
2. Create a virtual environment and install dependencies:
```ps1
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
```
3. Create `backend/.env` (see variables below).
4. Run migrations:
```ps1
python manage.py migrate
```
5. Start the server:
```ps1
python manage.py runserver
```

Frontend:
1. `cd frontend`
2. Install dependencies:
```ps1
npm install
```
3. Create `frontend/.env` (see variables below).
4. Start the dev server:
```ps1
npm run dev
```

**Environment Variables**
Backend: `backend/.env`
```env
SECRET_KEY=your_django_secret_key
DATABASE_URL=postgresql://user:pass@host:5432/dbname
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

Frontend: `frontend/.env`
```env
# Base host without /api
VITE_BACKEND_URL=http://localhost:8000

# Full API base (includes /api)
VITE_API_URL=http://localhost:8000/api
```

**API Overview**
- `GET /api/products/` list products (query params: `search`, `category`, `page`).
- `GET /api/products/featured/` featured products.
- `GET /api/products/latest/` latest products.
- `GET /api/products/:id/` product detail with variants.
- `POST /api/products/admin/create/` admin product create.
- `PUT /api/products/admin/update/:id/` admin product update.
- `DELETE /api/products/admin/delete/:id/` admin product delete.
- `POST /api/auth/register/` register user.
- `POST /api/auth/login/` login and get JWT.
- `GET /api/auth/profile/` user profile (JWT required).
- `POST /api/auth/password-reset/` request password reset.
- `POST /api/auth/password-reset-confirm/:uid/:token/` confirm password reset.
- `GET /api/orders/` list user orders (JWT required).
- `POST /api/orders/` create order (JWT required).
- `PUT /api/orders/:id/update/` mark order paid (JWT required).
- `GET /api/orders/admin/orders/` admin order list.
- `PUT /api/orders/admin/orders/:id/update/` admin order status update.
- `POST /api/payments/create/` create Razorpay order (JWT required).
- `POST /api/payments/verify/` verify payment signature (JWT required).
- `POST /api/payments/webhook/` Razorpay webhook.
- `GET /api/reviews/product/:product_id/` list product reviews.
- `POST /api/reviews/product/:product_id/add/` add review (JWT required).
- `GET /api/wishlist/my/` user wishlist (JWT required).
- `POST /api/wishlist/toggle/:product_id/` toggle wishlist (JWT required).

**Frontend Routes**
- `/` home
- `/shop` product listing
- `/product/:id` product detail
- `/cart`, `/checkout`, `/orders`, `/wishlist`, `/profile`, `/account` (auth required)
- `/admin-panel` and subroutes (admin required)

**Scripts**
Frontend:
- `npm run dev` start dev server
- `npm run build` production build
- `npm run preview` preview build
- `npm run lint` lint

Backend:
- `python manage.py migrate`
- `python manage.py createsuperuser`
- `python manage.py runserver`

**Deployment**
- Render: `render.yaml` builds and runs the Django app with Gunicorn.
- Vercel: `frontend/vercel.json` enables SPA routing.

**Notes**
- `backend/server/settings.py` currently sets `DEBUG = False` and enforces SSL redirects and secure cookies. For local development, consider setting `DEBUG = True` and disabling `SECURE_SSL_REDIRECT` in that file.
- Password reset links are generated using `FRONTEND_RESET_PASSWORD_URL` in `backend/server/settings.py`. Update it to match your frontend domain.
