# Course-box

A full-stack online learning platform where students can explore courses, make secure payments, and access their learning dashboard instantly after enrollment.

## Live Demo

🔗 https://course-box.vercel.app/

## Features

- Sign up and log in with Google (Firebase Auth)
- Browse courses with search and filters
- Buy a course using Razorpay and get instant access after payment
- Course thumbnails and videos handled through ImageKit
- Role-based access — students, instructors, and admins all see different things
- API protected with rate limiting

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React • Tailwind CSS • Swiper.js |
| **Backend** | Node.js • Express.js |
| **Database** | MongoDB • Mongoose |
| **Authentication** | Firebase Google Authentication • JWT (HTTP-Only Cookies) |
| **Payments** | Razorpay |
| **Media Storage** | ImageKit |


## How to Run Locally

1. Clone the repo
```bash
git clone https://github.com/dharmapal25/course-box.git
cd course-box
```

2. Install dependencies for both frontend and backend
```bash
cd server
npm install

cd /client
npm install
```

3. Create a `.env` file inside the `server` folder with:
```env
# Server
PORT=3000

# Database
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# ImageKit
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key

# Frontend URL
CLIENT_URL=http://localhost:5173

# Firebase
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY="your_firebase_private_key"
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
```

4. Run backend and frontend (in separate terminals)
```bash
# backend
cd server
npm run dev

# frontend
cd client
npm run dev
```

5. Open `http://localhost:5173` (or whatever port your frontend runs on) in your browser
