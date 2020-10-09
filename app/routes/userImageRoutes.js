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

const AWS = require('aws-sdk')

const fs = require('fs')

const multer = require('multer')
const storage = multer.memoryStorage()
// const upload = multer({storage});
const upload = multer({ dest: 'uploads/' })

// Create router
router.post('/userImages', requireToken, (req, res, next) => {
  req.body.userImage.owner = req.user._id

  uploadImageToAws(req.body)

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
  console.log(req.body)

  fileStream.on('open', function () {
    // This just pipes the read stream to the response object (which goes to the client)
    //readStream.pipe(res)
    // Configure the Amazon module.
    AWS.config.region = 'us-east-1'
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'us-east-1:2041273b-6722-4303-b894-8e5f1253383e',
    })

    // // Create a new S3 proxy object
    const s3 = new AWS.S3({
      apiVersion: '2006-03-01'
    })

    const params = {
      Bucket: '404brainnotfound',
      ContentType: file.mimetype,
      Key: req.body.filename,
      ACL: 'public-read',
      Body: fileStream
    }

    s3.upload(params, function (err, data) {
      if (err) console.log(err)
      else {
        // use our UserImage model
        // file: null,
        // fileName: '',
        // description: '',
        // tag: '',
        // owner: ''
      //   userImage: {
      //   file: null,
      //   fileName: '',
      //   description: '',
      //   tag: '',
      //   owner: ''
      // }
        const userImagesData =
          {fileName: req.file.originalname,
            description: req.body.description,
            tag: req.body.tag,
            owner: req.user._id}

        UserImage.create(userImagesData)
        // userImage created successfully
          .then(userImage => {
            res.status(201).json({ userImage })
          })
          // Create error
          .catch(next)
        console.log('hi')
      }
    })
  })

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
