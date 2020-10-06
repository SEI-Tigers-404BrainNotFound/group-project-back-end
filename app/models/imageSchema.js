const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tag: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  }
}, {
  timestamps: true
})

const UserImage = mongoose.model('UserImage', imageSchema)

module.export = UserImage
