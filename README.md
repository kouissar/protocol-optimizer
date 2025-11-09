# 🧬 Multi-Expert Protocol Optimizer

A comprehensive lifestyle optimization app based on Dr. Andrew Huberman's evidence-based protocols for health, productivity, and performance optimization.

## ✨ Features

### 🔐 User Authentication

- **Secure Registration & Login** with JWT tokens
- **Persistent User Data** - your protocols and progress are saved
- **User Profile Management** with preferences

### 📚 Protocol Library

- **6 Categories**: Morning Routine, Sleep, Exercise, Nutrition, Focus, Recovery
- **12+ Detailed Protocols** including Morning Light Exposure, Cold Exposure, NSDR
- **Beautiful Material Design** with expandable cards and visual indicators
- **Smart Filtering** by category with difficulty levels

### 🏠 Personal Wall

- **Add/Remove Protocols** to your personal dashboard
- **Progress Tracking** with sliders, notes, and visual feedback
- **Visual Cards** showing completion status and streaks
- **Real-time Updates** with backend synchronization

### 📊 Progress Analytics

- **Overall Progress** with trend indicators
- **Streak Tracking** for consistency
- **Top Performers** and protocols needing attention
- **Timeframe Views** (daily, weekly, monthly)
- **Visual Progress Bars** and performance metrics

### 📱 Mobile-First Design

- **Fully Responsive** - works on desktop, tablet, and mobile
- **Touch-Friendly** interactions and navigation
- **Material Design** principles throughout
- **Cross-Platform** compatibility

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd protocol-optimizer
   ```

2. **Install dependencies**

   ```bash
   npm install
   npm run install-server
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```
   This will start both the frontend (React) and backend (Node.js) servers.

### Alternative: Manual Start

If you prefer to start servers separately:

**Terminal 1 - Backend:**

```bash
npm run server
```

**Terminal 2 - Frontend:**

```bash
npm start
```

## 🔧 Configuration

### Environment Variables

The backend server uses **Lowdb** for file-based JSON storage. No database environment variables are required. The following optional environment variables can be set:

- `PORT` - Server port (default: 5000)
- `JWT_SECRET` - Secret key for JWT token signing (default: 'your-secret-key')

**Note:** For production, always set a strong `JWT_SECRET` environment variable.

### Database

The application uses **Lowdb** (v7.0.1) for data persistence. All data is stored in `server/db.json`:

- **File Location**: `server/db.json`
- **Format**: JSON
- **Automatic Persistence**: Data is automatically saved on every write operation
- **No Setup Required**: The database file is created automatically on first run
- **Backup**: Simply copy `server/db.json` to backup your data

**Database Structure:**

```json
{
  "users": [
    {
      "id": "user-id",
      "name": "User Name",
      "email": "user@example.com",
      "password": "hashed-password",
      "protocols": [],
      "preferences": {
        "notifications": true,
        "theme": "light"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "lastLogin": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### API Endpoints

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

**Note:** The `npm start` script has a hardcoded API URL (`http://192.168.1.169:5000`). If your backend is running on a different IP address, you will need to update the `start` script in `package.json`.

## 📱 Usage

1. **Register/Login**: Create an account or sign in
2. **Browse Protocols**: Explore the protocol library by category
3. **Add to Wall**: Select protocols that interest you
4. **Track Progress**: Update your daily progress with notes
5. **View Analytics**: Monitor your performance and streaks

## 🏗️ Architecture

### Frontend (React)

- **Material-UI** for consistent design system
- **Context API** for state management
- **Axios** for API communication
- **Responsive Design** with mobile-first approach

### Backend (Node.js/Express)

- **Express** for the server framework
- **Lowdb** (v7.0.1) for JSON file-based database
- **JWT** (jsonwebtoken) for authentication
- **bcryptjs** for password hashing
- **CORS** enabled for cross-origin requests
- **File-based Storage** - All data persisted in `server/db.json`

### Data Models

- **User Model**: Authentication, protocols, progress, preferences
- **Protocol Schema**: Title, description, category, difficulty, benefits
- **Progress Tracking**: Value, notes, timestamps

## 🚀 Deployment

### Docker Deployment

The app includes Docker configuration for containerized deployment:

```bash
# Build and run with Docker
docker build -t huberman-app .
docker run -p 3000:3000 huberman-app
```

### Kubernetes Deployment

Includes Kubernetes manifests for production deployment:

```bash
# 1. Create secret
kubectl create secret generic react-app-secrets \
  --from-literal=jwt-secret=$(openssl rand -base64 32)

# 2. Create PVC
kubectl apply -f pvc.yaml

# 3. Build and load image (if using local cluster)
docker build -t optimizer-app .
minikube image load optimizer-app  # or equivalent

# 4. Deploy
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml

```

### Database & Data Persistence

The application uses **Lowdb** (v7.0.1) for file-based JSON storage. This provides a simple, lightweight database solution that works well for both development and production environments.

**Key Features:**

- ✅ **Zero Configuration** - No database server setup required
- ✅ **Automatic Persistence** - Data saved automatically on every write
- ✅ **Easy Backup** - Simply copy `server/db.json` to backup
- ✅ **Portable** - Database is a single JSON file
- ✅ **Fast** - In-memory operations with file sync

**Server Files:**

- `server/server.js` - Main server using Lowdb (recommended for production)
- `server/server-simple.js` - Alternative Lowdb implementation
- `server/server-json.js` - Manual JSON file handling (legacy)

**Data Location:** `server/db.json`

**Important Notes:**

- The database file is created automatically on first run
- Ensure the `server/` directory has write permissions
- For production, consider implementing regular backups of `db.json`
- For high-traffic applications, consider migrating to PostgreSQL or MongoDB

## 🧪 Development

### Available Scripts

- `npm start` - Start React development server (frontend only)
- `npm run dev` - Start both frontend and backend servers concurrently
- `npm run server` - Start backend server only (uses `server/server-json.js`)
- `npm run build` - Build React app for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (irreversible)
- `npm run install-server` - Install server dependencies
- `npm run start-app` - Start the application using a shell script

**Backend Server:**
The main server file is `server/server.js` which uses Lowdb. To run it directly:

```bash
cd server
node server.js
# or
npm start  # (from server directory)
```

### Project Structure

```
protocol-optimizer/
├── Dockerfile
├── deployment.yaml
├── package.json
├── public/
├── README.md
├── server/
│   ├── db.json              # Lowdb database file (auto-generated)
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── models/              # (Legacy - not used with Lowdb)
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   └── user.js          # User and protocol routes
│   ├── server.js            # Main server (uses Lowdb) ⭐
│   ├── server-json.js       # Alternative server (manual JSON)
│   └── server-simple.js     # Alternative server (Lowdb)
├── service.yaml
├── src/
│   ├── components/
│   ├── contexts/
│   └── protocolData.js
├── start-app.sh
└── start-dev.js
```

**Note:** The `server/models/` directory contains legacy Mongoose models that are no longer used. The application now uses Lowdb directly.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Dr. Andrew Huberman** for the evidence-based protocols
- **Material-UI** for the design system
- **React** community for the excellent ecosystem

## 🆘 Support & Troubleshooting

### Common Issues

**Database Issues:**

- If `db.json` is missing, it will be created automatically on server start
- Ensure the `server/` directory has write permissions
- If data seems corrupted, check `db.json` syntax (must be valid JSON)

**Server Won't Start:**

- Check if port 5000 is already in use: `lsof -i :5000`
- Verify all dependencies are installed: `npm run install-server`
- Check server logs for specific error messages

**Authentication Issues:**

- Clear browser localStorage if experiencing token issues
- Ensure `JWT_SECRET` is set consistently across restarts (if using env var)

### Getting Help

For issues and questions:

1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information including:
   - Node.js version
   - Operating system
   - Error messages/logs
   - Steps to reproduce

---

**Built with ❤️ for optimizing human performance and well-being**
