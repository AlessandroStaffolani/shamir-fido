
const routes = {
    home: {
        label: '2FA - Shamir FIDO',
        code: 'home',
        title: 'Homepage',
        visibility: 'link',
        protected: false,
    },
    login: {
        label: 'Login',
        code: 'login',
        title: 'Login',
        visibility: 'navbar',
        back: 'home',
        protected: false,
    },
    register: {
        label: 'Register',
        code: 'register',
        title: 'Register',
        visibility: 'navbar',
        back: 'home',
        protected: false,
    },
    protected: {
        label: 'Protected Area',
        code: 'protected',
        title: 'Protected area',
        visibility: 'navbar',
        back: 'home',
        protected: true,
    },
    logout: {
        label: 'Logout',
        code: 'logout',
        title: 'Logout',
        visibility: 'navbar',
        back: 'home',
        protected: true,
    } 
};

const routesAsArray = () => {
    const routesArray = [];
    Object.keys(routes).forEach(key => routesArray.push(routes[key]));
    return routesArray;
}

module.exports = {
    routes,
    routesAsArray
}