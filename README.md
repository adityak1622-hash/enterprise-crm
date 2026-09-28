# Enterprise CRM System

A full-stack Enterprise CRM application for managing leads, customers, sales pipelines, activities, and user access.

## Tech Stack

- **Frontend:** React.js, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **API:** REST APIs
- **Authentication:** JWT
- **Authorization:** Role-Based Access Control (RBAC)

## Features

### Lead Management
- Create and manage leads
- Lead sources
- Sales stages
- Deal values
- Assigned sales users
- Sales pipeline tracking

### Customer Management
- Customer records
- Contact information
- Customer status
- Customer CRUD operations

### Sales Dashboard
- Total leads
- Pipeline value
- Won deals
- Total deal value
- Sales performance
- Sales value by stage

### Email & Activity Logs
- Email activity
- Phone calls
- Meetings
- Notes
- Activity history linked to leads/customers

### Authentication & RBAC
- JWT-based login
- Admin and Sales roles
- Protected REST APIs
- Admin-only delete permissions
- User logout

## Project Structure

```
enterprise-crm/
├── backend/
│   ├── src/
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── models/
│   │   │   ├── Activity.js
│   │   │   ├── Customer.js
│   │   │   ├── Lead.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── activities.js
│   │   │   ├── auth.js
│   │   │   ├── customers.js
│   │   │   └── leads.js
│   │   ├── seed.js
│   │   ├── seedUsers.js
│   │   └── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/adityak1622-hash/enterprise-crm.git
cd enterprise-crm
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/enterprise_crm
JWT_SECRET=your-secret-key
```

Start the backend:

```bash
node src/server.js
```

### 3. Create demo users

Run once:

```bash
node src/seedUsers.js
```

Demo accounts:

| Role | Email | Password |
|---|---|---|
| Admin | admin@crm.com | Admin@123 |
| Sales | sales@crm.com | Sales@123 |

### 4. Frontend setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on the Vite development server, normally:

```text
http://localhost:5173
```

## API Endpoints

### Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Register user |

### Leads

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/leads` | Get all leads |
| GET | `/api/leads/:id` | Get one lead |
| POST | `/api/leads` | Create lead |
| PUT | `/api/leads/:id` | Update lead |
| DELETE | `/api/leads/:id` | Delete lead (Admin) |

### Customers

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/customers` | Get customers |
| GET | `/api/customers/:id` | Get one customer |
| POST | `/api/customers` | Create customer |
| PUT | `/api/customers/:id` | Update customer |
| DELETE | `/api/customers/:id` | Delete customer (Admin) |

### Activities

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/activities` | Get activity logs |
| POST | `/api/activities` | Create activity |
| DELETE | `/api/activities/:id` | Delete activity (Admin) |

## Security

- Passwords are hashed using bcrypt.
- JWT tokens are used for authentication.
- Protected APIs require a valid Bearer token.
- Role-based authorization controls administrative operations.
- Environment variables are excluded from Git using `.gitignore`.

## Requirements

- Node.js
- MongoDB Server
- npm
- Git

## Future Improvements

- Email integration
- Advanced analytics and charts
- Search and filtering
- Pagination
- Notifications
- File/document attachments
- More granular permissions

## Author

**Aditya Kumar**

Built as a full-stack Enterprise CRM project using React.js, Node.js, Express.js, MongoDB and REST APIs.
