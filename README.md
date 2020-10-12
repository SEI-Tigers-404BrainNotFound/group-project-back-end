[![General Assembly Logo](https://camo.githubusercontent.com/1a91b05b8f4d44b5bbfb83abac2b0996d8e26c92/687474703a2f2f692e696d6775722e636f6d2f6b6538555354712e706e67)](https://generalassemb.ly/education/web-development-immersive)

# InstaSHAM

This is the backend for a full stack application that connects with a MongoDB database and AWS S3 to allow users to upload and store files. The application allows you to sign up for your own individual account with an e-mail address and password.  The password is hashed by the system so that it is more secure.  Once signed in the user can upload, edit, and delete files from their account.  The files are uploaded with a description and a tag/tags that are inputted by the user. The file is also given a timestamp so that they know when the file was uploaded, as well as the last time that the metadata was updated.

Once a picture has been uploaded, it is added to the user's profile.  The user's profile is updated in a chronological order with the most recent photo being shown first in the grid.  The grid is a thumbnail view of the photos.  When a photo is clicked, the user is sent to an image page that gives them an option to edit the metadata.  They are given timestamps on when the image was uploaded and it's most recent update. The user is also able to delete the image from this page.

When the picture is uploaded, it also shows up on the news feed in a chornological order, with the most recent item at the top of the list.  The news feed is where the user can see all user's photos in the database.  On the top of each card, the user can see the e-mail address of the user who uploaded the file.

## Planning Story

The first step in the process of planning the site was to identify the functionality of the site based on requirements and the user stories.  We created an ERD for the backend. We store the following image metadata in a "userImage" document in a "userImages" collection in MongoDB:
* The document ID generated by MongoDB.
* The filename
* An image tag
* An owner, which is a MongoDB reference to a "user" in the "users" collection. 
* A createdAt date stored in "Zulu" time.
* An updatedAt date stored in "Zulu" time. 

We created 6 routes for our image metadata CRUD operations.

We also had to use Multer to handle the multipart encoding type for incoming requests from the browser. This is necessary because we could not send simple JSON
objects from the front end. Mongoose.js does not natively support multipart encodings, and that is what makes Multer essential. Multer extracts the file data and the metadata and puts them into file and body properties. 

We created an AWS module that has the AWS S3 specific code that is invoked from out routes file. This allows us to more easily support different cloud providers
in the future. So the image data from Multer is passed to the AWS module for upload to S3.

The AWS module uses the AWS Cognito service to authenticate unauthenticated users. This allowed us not to expose the AWS secret key.

In terms of security, we did the the simplest thing that works rather than diving into the minutiae of AWS security. Uers may only access the S3 bucket for the application, and nothing else. 

Everything else was just standard CRUD to the userImages collection in MongoDB. Of course, we created a schema in Mongoose.js that does most of the heavy lifiting.

We added a special route to return image metadata for all users, in createdAt order descending. This was done to support the News Feed page so that you could see all images for all users with the most recent photos first.

### User stories
    1.  As an unregistered user, I would like to sign up with email and password.
    2.  As a registered user, I would like to sign in with email and password.
    3.  As a signed in user, I would like to change password.
    4.  As a signed in user, I would like to sign out.
    5.  As a signed in user, I would like to upload an image to AWS.
    6.  As a signed in user, I would like to update the meta-data of my image on AWS.
    7.  As a signed in user, I would like to see the name of all images on AWS.
    8.  As a signed in user, I would like to see the thumbnail of all images on AWS.
    9.  As a signed in user, I would like to delete the reference of my image from the database.
    10.  As a signed in user, I would like to see the following meta-data for any image:
      date created/uploaded
      date modified
      owner (user who uploaded the image)
      tag

### Technolgies Used
    1. Node.js 
    2. JavaScript
    3. AWS S3
    4. AWS Cognito for authentication to S3
    5. json
    6. Multipart encoding.
    7. MongoDB
    8. Mongoose.js
    9. Multer
    10. Passport JS
    11. Express JS
    12. Bcrypt


### Links
  [Depoloyed Frontend](https://sei-tigers-404brainnotfound.github.io/group-project-front-end/#/) <br>
  [Deployed Backend](https://git.heroku.com/young-gorge-48445.git) <br>
  [Frontend Github Repository](https://github.com/SEI-Tigers-404BrainNotFound/group-project-front-end)<br>
  [Backend Github Repository](https://github.com/SEI-Tigers-404BrainNotFound/group-project-back-end)

### Unsolved Problems/Reach Goals
    - Add search by Tag functionality
    - Add the ability to create profile pictures and bios
    - Like and comment functionality on other people's posts.
    - Be able to inject various strategy / adapters to support different cloud
      providers. For example, we should be able to store images in AWS, Azure, Google Cloud,
      or any other cloud providers.
    - Improve the AWS security for our bucket.
    - Fix the patch route. A Mongoose API that we are using is deprecated unless we configure something. This is a temp fix.

