# Visitor Management System

A full-stack web application for managing visitor registrations, approvals, and check-ins/check-outs in an organization.
A robust backend for a Visitor Management System built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- Role-based JWT authentication (Visitor and Admin roles)
- Visitor registration and management
- Visit request submission and approval workflow
- Check-in and check-out functionality with QR codes and passcodes
- Pre-approval system for expected visitors
- Photo upload and management
- Email notifications

## Installation

1. Clone the repository
```
git clone https://github.com/yourusername/visitor-management-backend.git
cd visitor-management-backend
```

2. Install dependencies
```
npm install
```

3. Create a `.env` file in the root directory and add your environment variables (see `.env.example` file)

4. Start the server
```
npm run dev
```

## API Documentation


## API Endpoints

## Authentication
Endpoint | Method | Description 
/api/auth/register | POST | Register new user (visitor only)
/api/auth/login | POST | Log in and receive JWT token 
/api/auth/me | GET | Get current logged-in user 

🙋‍♂️ Visitor Routes

Endpoint	Method	Description	Auth Required
/api/visitor/visit	POST	Create a new visit request	✅
/api/visitor/visits	GET	Get all visits of the logged-in user	✅
/api/visitor/checkin	POST	Check-in using passcode	✅
/api/visitor/checkout/:visitId	PUT	Check-out from a visit	✅

🛡️ Admin Routes

Endpoint	Method	Description	Auth Required
/api/admin/visits	GET	Get all visit requests	✅ (admin)
/api/admin/visits/status/:status	GET	Get visits filtered by status	✅ (admin)
/api/admin/visits/today	GET	Get today’s scheduled visits	✅ (admin)
/api/admin/visits/:visitId	PUT	Approve or reject a visit	✅ (admin)
/api/admin/preapproval	POST	Create a pre-approval for a visitor	✅ (admin)
/api/admin/preapproval	GET	Get all pre-approvals	✅ (admin)
/api/admin/preapproval/:preApprovalId	PUT	Update pre-approval status	✅ (admin)
/api/admin/users	GET	Get all users (excluding passwords)	✅ (admin)
/api/admin/users/:userId/role	PUT	Change a user’s role	✅ (admin)
📸 Photo Upload

Endpoint	Method	Description	Auth Required
/api/photo/upload	POST	Upload visitor profile photo	✅ (form-data)
/api/photo/:userId	GET	Retrieve visitor photo file	✅



## Technical Implementation

- **Authentication**: JWT-based authentication with role-based access control
- **Database**: MongoDB with Mongoose ORM
- **File Uploads**: Multer for handling photo uploads
- **QR Codes**: Generated on the fly for each visit request
- **Email Notifications**: Automated emails for visit approvals, check-ins, etc.

## Project Structure

```
visitor-management-backend/
├── config/           # Configuration files
├── controllers/      # Request handlers
├── middleware/       # Custom middleware
├── models/           # Database models
├── routes/           # API routes
├── uploads/          # Uploaded files
├── utils/            # Utility functions
├── .env              # Environment variables
└── server.js         # Entry point
```

## License

MIT


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
- Multer for file uploads
- QRCode for generating QR codes

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- SMTP server (for email notifications)




