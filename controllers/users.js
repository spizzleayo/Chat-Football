// const User = require('../helpers/User')
module.exports = function (_, passport, User) {
    return {
        SetRouting: function (router) {
            router.get('/', this.indexPage);
            router.get('/signup', this.getSignup);
            router.get('/home', this.homePage);
            router.get('/auth/facebook', this.getFacebookLogin);
            router.get('/auth/facebook/callback', this.facebookLogin);
            router.get('/auth/google', this.getGoogleLogin);
            router.get('/auth/google/callback', this.googleLogin);

            router.post('/', User.LoginValidation, User.LoginValidationFun, this.postLogin);
            router.post('/signup', User.SignUpValidation, User.SignUpValidationFun, this.postSignup);
        },
        indexPage: function (req, res) {
            const errors = req.flash('error');
            return res.render('index', { title: 'Football | Login', messages: errors, hasErrors: errors.length > 0 });
        },
        postLogin: passport.authenticate('local.login', {
            successRedirect: '/home',
            failureRedirect: '/',
            failureFlash: true,
        }),
        getSignup: function (req, res) {
            const errors = req.flash('error');
            return res.render('signup', { title: 'Football | Signup', messages: errors, hasErrors: errors.length > 0 });
        },
        postSignup: passport.authenticate('local.signup', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true,
        }, (req, res) => {
            console.log('hi');
        }),

        getFacebookLogin: passport.authenticate('facebook', {
            scope: 'email'
        }),

        getGoogleLogin: passport.authenticate('google', {
            scope: ['https://www.googleapis.com/auth/plus.login', 'email', 'profile', 'https://www.googleapis.com/auth/plus.profile.emails.read']
            // scope: ['email', 'profile']
        }),

        googleLogin: passport.authenticate('google', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        }),
        facebookLogin: passport.authenticate('facebook', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        }),



        homePage: function (req, res) {
            return res.render('home');
        },


    };
};