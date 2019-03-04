// Require the framework and instantiate it
const fastify = require('fastify')({
    logger: true
});

fastify.register(require('fastify-formbody'));

fastify.register(require('fastify-firebase-auth'), {
    apiKey: 'AIzaSyDEOJJ7EVg47Cy56MM0LjfsAe1TXpW2SkY',
    databaseURL: 'https://todo-api-4f81f.firebaseio.com',
    projectId: 'todo-api-4f81f',
    storageBucket: 'todo-api-4f81f.appspot.com'
});

// auth
fastify.register(require('./routes/auth'), { prefix: '/' });

// Run the server!
fastify.listen(3000, (err, address) => {
    if (err) throw err;
    fastify.log.info(`server listening on ${address}`);
});