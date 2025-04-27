# WeHelp - Connecting Donors with Those in Need

WeHelp is a web application that connects donors with individuals who need assistance. Donors can browse requests and offer help, while those in need can create requests for specific items or assistance.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/try/download/community) (v4.4 or higher)
- [Git](https://git-scm.com/downloads)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/wehelp.git
cd wehelp
```

### 2. Set Up the Backend

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with the following content:

```env
MONGODB_URI=mongodb://localhost:27017/wehelp
JWT_SECRET=your_jwt_secret_here
PORT=5000
```

Start the backend server:

```bash
npm start
```

The backend server will run on http://localhost:5000

### 3. Set Up the Frontend

Open a new terminal, navigate to the frontend directory, and install dependencies:

```bash
cd frontend
npm install
```

Start the frontend development server:

```bash
npm start
```

The frontend application will run on http://localhost:3000

## Using the Application

1. Open your browser and navigate to http://localhost:3000
2. You can:
   - Register as a donor to help others
   - Register as a receiver to create requests for help
   - Browse available requests
   - Make donations to help others

## Project Structure

```
wehelp/
├── backend/             # Backend server code
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   └── server.js       # Server entry point
├── frontend/           # Frontend React application
│   ├── public/        # Static files
│   └── src/           # React source code
│       ├── components/ # Reusable components
│       ├── pages/     # Page components
│       └── App.js     # Main application component
└── README.md          # Project documentation
```

## Features

- User authentication (Donors and Receivers)
- Create and manage donation requests
- Browse available requests
- Make donations
- Track donation status
- Anonymous donations option
- Secure pickup verification system

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers. 