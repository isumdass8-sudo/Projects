# 🏨 Grand Azure – Hotel Management System



#3498DB










Full-stack Hotel Management System using **Node.js + Express + MongoDB + HTML/CSS/JS**

---

## 📁 Project Structure

```
hotel-mongo/
├── backend/
│   ├── config/
│   │   └── db.js              ← MongoDB connection (Mongoose)
│   ├── middleware/
│   │   └── auth.js            ← JWT auth + role check
│   ├── models/
│   │   └── index.js           ← ALL Mongoose schemas/models
│   ├── routes/
│   │   ├── auth.js            ← Login, OTP, register, logout
│   │   ├── users.js           ← User management (admin only)
│   │   ├── rooms.js           ← Rooms + maintenance
│   │   ├── reservations.js    ← Bookings, check-in/out, email
│   │   └── other.js           ← Guests, billing, events, feedback, reports
│   ├── seed.js                ← Populate database with default data
│   ├── server.js              ← Main Express server
│   ├── package.json
│   └── .env.example
├── frontend/
│   └── index.html             ← Complete frontend (single file)
└── README.md
```

---

## ⚙️ Setup Instructions (Step by Step)

### Step 1 — Install MongoDB
Download and install MongoDB Community Edition:
👉 https://www.mongodb.com/try/download/community

After install, make sure MongoDB is running:
```bash
# Windows: MongoDB runs as a service automatically
# Mac:
brew services start mongodb-community
# Linux:
sudo systemctl start mongod
```

### Step 2 — Install Node.js
Download from https://nodejs.org (use LTS version)

### Step 3 — Setup Backend
```bash
cd backend
npm install
```

Create `.env` file:
```bash
# Windows:
copy .env.example .env
# Mac/Linux:
cp .env.example .env
```

Open `.env` and set your values:
```env
MONGO_URI=mongodb://localhost:27017/hotel_management
JWT_SECRET=any_random_long_string_here_12345
PORT=5000
NODE_ENV=development

# Email (optional - OTP shows on screen if not set)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

### Step 4 — Seed the Database (IMPORTANT!)
This creates all the default rooms, users, halls, etc.
```bash
node seed.js
```

You should see:
```
Connected to MongoDB...
✅ Users created
✅ Room types created
✅ Rooms created
✅ Halls created
✅ Event packages created

🎉 Seed complete!
Login: admin / admin123
```

### Step 5 — Start the Server
```bash
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🏨 Hotel Management Server → http://localhost:5000
```

### Step 6 — Open the Frontend
Open `frontend/index.html` in your browser.
> Tip: Use the **Live Server** extension in VS Code for best experience.

---

## 🔑 Login Credentials

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Admin (full access) |
| receptionist1 | admin123 | Receptionist |
| staff1 | admin123 | Staff |

### About OTP:
- When you login, a 6-digit OTP is generated
- If email is **not** configured → OTP appears in a **yellow box on screen** (demo mode)
- If email **is** configured → OTP is sent to the staff email

---

## 🧩 All Modules

| Module | Who Can Use |
|--------|-------------|
| Dashboard | All staff |
| Room Management | Admin, Receptionist |
| Reservations (CRUD + Check-in/out) | Admin, Receptionist, Clients |
| Guest Management | Admin, Receptionist |
| Billing & Payment | Admin, Receptionist |
| Event Management | Admin, Receptionist, Clients |
| Reports (Daily/Weekly/Monthly) | Admin |
| Feedback | Everyone |
| User Management | Admin only |
| Maintenance | Admin, Receptionist |
| Login Report | Admin only |

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Staff login step 1 |
| POST | /api/auth/verify-otp | Staff login step 2 |
| POST | /api/auth/client/register | Client register |
| POST | /api/auth/client/login | Client login |
| GET | /api/rooms | Get all rooms |
| GET | /api/rooms/available | Get available rooms |
| POST | /api/rooms | Add room |
| GET | /api/reservations | Get reservations |
| POST | /api/reservations | Create reservation |
| PUT | /api/reservations/:id/checkin | Check-in guest |
| PUT | /api/reservations/:id/checkout | Check-out guest |
| POST | /api/billing | Generate bill |
| PUT | /api/billing/:id/pay | Confirm payment |
| GET | /api/events | Get events |
| POST | /api/events | Create event |
| GET | /api/reports/dashboard | Dashboard stats |
| GET | /api/reports/profit-loss | P&L report |
| GET | /api/users/login-report | Weekly login log |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JS |
| Backend | Node.js + Express.js |
| Database | **MongoDB** (via Mongoose ODM) |
| Auth | JWT + bcryptjs + OTP |
| Email | Nodemailer (Gmail SMTP) |

---

## 🐛 Troubleshooting

**"MongoDB connection failed"**
→ Make sure MongoDB is installed and running (`mongod` service)

**"Cannot find module"**
→ Run `npm install` inside the `backend/` folder

**Login not working**
→ Make sure you ran `node seed.js` first to create the default users

**OTP not showing**
→ Make sure `NODE_ENV=development` is in your `.env` file
