const express = require('express')

const passport = require('passport')

const Dream = require('../models/example')

const customErrors = require('../..lib/custom_errors')

const handle404 = customErrors.handle404

const requireOwnership = customErrors.requireOwnsership

const removeBlanks = require('../../lib/remove_blank_fields')

const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// INDEX aka GET all
router.get('/dreams', requireToken, (req, res, next) => {
  Dream.find()
    .then(examples => {
      return examples.map(example => example.toObject())
    })
    .then(examples => res.status(200).json({ examples: examples }))
    .catch(next)
})

// SHOW aka get by id
router.get('/dreams/:id', requireToken, (req, res, next) => {
  Dream.findById(req.params.id)
    .then(handle404)
    .then(example => res.status(200).json({ example: example.toObject() }))
    .catch(next)
})

// CREATE aka post
router.post('/dreams')
