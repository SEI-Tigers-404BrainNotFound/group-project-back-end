
const AWS = require('aws-sdk')

// Uploads an image to the Amazon S3 bucket.
// 
// imageName - The name of the image to upload to S3.
// mimeType - The mime type of the image.
// fileStream - The file stream of the image to upload to S3.
// errorCallback - A callback function if the upload fails.
// successCallback - A callback function for a successful upload to S3.
//
const uploadImageToCloudStorage = (imageName, mimeType, fileStream,
  errorCallback, successCallback) => {
  // Configure the Amazon module.
  AWS.config.region = 'us-east-1'
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:2041273b-6722-4303-b894-8e5f1253383e'
  })

  // Create a new S3 proxy object
  const s3 = new AWS.S3({
    apiVersion: '2006-03-01'
  })

  const params = {
    Bucket: '404brainnotfound',
    ContentType: mimeType,
    Key: imageName,
    ACL: 'public-read',
    Body: fileStream
  }

  s3.upload(params, function (err, data) {
    if (err) {
      errorCallback(err)
    }
    else {
      successCallback(data)    
    }
  })
}

module.exports = {
  uploadImageToCloudStorage    
}
