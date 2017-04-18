const path = require('path');
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const mongoose = require('mongoose');
const {User, Question} = require('./models')
mongoose.Promise = global.Promise;


let secret = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  DATABASE_URL: process.env.DATABASE_URL
}

if(process.env.NODE_ENV != 'production') {
  secret = require('./secret');
}

const app = express();

app.use(passport.initialize());

passport.use(
    new GoogleStrategy({
        clientID:  secret.CLIENT_ID,
        clientSecret: secret.CLIENT_SECRET,
        callbackURL: `/api/auth/google/callback`
    },
    (accessToken, refreshToken, profile, cb) => {

        User
            .create({
                userName: profile.name.givenName,
                googleId: profile.id,
                accessToken: accessToken
            })
            .then(user => {
                return cb(null, user);
            })
            .catch(err => {
                return cb(err);
            })
        }
));

passport.use(
    new BearerStrategy(
        (token, done) => {
            User
             .find({token})
             .exec()
             .then(token => {
                 //console.log(token)
                 if(!token) {
                     return done(null, false);
                 }
                 return done(null, token);
             })
             .catch(err => {
                 return cb(err);
             })

        }
    )
);

app.get('/api/auth/google',
    passport.authenticate('google', {scope: ['profile']}));

app.get('/api/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/',
        session: false
    }),
    (req, res) => {
        res.cookie('accessToken', req.user.accessToken, {expires: 0});
        res.redirect('/');
    }
);

app.get('/api/auth/logout', (req, res) => {
    req.logout();
    res.clearCookie('accessToken');
    res.redirect('/');
});

app.get('/api/me',
    passport.authenticate('bearer', {session: false}),
    (req, res) => res.json({
        googleId: req.user.googleId
    })
);

app.get('/api/questions',
    passport.authenticate('bearer', {session: false}),
    (req, res) => {
        Question
            .findOne()
            .exec()
            .then(question => {
                //let {_id, definition} = question
                res.status(201).json(question);
            })
            .catch(err => {
                res.status(500).json({message: "Internal server error"})
                console.error(err)
            })
    }
);

// Serve the built client
app.use(express.static(path.resolve(__dirname, '../client/build')));

// Unhandled requests which aren't for the API should serve index.html so
// client-side routing using browserHistory can function
app.get(/^(?!\/api(\/|$))/, (req, res) => {
    const index = path.resolve(__dirname, '../client/build', 'index.html');
    res.sendFile(index);
});

let server;
function runServer(port=3001, databaseUrl=secret.DATABASE_URL) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, err => {
            if (err) {
                return reject(err);
            }

            server = app.listen(port, () => {
                resolve();
            }).on('error', err => {
                mongoose.disconnect();
                reject(err);
             });
        });
    });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

if (require.main === module) {
    runServer();
}

module.exports = {
    app, runServer, closeServer
};
