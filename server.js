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
    socketIO = require('socket.io'),
    { Users } = require('./helpers/UsersClass'),
    { Global } = require('./helpers/Global'),
    _ = require('lodash'),
    container = require('./container');


container.resolve((users, admin, home, group, results, privateChat, Message, profile, interest, news) => {
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/footballkik', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

    const app = SetupExpress(users, admin, home, group, results, privateChat, Message, profile, interest, news);

    function SetupExpress(users, admin, home, group, results, privateChat, Message, profile, interest, news) {
        const app = express();
        const server = http.createServer(app);
        const io = socketIO(server);
        server.listen(PORT, () => {
            console.log(`server listening at ${PORT}`);
        });
        ConfigureExpress(app);

        require('./sockets/groupChat')(io, Users);
        require('./sockets/friend')(io);
        require('./sockets/globalRoom')(io, Global, _);
        require('./sockets/privateMessage.js')(io);

        //setup router 
        const router = require('express-promise-router')();
        users.SetRouting(router);
        admin.SetRouting(router);
        home.SetRouting(router);
        group.SetRouting(router);
        results.SetRouting(router);
        privateChat.SetRouting(router);
        profile.SetRouting(router);
        interest.SetRouting(router);
        news.SetRouting(router)

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

        // app.locals._ = _;
    };
});


