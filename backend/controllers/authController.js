const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      salonId: user.salonId,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ error: 'Invalid email or password' });
  }
};

const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = { loginUser, getMe };
