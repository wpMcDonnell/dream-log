const express = require('express')

const passport = require('passport')

const Dream = require('../models/dream')

const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404

const requireOwnership = customErrors.requireOwnsership

const removeBlanks = require('../../lib/remove_blank_fields')

const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// INDEX aka GET all
router.get('/dreams', requireToken, (req, res, next) => {
  Dream.find()
    .then(dreams => {
      return dreams.map(dream => dream.toObject())
    })
    .then(dreams => res.status(200).json({ dreams: dreams }))
    .catch(next)
})

// SHOW aka get by id
router.get('/dreams/:id', requireToken, (req, res, next) => {
  Dream.findById(req.params.id)
    .then(handle404)
    .then(dream => res.status(200).json({ dream: dream.toObject() }))
    .catch(next)
})

// CREATE aka post
router.post('/dreams', requireToken, (req, res, next) => {
  req.body.dream.owner = req.user.id

  Dream.create(req.body.dream)

    .then(dream => {
      res.status(201).json({ dream: dream.toObject() })
    })
    .catch(next)
})

// UPDATE aka find by id and UPDATE a single post
router.patch('/dreams/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.example.owner

  Dream.findById(req.params.id)
    .then(handle404)
    .then(dream => {
      requireOwnership(req, dream)

      return dream.updateOne(req.body.dream)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DELETE
router.delete('/dreams/:id', requireToken, (req, res, next) => {
  Dream.findById(req.params.id)
    .then(handle404)
    .then(dream => {
      requireOwnership(req, dream)
      dream.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
