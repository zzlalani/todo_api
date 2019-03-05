// Require the framework and instantiate it
const fastify = require('fastify')({
    logger: true
});

require('custom-env').env('development');

fastify.register(require('fastify-formbody'));

fastify.register(require('fastify-firebase-auth'), {
    apiKey: process.env.APIKEY,
    databaseURL: process.env.DATABASEURL,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET
});

fastify.register(require('./plugins/fastify-firebase'));
fastify.register(require('./middlewares/authenticated'));
console.log(fastify.isAuthenticated);
fastify.get('/', (req, res) => {
    res.send({
        'message': 'Welcome to Todo App WebServices'
    })
});

// auth
fastify.register(require('./routes/auth'), { prefix: '/' });

// todolist
fastify.register(require('./routes/todolist'), { prefix: '/todolist' });

// Run the server!
fastify.listen(3000, (err, address) => {
    if (err) throw err;
    fastify.log.info(`server listening on ${address}`);
});
