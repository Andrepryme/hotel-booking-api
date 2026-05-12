# Apartment Booking API

A scalable backend API for apartment booking and reservation management built with Node.js and Express.

---

# Features

- JWT Authentication
- Role-Based Access Control
- Apartment Management
- Booking System
- Protected Routes
- Validation & Error Handling
- Clean Architecture
- Service & Repository Pattern
- Payment Integration Ready

---

# Tech Stack

- Node.js
- Express.js
- PostgreSQL/MySQL
- JWT Authentication
- Git & GitHub

---

# Project Structure

```txt
src/
│
├── config/
├── controllers/
├── db/
├── middlewares/
├── repositories/
├── routes/
├── services/
├── utils/
uploads/
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/Andrepryme/hotel-booking-api.git
```

## Install Dependencies

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

---

# Environment Variables

Create a `.env` file and add:

```env
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
```

---

# Authentication Routes

```http
POST /auth/register
POST /auth/login
```

---

# Apartment Routes

```http
GET /apartments
POST /apartments
PUT /apartments/:id
DELETE /apartments/:id
```

---

# Booking Routes

```http
POST /bookings
GET /bookings/:id
```

---

# API Testing

Use Postman or similar API testing tools to test endpoints.

---

# Author

Backend Engineer focused on scalable API systems, authentication, bookings, and payment integrations.
