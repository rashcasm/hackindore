const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 5000;

// MongoDB connection URI
const mongoURI = 'mongodb+srv://Sarang123:abcdefgh@cluster0.efceamn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Complaint Schema
const complaintSchema = new mongoose.Schema({
  complaint: { type: String, required: true },
  imageUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Complaint = mongoose.model('Complaint', complaintSchema);

// Asset Model
const assetSchema = new mongoose.Schema({
  department: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },
  user_id: { type: Number, required: true },
  status: { type: Boolean, default: false },
});

const Asset = mongoose.model('Asset', assetSchema);

// User Model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  userType: { type: String, required: true, enum: ['user', 'admin'] },
});

const User = mongoose.model('User', userSchema);

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir)); // Serve static files

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('Error connecting to MongoDB', err);
    process.exit(1); // Exit the process if MongoDB connection fails
  });

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Register route
app.post('/register', async (req, res) => {
  const { email, password, first_name, last_name, userType } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, first_name, last_name, userType });
    await newUser.save();
    res.json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error registering user", error: err.message });
  }
});

// Endpoint to submit a complaint
app.post('/complaints', upload.single('image'), async (req, res) => {
  const { complaint } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

  try {
    const newComplaint = new Complaint({ complaint, imageUrl });
    await newComplaint.save();
    res.json({ success: true, message: "Complaint submitted successfully", complaint: newComplaint });
  } catch (err) {
    console.error('Error submitting complaint:', err);
    res.status(400).json({ success: false, message: "Error submitting complaint", error: err.message });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password, userType } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Email or Password" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Email or Password" });
    if (user.userType !== userType) return res.status(400).json({ message: "User type does not match" });
    res.json({ message: "Login successful", user: user });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error logging in", error: err.message });
  }
});

// Endpoint to create an asset
app.post('/assets', upload.single('image'), async (req, res) => {
  const { department, name, category, description, user_id, status } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

  try {
    const newAsset = new Asset({ department, name, category, description, user_id, status, imageUrl });
    await newAsset.save();
    res.json({ message: "Asset created successfully", asset: newAsset });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error creating asset", error: err.message });
  }
});

// Endpoint to get all assets
app.get('/assets', async (req, res) => {
  try {
    const assets = await Asset.find();
    res.json(assets);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error fetching assets", error: err.message });
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('Server is up and running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
