import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const auth = async (req, res, next) => {
  // console.log('Auth middleware triggered'); 

  const token = req.header('Authorization')?.replace('Bearer ', '');
  // console.log('Extracted token:', token); 

  if (!token) {
    console.error('No token provided'); // Debugging step 3
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log('Decoded token:', decoded); 

    const user = await User.findById(decoded.userId);
    // console.log('User fetched from database:', user); 

    if (!user) {
      console.error('User not found'); 
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    // console.log('User attached to request:', req.user); 

    next();
  } catch (err) {
    console.error('Error verifying token:', err.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};