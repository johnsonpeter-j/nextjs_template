# Next.js Template with Auth & User Management

A boilerplate Next.js web application providing authentication APIs and basic user management. Ready to jumpstart projects with secure auth and CRUD operations.

## Features
- **User Authentication:** Sign-up, Sign-in, Sign-out, Forgot Password (JWT-based)
- **User Management:** Create, Read, Update, Delete users via API
- **Secure APIs:** JWT authentication for protected routes
- **Email Notifications:** SMTP integration for password reset and alerts
- **Responsive UI:** Ready for frontend integration

## Tech Stack
- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Next.js API routes, Node.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT
- **Email:** SMTP

## Setup
1. Clone the repository  
2. Install dependencies: `npm install`  
3. Create a `.env.local` file in the root directory and add the following variables:

```env
NODE_ENV=production

MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net
DB_NAME=expense_tracker

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-password

JWT_SECRET=your_super_secret_key 
4. Run the development server: `npm run dev`
```

## License
MIT