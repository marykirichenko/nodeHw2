const router = require('express').Router();
const User = require('../models/user');
const Credentials = require('../models/credentials');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res)=>{
  const usernameExists = await User.findOne({username: req.body.username});
  if (usernameExists) {
    console.log('Username already exists');
    return res.status(400).json({
      'message': 'Username already exists',
    });
  }
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  const credentials = new Credentials({
    username: req.body.username,
    password: hashPassword,
  });
  const user = new User({
    username: req.body.username,
  });
  try {
    await user.save();
    await credentials.save();
    console.log('registered successfully');
    res.status(200).json(
        {
          'message': 'Success',
        });
  } catch (err) {
    console.log('registration error');
    res.status(400).json({
      'message': 'saving error, something wrong',
    });
  }
});

router.post('/login', async (req, res)=>{
  const user = await Credentials.findOne({username: req.body.username});
  if (user) {
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
      console.log('invalid password');
      return res.status(400).json({'message': 'invalid password'});
    }
    const token = jwt.sign({_id: user._id}, process.env.token);
    res.header('token-auth', token).status(200).json({
      'message': 'Success',
      'jwt_token': token,
    });
  } else {
    console.log('user dont exists');
    return res.status(400).json({
      'message': 'user dont exists',
    });
  }
});

module.exports = router;
