# 🏢 Role-Based Property Management Platform

A full-stack web application for managing real estate operations using **role-based access control (RBAC)**.  
The system supports **Admins, Managers, and Tenants**, each with clearly defined permissions and dashboards backed by a relational database.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- Secure user login and signup
- Password hashing using **bcrypt**
- Role-based redirection after login
- Session handling using **localStorage**

### 👥 User Roles

#### **Admin**
- Manage users (admins, managers, tenants)
- Manage properties
- View overall system statistics

#### **Manager**
- Manage assigned properties
- View and manage tenants under their properties
- Handle maintenance requests
- Dynamic dashboard with live data

#### **Tenant**
- View lease details
- Submit maintenance requests
- Access assigned property information

---

## 🛠️ Tech Stack

### Frontend
- React
- React Router DOM
- Axios
- Custom CSS

### Backend
- Node.js
- Express.js
- MySQL
- bcrypt

### Database
- MySQL (Relational schema with foreign keys)

---

## 📁 Project Structure

```├── dbms_backend
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
└── dbms_frontend
    ├── public
    │   ├── favicon.ico
    │   ├── index.html
    │   ├── logo192.png
    │   ├── logo512.png
    │   ├── manifest.json
    │   └── robots.txt
    ├── src
    │   ├── pages
    │   │   ├── AdminDashboard.css
    │   │   ├── AdminDashboard.js
    │   │   ├── Login.css
    │   │   ├── Login.js
    │   │   ├── ManageMaintenance.css
    │   │   ├── ManageMaintenance.js
    │   │   ├── ManageProperties.css
    │   │   ├── ManageProperties.js
    │   │   ├── ManageTenants.css
    │   │   ├── ManageTenants.js
    │   │   ├── ManageUsers.css
    │   │   ├── ManageUsers.js
    │   │   ├── ManagerDashboard.css
    │   │   ├── ManagerDashboard.js
    │   │   ├── Signup.css
    │   │   ├── Signup.js
    │   │   ├── TenantDashboard.css
    │   │   └── TenantDashboard.js
    │   ├── App.css
    │   ├── App.js
    │   ├── App.test.js
    │   ├── PrivateRoute.js
    │   ├── index.css
    │   ├── index.js
    │   ├── logo.svg
    │   ├── reportWebVitals.js
    │   └── setupTests.js
    ├── .gitignore
    ├── README.md
    ├── package-lock.json
    └── package.json
```

---

## 🔄 Application Workflow

1. User signs up and selects a role
2. Credentials are securely stored in the database
3. On login:
   - User role is validated
   - Redirected to the respective dashboard
4. Dashboard data is fetched dynamically from the database
5. Role-based access is enforced at both frontend and backend

---

## 📊 Dynamic Dashboard Example (Manager)

- Total properties managed
- Active tenants count
- Maintenance request status  
(All values fetched live from the database)

---

## 🔌 API Endpoints (Sample)

| Method | Endpoint | Description |
|------|---------|-------------|
| POST | `/login` | User login |
| POST | `/signup` | User registration |
| GET  | `/manager/stats` | Manager dashboard statistics |
| GET  | `/tenant/lease` | Tenant lease details |

---

## ⚙️ Setup Instructions

### Backend Setup
```bash
cd dbms_backend
npm install
node server.js
```

### Frontend Setup
```bash
cd dbms_frontend
npm install
npm start
```

### Database Setup

- Create a MySQL database
- Update database credentials in db.js
- Import the required tables:
  - Users
  - Properties
  - Tenants
  - Payments
  - MaintenanceRequests

## 🚧 Future Enhancements

- JWT-based authentication
- Role-based route guards
- Payment gateway integration
- Notification system
- Admin analytics dashboard
- Docker deployment
