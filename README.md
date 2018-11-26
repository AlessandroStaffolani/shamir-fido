# Shamir FIDO
Project for a simple electron application that uses shamir's secret sharing and FIDO 2-factor-authentication
## Installation
To install this application run:
```
git clone https://github.com/ale8193/shamir-fido.git

cd shamir-fido

yarn install
```

## Run
Once you have installed all dependecies you can run your application in development or production mode
#### Develepoment mode
Simply run this command `yarn dev` that start both react and electron in development mode, this means that electron developer tools panel is opened and react is running in the browser.

#### Production mode
To run in production mode you need first of all to build react, typing `yarn react-build`. Then you need only to type `yarn start`

## Build
It is also possible to build the application to generate the application that can be used as a standalone application in your computer.

This procedure is quiet simple and require only to type the following command: `yarn build`. Once It finished you will find your application inside the `dist` folder inside the project root

NOTE: the build process was tested only on macOs and linux.
