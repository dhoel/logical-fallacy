const path = require('path');
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const mongoose = require('mongoose');
const {User, Question} = require('./models');
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();

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
            .then(user => {

                Question
                    .find()
                    .exec()
                    .then(questions => {
                        questions.sort((a, b) => (a.m) - (b.m))
                        User.update({'googleId':profile.id},
                                {$set:{'questions':questions}})
                        .exec()
                        return cb(null, questions);
                    })
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
             .findOne({accessToken: token})
             .exec()
             .then( user => {
                 if(!user) {
                     return done(null, false);
                 }
                 return done(null, user);
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
    (req, res) => {
        const {_id, userName} = req.user
        res.json({id:_id, userName:userName})
    }
);

app.get('/api/fetch-questions/:id',
    passport.authenticate('bearer', {session: false}),
    (req, res) => {

        User
            .findById(req.params.id)
            .exec()
            // .then(user => {
            //     user.questions.sort((a, b) => (a.m) - (b.m))
            //     return user.save()
            // })
            .then(user => {

                const {_id, definition} = user.questions[0];
                res.status(201).json({id:_id, definition:definition});
            })
            .catch(err => {
                res.status(500).json({message: "Internal server error"})
                console.error(err)
            })
    }
);

app.put('/api/check-answers/:id', jsonParser,
    passport.authenticate('bearer', {session: false}),
    (req, res) => {

        let isCorrect = false

        User.findById(req.params.id)//.exec()
            .then(user => {

                if (user.questions[0].fallacy !== req.body.answer) {

                let temp = user.questions[0].m
                    user.questions[0].m = user.questions[1].m
                    user.questions[1].m = temp
                }
                else {
                    user.questions[0].m = user.questions.length +1
                    user.questions.forEach(e => {
                        e.m --
                    })
                    isCorrect = true
                }
                user.questions.sort((a, b) => (a.m) - (b.m))
                user.markModified('questions')
                return user.save()


            }).then(user => {
                res.json(isCorrect)
            })
    }
)

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
