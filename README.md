# IncidentHub

IncidentHub is a RESTful API designed to manage internal incidents for support, IT operations, and service management teams.  
It provides authentication with JWT, incident tracking, service management, role-based access control, and audit logs — all built with TypeScript, Express, Prisma, PostgreSQL, and Docker.

## 🚀 Production Deployment

- **API Base URL:** https://incidenthub-kxjp.onrender.com  

### **Frontend Dashboard**
- **Frontend Deployment:** https://incident-89vl06psn-julians-projects-389143e1.vercel.app 
- **Local Development:** http://localhost:5173 


---

# 📌 Features

### 🔐 Authentication & Users
- User registration
- Login with JWT
- Password hashing using bcrypt
- Role-based access (`REPORTER`, `SUPPORT`, `ADMIN`)
- Auth middleware for protected routes

### 🛠️ Incident Management
- Create, read, update incidents
- Assign reporter and support agent
- Add comments and timeline updates
- Severity levels:
  - `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
- Status workflow:
  - `OPEN` → `INVESTIGATING` → `RESOLVED`
- Filtering by status and service

### 📦 Service Management
- Create new services (ADMIN only)
- List existing services

### 🧩 Developer Experience
- Zod request validation
- UUID-based request tracing middleware
- Rate limiting for auth endpoints
- Helmet for security
- CORS configured
- Error handler with structured JSON logs
- OpenAPI 3.0 documentation auto-generated

## 🖥️ Frontend Dashboard (React)
A modern, responsive dashboard built with:

- **React + TypeScript**
- **Vite**
- **TailwindCSS v4**
- **React Query (TanStack Query)**
- **Axios**
- **React Router v6**

### Frontend Features
- Login screen  
- Incident dashboard with filters  
- Service dropdown and severity badges  
- Incident detail page  
- Status changer (Support/Admin only)  
- Add comments/updates  
- Admin panel for service creation  
- Mobile-friendly layout  

---



# 🧱 Tech Stack

- **Runtime:** Node.js 20  
- **Language:** TypeScript  
- **Framework:** Express 5  
- **Database:** PostgreSQL 16  
- **ORM:** Prisma  
- **Authentication:** JWT + bcrypt  
- **Validation:** Zod  
- **Documentation:** Swagger (OpenAPI 3)  
- **Containers:** Docker & Docker Compose  
- **Deployment:** Render  

---

# 📂 Project Structure

```text
IncidentHub/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── src/
│       ├── index.ts
│       ├── app.ts
│       ├── modules/
│       │   ├── auth/
│       │   ├── services/
│       │   └── incidents/
│       ├── middleware/
│       ├── utils/
│       └── docs/
│
├── frontend/
│   ├── index.html
│   ├── vite.config.ts
│   ├── package.json
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── styles/
│       └── router/
```

## ⚙️ Environment Variables

Create a `.env` file inside `/backend`:
```code
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/incidenthub?schema=public"
JWT_SECRET="your-secret-key"
PORT=4001
```

## 🐳 Running with Docker (Recommended)

From the root folder:

```code
docker-compose up --build
```
This will start:
- PostgreSQL on port **5432**
- API on port **4001**

Access:
- Local API: http://localhost:4001
- Swagger: http://localhost:4001/docs

## 💻 Running Locally Without Docker

```
cd backend
npm install

npm run prisma:generate
npm run prisma:migrate

npm run seed

Seeded admin user:
email:    admin@incidenthub.dev
password: admin12345

npm run dev
```

## 🔐 Authentication Flow

### 1. Register a new user  
**POST /auth/register**

```json
{
  "email": "user@example.com",
  "name": "User Name",
  "password": "password123",
  "role": "REPORTER"
}
```
### 2. Login  
**POST /auth/login**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Use the token in protected routes:

```
Authorization: Bearer <JWT>
```

## 📌 API Endpoints Summary

### Health
| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/health` | API status |

### Auth
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/auth/register` | Create user |
| POST | `/auth/login` | Login & get JWT |

### Services
| Method | Endpoint | Role | Description |
|--------|-----------|--------|-------------|
| GET | `/services` | Any authenticated | List services |
| POST | `/services` | ADMIN | Create service |

### Incidents
| Method | Endpoint | Role | Description |
|--------|-----------|--------|-------------|
| GET | `/incidents` | Any | List incidents + filters |
| GET | `/incidents/:id` | Any | Incident details |
| POST | `/incidents` | REPORTER | Create incident |
| PUT | `/incidents/:id/status` | SUPPORT/ADMIN | Update status |
| POST | `/incidents/:id/comment` | Any | Add comment |

Full documentation: **Swagger UI** at `/docs`.

## 🧪 Testing

Run all tests:

```code
npm run test
```

## 🌱 Database Seed

Run:

```code
npm run seed
```

This creates:
- An Admin user  
- Default services  

Admin credentials:
email:    admin@incidenthub.dev
password: admin12345


## 🏁 Final Notes

IncidentHub is a production-ready backend designed to demonstrate:

- Clean modular architecture  
- Prisma + PostgreSQL + Docker  
- JWT authentication  
- Structured logging  
- Request validation  
- Swagger documentation  
- Role-based access control  
- Professional API deployment with Render  

