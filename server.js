require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const app = express();

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/iptvportal', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

// Models
const User = require('./models/User');
const Customer = require('./models/Customer');
const Stream = require('./models/Stream');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
};

// Routes
app.get('/', isAuthenticated, (req, res) => {
  res.redirect('/dashboard');
});

app.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('login', { message: null });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  
  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.user = user;
    return res.redirect('/dashboard');
  }
  
  res.render('login', { message: 'Invalid credentials' });
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

app.get('/dashboard', isAuthenticated, async (req, res) => {
  const customersCount = await Customer.countDocuments();
  const streamsCount = await Stream.countDocuments();
  res.render('dashboard', { user: req.session.user, customersCount, streamsCount });
});

// Customers routes
app.get('/customers', isAuthenticated, async (req, res) => {
  const customers = await Customer.find();
  res.render('customers', { customers });
});

app.post('/customers', isAuthenticated, async (req, res) => {
  const { name, email, macAddress, expiryDate, status } = req.body;
  const customer = new Customer({ name, email, macAddress, expiryDate, status });
  await customer.save();
  res.redirect('/customers');
});

// Streams routes
app.get('/streams', isAuthenticated, async (req, res) => {
  const streams = await Stream.find();
  res.render('streams', { streams });
});

app.post('/streams', isAuthenticated, upload.single('logo'), async (req, res) => {
  const { name, category, url } = req.body;
  const logo = req.file ? `/uploads/${req.file.filename}` : '';
  const stream = new Stream({ name, category, url, logo });
  await stream.save();
  res.redirect('/streams');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
