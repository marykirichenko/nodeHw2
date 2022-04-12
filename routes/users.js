const router = require('express').Router();
const User = require('../models/user');
const Credentials = require('../models/credentials');
const verify = require('./verifyToken');

router.get('/me', verify, async (req, res)=>{
  try {
    const currCredentials = await Credentials.find({_id: req.user._id});
    const currUser = await User.find({username: currCredentials[0].username});
    res.status(200).send({
      user: {
        _id: currUser[0]._id,
        username: currCredentials[0].username,
        createdDate: currUser[0].createdDate,
      },
    });
  } catch (err) {
    res.status(400).json({
      'message': 'user error',
    });
  }
});

router.delete('/me', verify, async (req, res)=>{
  try {
    const currCredentials = await Credentials.find({_id: req.user._id});
    User.findOneAndRemove({username: currCredentials[0].username},
        function(err, member) {
          if (!err && member) {
            console.log(member);
            console.log('member successfully deleted');
          } else {
            console.log('deliting user error');
          }
        });
    Credentials.findOneAndRemove({_id: currCredentials[0]._id},
        function(err, member) {
          if (!err && member) {
            console.log(member);
            console.log('member successfully deleted');
          } else {
            console.log('deleting credentials error');
          }
        });
    res.status(200).send({'message': 'Success'});
  } catch (err) {
    res.status(400).json({
      'message': 'deleting user',
    });
  }
});


router.patch('/me', verify, async (req, res)=>{
  const currCredentials = await Credentials.find({_id: req.user._id});
  if (currCredentials[0].password===req.body.oldPassword) {
    await Credentials.findOneAndUpdate({_id: req.user._id},
        {password: req.body.newPassword});
    console.log('ok');
    res.status(200).send({'message': 'Success'});
  } else {
    console.log('old password do not match');
    res.status(400).send({'message': 'passwords do not match'});
  }
});

module.exports = router;
