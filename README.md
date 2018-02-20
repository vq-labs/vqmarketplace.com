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

# Environments

We have tested the application in these environments but a .nvmrc and package.json engines have been setup for you to take a hint on:
(If you use NVM, you can do nvm use which will take .nvmrc file into account)
(If you want to install Node and NPM manually you can check the engines in package.json)

NodeJS 7.2.1 and NPM 3.10.9 on macOS Sierra 10.12.6,
NodeJS 8.3.0 and NPM 5.6 on Windows 10,
NodeJS 9.0.0 and NPM 5.5.1 on AWS Linux Ubuntu 16.04.2

# License?
Apache 2.0