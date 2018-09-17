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
Once you have installed all dependecies you can run You can run application in development or production mode
#### Develepoment mode
Simply run this command `yarn start` that start both react and electron (In this mode you need to force refresh on electron app because when it fire react page is not ready).

If you want you can start electron and react in two different tasks, running before `yarn startView` and then `yarn startApp`.

#### Production mode
To run in production mode you need first of all to build react, typing `yarn buildView`. Then you need to replace a line of code inside `main.js`:

This line:
```
win.loadURL('http://localhost:3000')
```
should be replace with:
```
win.loadURL(
    url.format({
        pathname: path.join(__dirname, 'view', 'public', 'index.html'),
        protocol: 'file:',
        slashes: true
    })
);
```