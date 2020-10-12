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

const imageUploader = require('./../cloudApis/aws')

const fs = require('fs')

const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

// Create router
router.post('/userImages', requireToken, (req, res, next) => {
  req.body.userImage.owner = req.user._id

  const userImagesData = req.body
  // use our UserImage model
  UserImage.create(userImagesData)
  // userImage created successfully
    .then(userImage => {
      res.status(201).json({ userImage })
    })
    // Create error
    .catch(next)
})

router.post('/userImages/Image', requireToken, upload.single('photoupload'), (req, res, next) => {
  const file = req.file
  const fileStream = fs.createReadStream(req.file.path)

  fileStream.on('open', function () {

    imageUploader.uploadImageToCloudStorage(
      req.file.originalname,
      file.mimetype,
      fileStream,
      (err) => {
        console.log(err.message)
      },
      (data) => {
        const userImagesData = {
          fileName: req.file.originalname,
          description: req.body.description,
          tag: req.body.tag,
          owner: req.user._id
        }
      
        UserImage.create(userImagesData)
          // userImage created successfully
          .then(userImage => {
            res.status(201).json({ userImage })
          })
          // Create error
          .catch(next)
      } // (data) => {}
    )   // imageUploader...
  })    // fileStream.on ...
})

// Index router
router.get('/userImages', requireToken, (req, res, next) => {
  UserImage.find({owner: req.user.id})
    .populate('owner')
    .then(userImages => {
      return userImages.map(userImage => userImage.toObject())
    })
    .then(userImages => {
      res.status(201).json({ userImages })
    })
    .catch(next)
})

// Get all images for all users sorted by the most recent creation date.
// if we have time the orderBy should be past as a query parameter
router.get('/userImages/orderdByDateDesc', requireToken, (req, res, next) => {
  UserImage.find().sort({ createdAt: 'desc' })
    .populate('owner')
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
      return UserImage.findByIdAndUpdate({ "_id": req.params.id },
      { $set: req.body.userImage }, { new: true })
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
