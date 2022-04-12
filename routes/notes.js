const router = require('express').Router();
const User = require('../models/user');
const Note = require('../models/note');
const Credentials = require('../models/credentials');
const verify = require('./verifyToken');

router.get('/', verify, async (req, res)=>{
  try {
    const currCredentials = await Credentials.find({_id: req.user._id});
    const currUser = await User.find({username: currCredentials[0].username});
    const notes = await Note.find({userId: currUser[0]._id});
    res.status(200).send({
      'offset': req.body.offset,
      'limit': req.body.limit,
      'count': req.body.limit===0?0:Math.floor(notes.length/req.body.limit),
      'notes': notes,
    });
  } catch (err) {
    res.status(400).json({
      'message': 'getting notes error',
    });
  }
});

router.post('/', verify, async (req, res)=>{
  const currCredentials = await Credentials.find({_id: req.user._id});
  const currUser = await User.find({username: currCredentials[0].username});
  const note = new Note({
    userId: currUser[0]._id,
    completed: false,
    text: req.body.text,
  });
  await note.save();
  try {
    res.status(200).json(
        {
          'message': 'Success',
        });
  } catch (err) {
    res.status(400).json({
      'message': 'note creation error',
    });
  }
});

router.get('/:id', verify, async (req, res)=>{
  try {
    const note = await Note.findOne({_id: req.params['id']});
    res.status(200).json({
      'note': {
        '_id': note._id,
        'userId': note.userId,
        'completed': note.completed,
        'text': note.text,
        'createdDate': note.createdDate,
      }});
  } catch (err) {
    res.status(400).json({
      'message': 'note searching error',
    });
  }
});

router.put('/:id', verify, async (req, res)=>{
  try {
    await Note.findOneAndUpdate({_id: req.params['id']}, {text: req.body.text});
    res.status(200).json(
        {
          'message': 'Success',
        });
  } catch (err) {
    res.status(400).json({
      'message': 'updating note error',
    });
  }
});

router.patch('/:id', verify, async (req, res)=>{
  try {
    const note = await Note.findOne({_id: req.params['id']});
    await Note.findOneAndUpdate({_id: req.params['id']},
        {completed: !note.completed});
    console.log( await Note.findOne({_id: req.params['id']}));
    res.status(200).json(
        {
          'message': 'Success',
        });
  } catch (err) {
    res.status(400).json({
      'message': 'updating status of the note error',
    });
  }
});

router.delete('/:id', verify, async (req, res)=>{
  try {
    Note.findOneAndRemove({_id: req.params['id']});
    res.status(200).send({'message': 'Success'});
  } catch (err) {
    res.status(400).send({'message': 'deleting note error'});
  }
});

module.exports = router;
