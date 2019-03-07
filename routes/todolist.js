module.exports = function (fastify, opts, next) {



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
            const ref = opts.db.ref(fastify.constants.REFERENCES.TODO_LIST_PERSONAL);
            ref.push({
                name: req.body.name, // list name
                users: [user.uid], // users of the list
                admins: [] // keep the empty values to reduce checks at frontend
            }).then(() => {
                res.code(201).send({
                    message: 'todo list added successfully'
                });
            }).catch(err => {
                res.send({
                    message: err.message
                });
            });
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
            const ref = opts.db.ref(fastify.constants.REFERENCES.TODO_LIST_COLLABORATIVE);
            let listUsers = req.body.users;

            // add if not already in the list
            if (listUsers.indexOf(listUsers.splice) < 0)
                listUsers.push(user.uid);

            ref.push({
                name: req.body.name, // list name
                users: listUsers, // users of the list
                admins: [user.uid] // owner/s of the list
            }).then(() => {
                res.code(201).send({
                    message: 'todo list added successfully'
                });
            }).catch(err => {
                res.send({
                    message: err.message
                });
            });

        }
    });

    next();
};
