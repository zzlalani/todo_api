module.exports = function (fastify, opts, next) {

    const PERSONAL = 1;
    const COLLABORATIVE = 2;

    const personalListSchema = {
        body: {
            type: 'object',
            required: ['name'],
            properties: {
                // https://github.com/epoberezkin/ajv#coercing-data-types
                name: { type: 'string' }
            }
        }
    };

    fastify.post('/personal', { preHandler: fastify.isAuthenticated,  schema: personalListSchema, attachValidation: true }, (req, res) => {
        if ( req.validationError ) {
            res.code(400).send(req.validationError);
        } else {
            let user = fastify.firebase.auth().currentUser;
            const ref = opts.db.ref(fastify.constants.REFERENCES.TODO_LIST);
            ref.push({
                name: req.body.name,
                type: PERSONAL,
                users: [user.uid]
            });

            res.send({});
        }
    });

    const collaborativeListSchema = {
        body: {
            type: 'object',
            required: ['name', 'users'],
            properties: {
                // https://github.com/epoberezkin/ajv#coercing-data-types
                name: { type: 'string' },
                users: { type: 'array' }
            }
        }
    };

    fastify.post('/collaborative', { preHandler: fastify.isAuthenticated,  schema: collaborativeListSchema, attachValidation: true }, (req, res) => {
        if ( req.validationError ) {
            res.code(400).send(req.validationError);
        } else {
            let user = fastify.firebase.auth().currentUser;
            const ref = opts.db.ref(fastify.constants.REFERENCES.TODO_LIST);
            let listUsers = req.body.users;
            listUsers.push(user.uid);

            ref.push({
                name: req.body.name,
                type: COLLABORATIVE,
                users: listUsers,
                admin: user.uid
            });

            res.send({});
        }
    });

    next();
};
