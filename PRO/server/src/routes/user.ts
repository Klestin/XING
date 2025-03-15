import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { auth } from '../middleware/auth';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'your-secret-key-here');
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: 'Registration failed' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid login credentials');
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'your-secret-key-here');
    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ error: 'Login failed' });
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user?._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.patch('/profile', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'bio', 'age', 'location', 'preferences'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ error: 'Invalid updates' });
  }

  try {
    updates.forEach(update => {
      if (req.user) {
        req.user[update as keyof typeof req.user] = req.body[update];
      }
    });
    await req.user?.save();
    res.json(req.user);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update profile' });
  }
});

// Get potential matches
router.get('/matches', auth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) throw new Error();

    const potentialMatches = await User.find({
      _id: { $ne: user._id },
      age: { $gte: user.preferences.ageRange.min, $lte: user.preferences.ageRange.max },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: user.location.coordinates
          },
          $maxDistance: user.preferences.distance * 1000 // Convert km to meters
        }
      }
    }).select('-password');

    res.json(potentialMatches);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

// Update match status
router.post('/matches/:userId', auth, async (req, res) => {
  try {
    const user = req.user;
    const matchedUser = await User.findById(req.params.userId);
    
    if (!user || !matchedUser) {
      throw new Error('User not found');
    }

    if (!user.matches.includes(matchedUser._id)) {
      user.matches.push(matchedUser._id);
      matchedUser.matches.push(user._id);
      await Promise.all([user.save(), matchedUser.save()]);
    }

    res.json({ message: 'Match updated successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update match' });
  }
});

export default router; 