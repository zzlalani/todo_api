module.exports = function (fastify, opts, next) {

    const listSchema = {
        body: {
            type: 'object',
            required: ['name', 'type'],
            properties: {
                // https://github.com/epoberezkin/ajv#coercing-data-types
                name: { type: 'string' },
                type: { type: 'number' } // 1 = normal list, 2 = collaborative lists
            }
        }
    };

    fastify.post('/', { preHandler: fastify.isAuthenticated,  schema: listSchema, attachValidation: true }, (req, res) => {
        if ( req.validationError ) {
            res.code(400).send(req.validationError);
        } else {
            let user = fastify.firebase.auth();
            console.log('USER', user.currentUser);
            res.send({});
        }
    });

    next();
};
