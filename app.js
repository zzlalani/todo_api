// Require the framework and instantiate it
const fastify = require('fastify')({
    logger: true
});

// importing environment variables
require('custom-env').env('development');

// firebase admin library
const firebaseAdmin = require("firebase-admin");

// fastify formbody middleware
fastify.register(require('fastify-formbody'));

// firebase auth library
fastify.register(require('fastify-firebase-auth'), {
    apiKey: process.env.APIKEY,
    databaseURL: process.env.DATABASEURL,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET
});

// importing firebase service account json file to initialize firebase-admin
const serviceAccount = require(process.env.SERVICEACCOUNTKEYPATH);
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASEURL
});
const firebaseDB = firebaseAdmin.database();

// fastify custom plugins
fastify.register(require('./plugins/fastify-firebase'));
fastify.register(require('./middlewares/authenticated'));
fastify.register(require('./plugins/constants'));
fastify.register(require('./plugins/notifications'));

// get test webservice at /
fastify.get('/', (req, res) => {
    res.send({
        'message': 'Welcome to Todo App WebServices'
    })
});

// auth routes
fastify.register(require('./routes/auth'), { prefix: '/' });

// todolist routes
fastify.register(require('./routes/todolist'), { prefix: '/todolist', db: firebaseDB, admin: firebaseAdmin });

// todo routes
fastify.register(require('./routes/todo'), { prefix: '/todo', db: firebaseDB, admin: firebaseAdmin });

module.exports = fastify;
