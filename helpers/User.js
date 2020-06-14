const { body, validationResult } = require("express-validator");

module.exports = {

    SignUpValidation: [
        body('username', 'Username is required').notEmpty(),
        body('username', 'Username must not be less than 5').isLength({ min: 5 }),
        body('email', 'Email is Invalid').isEmail(),
        body('email', 'Email is required').notEmpty(),
        body('password', 'Password is required').notEmpty(),
        body('password', 'password must not be less than 5').isLength({ min: 5 }),
    ],
    SignUpValidationFun:
        function (req, res, next) {
            const errors = validationResult(req);
            if (errors.isEmpty()) return next();
            let messages = [];
            errors.errors.map(error => {
                messages.push(error.msg);
            });

            req.flash('error', messages);
            res.redirect('/signup');

        },
    LoginValidation: [
        body('email', 'Email is Invalid').isEmail(),
        body('email', 'Email is required').notEmpty(),
        body('password', 'Password is required').notEmpty(),
        body('password', 'password must not be less than 5').isLength({ min: 5 }),
    ],
    LoginValidationFun:
        function (req, res, next) {
            const errors = validationResult(req);
            // console.log(errors);
            if (errors.isEmpty()) return next();
            let messages = [];
            errors.errors.map(error => {
                messages.push(error.msg);
            });

            req.flash('error', messages);
            res.redirect('/');

        }


};