// MAIN starting point for server: /index.js
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const router = require('./router');
const mongoose = require('mongoose');

// DB SETUP
/* CREATES A DATABASE INSIDE MONGO CALLED udemy_auth (I think?)
Which will get used (?) for purpose of auth, yah?
As in - ? it creates a whole database, which I will use, in my app - and what my app is, well that happens to be an API devoted to authentication - that is, this API is used to, well, yeah, authenticate users, to my  OTHER app, which will happen to be a nifty React thing that shows you a list of listicles or whatever.
So, I am developing two applications:
1) an API that authenticates users
2) a nifty app that those users will log into, have fun

The # 1 one needs a database on MongoDB.
That database name is 'udemy_auth'
It has some kind of special Mongoosey-MongoDB-y thing about "being an/the 'auth' database" ?? ??
(Q. Can *another* app I might make, say tomorrow, about a *second* nifty thing, that shares the same MongoDB, have its *own* auth database thing ? E.g. 'otherthing_auth'?  and does that second thing *also* have? (or does it *share??*) the special Mongoosey-MongoDB-y "auth" special database thing?)
What The Hell is the information model here,
AND
Wny The Hell am I working so hard to figure the fucking thing out?
JESUS H. CHRIST.
Can you not just LAy It Out there? DAmn.


// https://docs.mongodb.com/manual/reference/connection-string/
*/
// mongoose.connect('mongodb://localhost:auth/udemy_auth'); // << Saw no db created. Hmmph.
// Perfesser code:
mongoose.connect('mongodb://localhost:auth/auth');


// APP SETUP
// Express middlewares!
// Logger
app.use(morgan('combined'));
// Parse body of request from clients
// Any request incoming ('*/*') will be handled as JSON
app.use(bodyParser.json( { type: '*/*' } ));
router(app);


// Now NODEMON is working for us. Restarts even on COMMENT.



// SERVER SETUP (EXPRESS)
const port = process.env.PORT || 3090;
// Native NODE library, low-level:
const server = http.createServer(app);
server.listen(port);

console.log('Server listening on ', port);
