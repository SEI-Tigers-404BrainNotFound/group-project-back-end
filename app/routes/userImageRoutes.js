// Require in the User Image Schema
const UserImage = require('../models/imageSchema')

// require in express
const express = require('express')

// require in router
const router = express.Router()

// require passport
const passport = require('passport')

// handle404 error
const handle404 = require('./../../lib/custom_errors')

const customErrors = require('../../lib/custom_errors')

const removeBlanks = require('../../lib/remove_blank_fields')

const requireOwnership = customErrors.requireOwnership

// require Token
const requireToken = passport.authenticate('bearer', { session: false })

// Create router
router.post('/userImages', requireToken, (req, res, next) => {
  req.body.userImage.owner = req.user._id
  const userImagesData = req.body.userImage
  // use our UserImage model
  UserImage.create(userImagesData)
  // userImage created successfully
    .then(userImage => {
      res.status(201).json({ userImage })
    })
    // Create error
    .catch(next)
})

// Index router
router.get('/userImages', requireToken, (req, res, next) => {
  UserImage.find({owner: req.user.id})
    // .populate('owner')
    .then(userImages => {
      return userImages.map(userImage => userImage.toObject())
    })
    .then(userImages => {
      res.status(201).json({ userImages })
    })
    .catch(next)
})

// Show router
router.get('/userImages/:id', requireToken, (req, res, next) => {
  const id = req.params.id

  UserImage.findById(id)
    .populate('owner')
    .then(handle404)
    .then(userImages => res.status(200).json({ userImages }))
    .catch(next)
})

// Update router
router.patch('/userImages/:id', requireToken, removeBlanks, (req, res, next) => {
  UserImage.findById(req.params.id)
    .then(handle404)
    .then(userImage => {
      requireOwnership(req, userImage)
      return userImage.updateOne(req.body.userImage)
    })
    .then(userImages => res.json({ userImages }))
    .catch(next)
})

// Destroy router
router.delete('/userImages/:id', requireToken, (req, res, next) => {
  const id = req.params.id

  UserImage.findById(id)
    .then(handle404)
    .then(userImage => {
      requireOwnership(req, userImage)
      userImage.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
