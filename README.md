# Proj

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

First install LTS version of Node.js https://nodejs.org/en/download/ (it contains node package manager - npm).

### `npm install --include=dev`

Installs all needed packages into the project directory.
All the below scripts can only be run after this installation step is done.

### `npm audit --production`

Checks whether there are any issues with the dependencies this project is using.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Run jest framework unit tests. 

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `serve -s build`

After building the production version with `npm run build` deploys the production version of the application to locally hosted server.
