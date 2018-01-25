# What is it?
Source files for the VQ-Labs web page vq-labs.com / vq-labs.de / viciqloud.com.

# What is used?
bootstrap 3, npm, gulp with html/css/js/json/img minify + uglify

# How to use it?
All the html sources can be found in the "src" folder. Modify the files in there and run "gulp build" in the root folder to get all the dependencies and minified versions of your CSS/JS/HTML files generated for you.
Images, css and other files that do not require pre-processing you will find in the "public" folder.

# How to install?
```
git clone https://github.com/adrianbarwicki/vq-labs.com 

cd vq-labs.com

npm install 
```
# Development
Run one of the following commands to start the app:
```
npm start (starts the app in production)
npm run start:dev (starts the app in development)
npm run start:local (starts the app in local)
```

# Deployment
Make sure that you have s3-deploy installed globally:
```
npm install s3-deploy --g
```

The following command will prepare, build and deploy the app to S3 bucket:
```
gulp deploy
```

# License?
Apache 2.0