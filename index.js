// Require the framework and instantiate it
const fastify = require('fastify')({
    logger: true
});

require('custom-env').env('development');

const firebaseAdmin = require("firebase-admin");

fastify.register(require('fastify-formbody'));

fastify.register(require('fastify-firebase-auth'), {
    apiKey: process.env.APIKEY,
    databaseURL: process.env.DATABASEURL,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET
});

const serviceAccount = require(process.env.SERVICEACCOUNTKEYPATH);
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASEURL
});
const firebaseDB = firebaseAdmin.database();


fastify.register(require('./plugins/fastify-firebase'));
fastify.register(require('./middlewares/authenticated'));
fastify.register(require('./plugins/constants'));


fastify.get('/', (req, res) => {
    res.send({
        'message': 'Welcome to Todo App WebServices'
    })
});

// auth
fastify.register(require('./routes/auth'), { prefix: '/' });

// todolist
fastify.register(require('./routes/todolist'), { preHandler: fastify.isAuthenticated, prefix: '/todolist', db: firebaseDB, admin: firebaseAdmin });

// Run the server!
fastify.listen(3000, (err, address) => {
    if (err) throw err;
    fastify.log.info(`server listening on ${address}`);
});
