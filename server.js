const express = require("express");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');  // Correct bcrypt import
const cors = require("cors");
require("dotenv").config();

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "http://localhost:3000",  // Adjust this to match your frontend URL
  credentials: true  // Allow credentials (like cookies) to be sent
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'yourSecretKey',  // Change this to a more secure key
  resave: false,
  saveUninitialized: false
}));

// Serve static files (e.g., HTML, CSS, JS) from the 'public' directory
app.use(express.static('public'));

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// User Model (Ensure the User model file is correct and imported)
const User = require('./models/User');

// LocalStrategy for Passport
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      // Hardcoded values for testing
      const hardcodedUser = {
        username: 'testuser',
        password: await bcrypt.hash('testpassword', 10) // Hash the test password
      };

      // Check if the provided username matches the hardcoded username
      if (username.trim() === hardcodedUser.username) {
        // Compare the provided password with the hardcoded hashed password
        const isMatch = await bcrypt.compare(password.trim(), hardcodedUser.password);
        console.log("Password match result for user:", username, "->", isMatch);  // Log match result

        if (isMatch) {
          return done(null, hardcodedUser); // Return the hardcoded user if the password matches
        } else {
          return done(null, false, { message: 'Incorrect password.' });
        }
      } else {
        return done(null, false, { message: 'Incorrect username.' });
      }
    } catch (err) {
      console.error("Error in LocalStrategy:", err);  // Debugging
      return done(err);
    }
  }
));

// Passport session setup
passport.serializeUser((user, done) => {
  done(null, user.username); // Use username for session
});

passport.deserializeUser((username, done) => {
  // Find user by username in hardcoded values
  if (username === 'testuser') {
    done(null, { username: 'testuser' });
  } else {
    done(null, false);
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB connected successfully");
}).catch(err => {
  console.error("MongoDB connection error:", err);
});

// Registration Route (with password hashing)
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log("Registering user:", username);

    // Hash password once
    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    // Check if user already exists to avoid duplicates
    const existingUser = await User.findOne({ username: username.trim() });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Save the new user
    const newUser = new User({
      username: username.trim(),
      password: hashedPassword
    });

    await newUser.save();

    // Log the hashed password for debugging purposes
    console.log("Hashed password for user:", username, "->", hashedPassword);
    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login Route
app.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({ message: 'Login successful', user: req.user });
});

// Logout Route
app.post('/logout', (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ error: 'Error logging out' });
    res.json({ message: 'Logged out successfully' });
  });
});

// Task Model
const TaskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);

// Task Routes

// Get all tasks (Ensure user is authenticated)
app.get("/tasks", (req, res) => {
  if (req.isAuthenticated()) {
    Task.find()
      .then(tasks => res.json(tasks))
      .catch(err => res.status(500).json({ error: err.message }));
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Create new task (Only for authenticated users)
app.post("/tasks", (req, res) => {
  if (req.isAuthenticated()) {
    const newTask = new Task(req.body);
    newTask.save()
      .then(task => res.status(201).json(task))
      .catch(err => res.status(400).json({ error: err.message }));
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Update a task
app.put("/tasks/:id", (req, res) => {
  if (req.isAuthenticated()) {
    Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(updatedTask => {
        if (!updatedTask) {
          return res.status(404).json({ error: "Task not found" });
        }
        res.json(updatedTask);
      })
      .catch(err => res.status(400).json({ error: err.message }));
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Delete a task
app.delete("/tasks/:id", (req, res) => {
  if (req.isAuthenticated()) {
    Task.findByIdAndDelete(req.params.id)
      .then(deletedTask => {
        if (!deletedTask) {
          return res.status(404).json({ error: "Task not found" });
        }
        res.json({ message: "Task deleted successfully", deletedTask });
      })
      .catch(err => res.status(400).json({ error: err.message }));
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Export the app for testing
module.exports = app;

// Start the server if this file is executed directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Route to check authentication status
app.get('/auth-status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.json({ authenticated: false });
  }
});
