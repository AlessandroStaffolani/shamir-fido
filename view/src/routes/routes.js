
const routes = {
    home: {
        label: '2FA - Shamir FIDO',
        code: 'home',
        title: 'Homepage',
        visibility: 'link'
    },
    login: {
        label: 'Login',
        code: 'login',
        title: 'Login',
        visibility: 'navbar',
        back: 'home',
    },
    register: {
        label: 'Register',
        code: 'register',
        title: 'Register',
        visibility: 'navbar',
        back: 'home',
    },
    protected: {
        label: 'Protected Area',
        code: 'protected',
        title: 'Protected area',
        visibility: 'navbar',
        back: 'home',
    }
};

module.exports = {
    routes
}