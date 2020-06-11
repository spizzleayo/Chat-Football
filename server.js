const express = require('express'),
    bodyParser = require('body-parser'),
    ejs = require('ejs'),
    http = require('http'),
    PORT = 8080,
    mongoose = require('mongoose'),
    cookieParser = require('cookie-parser'),
    { body, validationResult } = require('express-validator'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    flash = require('connect-flash'),
    passport = require('passport'),
    container = require('./container');


container.resolve((users, _) => {
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/footballkik', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

    const app = SetupExpress(users);

    function SetupExpress(users) {
        const app = express();
        const server = http.createServer(app);
        server.listen(PORT, () => {
            console.log(`server listening at ${PORT}`);
        });
        ConfigureExpress(app);

        //setup router 
        const router = require('express-promise-router')();
        users.SetRouting(router);

        app.use(router);
    }


    function ConfigureExpress(app) {
        require('./passport/passport-local');
        require('./passport/passport-facebook');
        require('./passport/passport-google');

        app.use(express.static('public'));
        app.use(cookieParser());
        app.set('view engine', 'ejs');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        // app.use(expressValidator());
        app.use(session({
            secret: 'thajkhjdsajk',
            resave: true,
            saveUninitialized: true,
            store: new MongoStore({ mongooseConnection: mongoose.connection })
        }));
        app.use(flash());

        app.use(passport.initialize());
        app.use(passport.session());
    };
});


