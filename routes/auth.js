
module.exports = function (fastify, opts, next) {

    const schema = {
        body: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
                // https://github.com/epoberezkin/ajv#coercing-data-types
                email: { format: 'email' },
                password: { type: 'string', minLength: 6 },
            }

        }
    };

    fastify.post('/register', { schema: schema, attachValidation: true }, (req, res) => {
        // fastify.auth.createUserWithEmailAndPassword()
        if ( req.validationError ) {
            res.code(400).send(req.validationError);
        } else {
            let promise = fastify.auth.createUserWithEmailAndPassword(req.body.email, req.body.password);
            promise.then(data => {
                res.send(data);
            }).catch(err => {
                res.code(500).send(data);
            });

        }

    });

    next();
};