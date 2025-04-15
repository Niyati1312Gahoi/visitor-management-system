# Visitor Management System

A full-stack web application for managing visitor registrations, approvals, and check-ins/check-outs in an organization.

## Features

- **Visitor Registration**: Capture visitor details including name, contact information, purpose of visit, and photo
- **Approval Workflow**: Real-time notifications to host employees for visitor approvals
- **Pre-Approval System**: Generate QR codes for pre-approved visitors
- **Role-Based Access Control**: Different roles for Admins, Receptionists, and Guards
- **Real-time Notifications**: Email and SMS notifications for visitor registrations and approvals
- **Dashboard**: Overview of visitor statistics and recent activities
- **Profile Management**: User profile and password management

## Tech Stack

### Frontend
- React with Vite
- Material-UI for UI components
- Formik and Yup for form handling and validation
- React Router for navigation
- Axios for API calls
- React Toastify for notifications

### Backend
- Node.js with Express.js
- MongoDB for database
- JWT for authentication
- Nodemailer for email notifications
- Twilio for SMS notifications
- Multer for file uploads
- QRCode for generating QR codes

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Twilio account (for SMS notifications)
- SMTP server (for email notifications)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/visitor-management.git
cd visitor-management
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create environment files:

Backend (.env):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/visitor-management
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

NODE_ENV=development
```

5. Start the backend server:
```bash
cd backend
npm run dev
```

6. Start the frontend development server:
```bash
cd frontend
npm run dev
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user
- PUT /api/auth/me - Update user profile
- PUT /api/auth/password - Change password

### Visitors
- GET /api/visitors - Get all visitors
- GET /api/visitors/:id - Get single visitor
- POST /api/visitors - Register new visitor
- PUT /api/visitors/:id - Update visitor
- PUT /api/visitors/:id/status - Update visitor status
- PUT /api/visitors/:id/checkin - Check-in visitor
- PUT /api/visitors/:id/checkout - Check-out visitor

## User Roles

- **Admin**: Full access to all features
- **Vistor**: Can register visitors and manage check-ins/check-outs


## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Material-UI for the UI components
- React community for the amazing ecosystem
- MongoDB for the database
- Twilio for SMS notifications 
