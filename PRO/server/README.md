# XING Match Server

Backend server for the XING Match dating application.

## Features

- User authentication and authorization
- Profile management
- Match system
- Real-time chat using Socket.IO
- MongoDB database integration
- TypeScript support

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/xing-match
CLIENT_URL=http://localhost:5173
JWT_SECRET=your-secret-key-here
```

3. Build the TypeScript files:
```bash
npm run build
```

## Development

Start the development server with hot-reload:
```bash
npm run dev
```

## Production

Start the production server:
```bash
npm start
```

## API Endpoints

### Users
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile
- `PATCH /api/users/profile` - Update user profile
- `GET /api/users/matches` - Get potential matches
- `POST /api/users/matches/:userId` - Update match status

### Messages
- `GET /api/messages/:userId` - Get chat history with a specific user
- `POST /api/messages` - Send a new message
- `PATCH /api/messages/read/:userId` - Mark messages as read
- `GET /api/messages/unread/count` - Get unread message count

## Testing

Run tests:
```bash
npm test
```

## License

MIT 