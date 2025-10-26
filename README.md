# 🧬 Huberman Protocol Optimizer

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
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd k8s-react-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   npm run install-server
   ```

3. **Set up MongoDB**

   - Install MongoDB locally or use MongoDB Atlas
   - Update the connection string in `server/.env` if needed

4. **Start the development servers**
   ```bash
   npm run dev
   ```
   This will start both the frontend (React) and backend (Node.js) servers.

### Alternative: Manual Start

If you prefer to start servers separately:

**Terminal 1 - Backend:**

```bash
cd server
npm start
```

**Terminal 2 - Frontend:**

```bash
npm start
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `server` directory:

```env
MONGODB_URI=mongodb://localhost:27017/huberman-protocols
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
```

### API Endpoints

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

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

- **MongoDB** for data persistence
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

### Project Structure

```
k8s-react-app/
├── src/
│   ├── components/          # React components
│   ├── contexts/           # React contexts
│   └── protocolData.js     # Protocol definitions
├── server/                 # Backend server
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   └── middleware/         # Auth middleware
├── public/                 # Static assets
└── k8s/                   # Kubernetes configs
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
