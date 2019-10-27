# node-react-template
A full-stack web app template using Node, Express, React, Redux, Mongo with deployment to Heroku. This boilerplate is based on the project from this udemy course: https://www.udemy.com/node-with-react-fullstack-web-development/

### features:
* backend express server
* basic oauth cookie based authentication flow implemented with passport.js, cookie-session, and mongo/mongoose (to record users) 
* create-react-app project in the client folder
* redux store and a reducer/action creator that handles the auth flow from the client side, uses redux-thunk and axios
* react router set up
* configured to run locally and in production with heroku

### other things to know:
* you will need to create credentials for google, mongo, and a secret cookie key (both dev and production versions)
* you will need to create a dev.js file in the config folder, similar to the prod.js file, where you will put your dev credentials (make sure this file is added to .gitignore)
* ```npm run dev``` will launch both the express and react server

### deploy to heroku
```bash
$ heroku create
```
this will give you a remote git repo for your heroku project, copy that link.
```bash
$ git remote add heroku <LINK YOU COPIED>
$ git push heroku master
$ heroku open
```
remember to add your production credentials to your heroku project's config vars
