#Chat Application

This is a real-time chat application that supports user authentication, message sending, and message status updates (sent, delivered, read). The application also includes chatbot functionality.

Features

User Authentication (Login & Signup)

Real-time messaging using WebSockets

Message status updates (Sent, Delivered, Read)

Chatbot interaction

UI with password visibility toggle

Installation

Prerequisites

Ensure you have the following installed:

Node.js (Latest LTS version recommended)

MongoDB (if using a database)

npm or yarn

Setup

Clone the repository

Install dependencies

Environment Variables
Create a .env file in the root directory and add:

Start the server

Usage

Run npm start to start the backend server.

Open the frontend and interact with the chat system.

Messages update in real-time when both users are online.

If a user is offline, messages are marked as sent and updated to delivered when they come online.

Technologies Used

Frontend: React.js, Tailwind CSS

Backend: Node.js, Express.js, MongoDB

Real-time Communication: Socket.io

State Management: Redux

Contributing

Feel free to submit issues or pull requests to improve the application.

License

This project is licensed under the MIT License.

Happy Coding! 🚀

