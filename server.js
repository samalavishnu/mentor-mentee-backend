const http    = require('http');
const express = require('express');
const path    = require('path');
const dotenv  = require('dotenv');
const cors    = require('cors');
const morgan  = require('morgan');
const connectDB  = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const initSocket = require('./socket');

dotenv.config();
connectDB();

const app        = express();
const httpServer = http.createServer(app);
initSocket(httpServer);

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'https://mentor-mentee-frontend.vercel.app/api',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Local file uploads removed — images are now served via Cloudinary URLs

// Routes
app.use('/api/auth',           require('./routes/authRoutes'));
app.use('/api/mentors',        require('./routes/mentorRoutes'));
app.use('/api/follow',         require('./routes/followRoutes'));
app.use('/api/sessions',       require('./routes/sessionRoutes'));
app.use('/api/feedback',       require('./routes/feedbackRoutes'));
app.use('/api/users',          require('./routes/userRoutes'));
app.use('/api/chat',           require('./routes/chatRoutes'));
app.use('/api/certifications', require('./routes/certificationRoutes'));

app.get('/api/health', (req, res) => res.json({ success: true, message: 'API running 🚀', timestamp: new Date() }));
app.use('*', (req, res) => res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` }));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`🚀 Server on port ${PORT} [${process.env.NODE_ENV}]`));
module.exports = app;
