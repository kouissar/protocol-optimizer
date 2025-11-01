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

The backend server uses a `db.json` file for data persistence, so no environment variables are required for database configuration.

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
- **lowdb** for JSON file database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** enabled for cross-origin requests

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
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```

## 🧪 Development

### Available Scripts

- `npm start` - Start React development server
- `npm run dev` - Start both frontend and backend
- `npm run server` - Start backend server only
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App
- `npm run install-server` - Install server dependencies
- `npm run start-app` - Start the application using a shell script

### Project Structure

```
protocol-optimizer/
├── Dockerfile
├── deployment.yaml
├── package.json
├── public/
├── README.md
├── server/
│   ├── db.json
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server-json.js
│   ├── server-simple.js
│   └── server.js
├── service.yaml
├── src/
│   ├── components/
│   ├── contexts/
│   └── protocolData.js
├── start-app.sh
└── start-dev.js
```

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

## 🆘 Support

For issues and questions:

1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

---

**Built with ❤️ for optimizing human performance and well-being**
