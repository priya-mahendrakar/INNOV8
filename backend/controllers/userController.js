const User = require('../models/user');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.getUserById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ id: user.id, email: user.email, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { username } = req.body;
    const updated = await User.updateUserProfile(req.user.userId, username);
    if (!updated) return res.status(400).json({ message: 'Update failed' });

    res.json({ message: 'Profile updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
