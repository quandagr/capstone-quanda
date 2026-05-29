# Grant's Showroom

A full-stack product inventory management application built with Flask (Python) and React, deployed on AWS EC2 with a PostgreSQL (RDS) database.

## Tech Stack

**Backend**
- Python 3 / Flask
- PostgreSQL (AWS RDS) via psycopg2
- Flask-CORS for cross-origin support

**Frontend**
- React 19 with Vite
- Tailwind CSS 4
- ESLint

**Infrastructure**
- AWS EC2 (application server)
- AWS RDS PostgreSQL (database)

## Project Structure

```
capstone-quanda/
├── app.py                  # Flask entry point, serves frontend + API
├── database.py             # DB connection and table initialization
├── requirements.txt        # Python dependencies
├── routes/
│   └── products.py         # Product CRUD API endpoints
├── capstone-frontend/      # React frontend (Vite)
│   ├── src/
│   │   ├── App.jsx
│   │   └── components/
│   │       ├── Chatbot.jsx
│   │       ├── EditModal.jsx
│   │       ├── ProductForm.jsx
│   │       └── ProductTable.jsx
│   ├── package.json
│   └── vite.config.js
└── .env                    # Environment variables (not committed)
```

## API Endpoints

| Method | Endpoint          | Description          |
|--------|-------------------|----------------------|
| GET    | `/products/`      | List all products    |
| POST   | `/products/`      | Create a product     |
| PUT    | `/products/<id>`  | Update a product     |
| DELETE | `/products/<id>`  | Delete a product     |
| GET    | `/health`         | Health check         |
| POST   | `/webhook`        | Webhook receiver     |

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 20+ and npm
- PostgreSQL database (local or RDS)

### Environment Variables

Create a `.env` file in the project root:

```env
DB_HOST=your-database-host
DB_PORT=5432
DB_NAME=your-database-name
DB_USER=your-database-user
DB_PASS=your-database-password
DB_SSLMODE=require
```

### Backend Setup

```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Linux/Mac
venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt

# Run the server
python app.py
```

The Flask server starts on `http://localhost:5000`.

### Frontend Setup

```bash
cd capstone-frontend

# Install dependencies
npm install

# Development (with proxy to Flask)
npm run dev

# Production build
npm run build
```

The dev server runs on `http://localhost:5173` and proxies API calls to Flask.

## Deployment (EC2)

1. **SSH into your EC2 instance** and clone the repo.

2. **Install Node.js** (if not already installed):
   ```bash
   # Amazon Linux 2023 / Amazon Linux 2
   curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
   sudo yum install -y nodejs

   # Ubuntu
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install Python dependencies:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

4. **Build the frontend:**
   ```bash
   cd capstone-frontend
   npm install
   npm run build
   cd ..
   ```

5. **Set up environment variables** — create `.env` in the project root.

6. **Run the application:**
   ```bash
   python app.py
   ```
   Or use a process manager like `gunicorn` for production:
   ```bash
   pip install gunicorn
   gunicorn app:app --bind 0.0.0.0:5000
   ```

7. **Security group** — ensure your EC2 security group allows inbound traffic on port 5000 (or 80 if you reverse-proxy with nginx).

## Features

- Full CRUD for product inventory (name, price, quantity, color, size)
- Real-time product table with edit and delete
- Toast notifications for user feedback
- Built-in chatbot component
- Webhook endpoint for external integrations (n8n)
- Responsive UI with dark theme and 3D card effects
