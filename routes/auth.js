
module.exports = function (fastify, opts, next) {

    const loginSchema = {
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

    fastify.post('/register', { schema: loginSchema, attachValidation: true }, (req, res) => {
        if ( req.validationError ) {
            res.code(400).send(req.validationError);
        } else {
            let promise = fastify.auth.createUserWithEmailAndPassword(req.body.email, req.body.password);
            promise.then(data => {
                res.send(data);
            }).catch(err => {
                res.code(500).send(err.message);
            });
        }
    });

    fastify.post('/login', { schema: loginSchema, attachValidation: true }, (req, res) => {
        if ( req.validationError ) {
            res.code(400).send(req.validationError);
        } else {
            let promise = fastify.auth.signInWithEmailAndPassword(req.body.email, req.body.password);
            promise.then(data => {
                res.send(data);
            }).catch(err => {
                res.code(500).send(err.message);
            });
        }
    });

    const resetSchema = {
        body: {
            type: 'object',
            required: ['email'],
            properties: {
                email: { format: 'email' }
            }
        }
    };

    fastify.post('/reset', { schema: resetSchema, attachValidation: true }, (req, res) => {
        if ( req.validationError ) {
            res.code(400).send(req.validationError);
        } else {
            let actionCodeSettings = {
                url: 'http://localhost:3000/'
            };
            let promise = fastify.auth.sendPasswordResetEmail(req.body.email, actionCodeSettings);
            promise.then(() => {
                res.send({
                    message: 'reset email sent'
                });
            }).catch(err => {
                res.code(500).send(err.message);
            });
        }
    });

    next();
};
