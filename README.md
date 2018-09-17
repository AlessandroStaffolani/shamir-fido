# Shamir FIDO
Project for a simple electron application that use shamir's secret sharing and FIDO 2 factor authentication
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
Simply run this command `yarn dev` that start both react and electron.

#### Production mode
To run in production mode you need first of all to build react, typing `yarn build`. Then you need only to type `yarn electron`