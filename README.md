# What is it?
Source files for the VQ-Labs web page vqmarketplace.com.

# What is used?
bootstrap 3, npm, gulp with html/css/js/json/img minify + uglify

# How to use it?
All the html sources can be found in the "src" folder. 
For development: run "npm start" or "gulp run" which if ENV= is not equal to production in .env file, it will be starting a server with watching changes
For production: run "npm start" or "gulp run" which if ENV=production in .env file it will just be building and starting the server
gulp run (which starts gulp build) does minification and uglification on CSS/JS/HTML files.
Images, css and other files that do not require pre-processing you will find in the "public" folder.


# How to start?
Review .env.example file and make necessary changes first then rename it to .env file. You should not commit this file because it might contain sensitive information, therefore we have an ignore rule in .gitignore so if you want to commit that, remove that from .gitignore

```
npm install

npm start
```

# Development
If your environment in .env file is not 'production', then npm start command will automatically watch changes for you.

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