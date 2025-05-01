import express from 'express';
import { body, validationResult } from 'express-validator';
const router = express.Router();
import jwt from 'jsonwebtoken';
import User from '../models/User.js';


// Signup validation
const signupValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').notEmpty().trim(),
  body('country').notEmpty().trim()
];

// Login validation
const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

// Signup route
router.post('/signup', signupValidation, async (req, res) => {
  // console.log(" Request body:", req.body);

  try {
    // Step 1: Validate the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // console.log("DEBUG: Validation errors found:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    // console.log("DEBUG: Validation passed.");

    // Step 2: Extract data from the request body
    const { email, password, name, country } = req.body;
    // console.log("Email:", email, "Name:", name, "Country:", country);

    // Step 3: Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // console.log(" User with email already exists:", email);
      return res.status(400).json({ error: 'Email already exists' });
    }
    console.log("DEBUG: No existing user found with email:", email);

    // Step 4: Create a new user
    const user = new User({ email, password, name, country });
    console.log("DEBUG: New user object created:", user);

    // Step 5: Save the user to the database
    await user.save();

    // Step 6: Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    // Step 7: Send a success response
    res.status(201).json({ message: "Sign Up Successfully", data: token });
    console.log("DEBUG: Response sent with status 201.");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login route
router.post('/login', loginValidation, async (req, res) => {
  // console.log("Login data received:", req.body); 

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // console.error("Validation errors:", errors.array()); 
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    // console.log("Extracted email and password:", { email, password }); 

    const user = await User.findOne({ email });
    // console.log("User fetched from database:", user); 

    if (!user || !(await user.comparePassword(password))) {
      // console.error("Invalid credentials for email:", email); 
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, Username: user.name }, process.env.JWT_SECRET);
    // console.log("JWT token generated:", token); 

    res.json({ message: "Login Successfully", token: token });
    // console.log("Login response sent successfully"); 
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(400).json({ error: error.message });
  }
});

export default router;