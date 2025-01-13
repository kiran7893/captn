# CAPTN

## MERN Stack Project

### Description

This project is a full-stack web application built using the MERN stack: MongoDB, Express, React, and Node.js.

### Features

- User authentication with JWT (JSON Web Tokens)
- Dynamic CRUD operations (Create, Read, Update, Delete)
- RESTful API built with Node.js and Express
- MongoDB as the database for storing application data
- Real-time data handling

### Tech Stack

- **Frontend**: React.js, Tailwind CSS, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

### Setup Instructions

#### 1. Clone the repository

```bash
git clone https://github.com/kiran7893/captn.git
cd captn
```

#### 2. Install dependencies

**Backend**

Navigate to the backend directory and install the dependencies:

```bash
cd server
npm install
```

**Frontend**

Navigate to the frontend directory and install the dependencies:

```bash
cd client
npm install
```

#### 3. Configure environment variables

You will need to create a `.env` file in the `server` directory. Below are the environment variables you'll need:

**Backend `.env`**

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/your-database-name
JWT_SECRET=your-secret-key
```

#### 4. Run the project

**Backend**

To start the backend server:

```bash
cd server
node app.js
```

**Frontend**

To start the frontend development server:

```bash
cd client
npm run dev
```

### Usage

- **User Registration & Login**: Users can sign up and log in to the application using JWT authentication.
- **CRUD Operations**: The backend provides RESTful API routes for performing CRUD operations on the data.

### Deployment

The application can be deployed using the following services:

- **Frontend**: [Netlify](https://www.netlify.com)
- **Backend**: [Render](https://render.com)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

#### Deployment URLs

- **Backend**: [https://captn.onrender.com](https://captn.onrender.com)
- **Frontend**: [https://charming-sunburst-fc5328.netlify.app](https://charming-sunburst-fc5328.netlify.app)
