module.exports = function (fastify, opts, next) {

    const todoSchema = {
        body: {
            type: 'object',
            required: ['title'],
            properties: {
                // https://github.com/epoberezkin/ajv#coercing-data-types
                title: { type: 'string' }
            }
        }
    };

    fastify.post('/:list_id', { preHandler: fastify.isAuthenticated, schema: todoSchema, attachValidation: true }, (req, res) => {
        if ( req.validationError ) {
            res.code(400).send(req.validationError);
        } else {
            const user = fastify.firebase.auth().currentUser;
            const ref = opts.db.ref(`${fastify.constants.REFERENCES.TODO_LIST}/${req.params.list_id}`);
            let datetime = new Date().toISOString();
            ref.child('todo').push({
                title: req.body.title, // todo_item title
                user: user.uid, // user creates the list
                completed_at: null, // date when todo_item mark completed
                completed_by: null, // user completed the todo_item
                created_at: datetime, // todo_item created at
                updated_at: datetime, // todo_item updated at
            }).then(() => {
                res.code(201).send({
                    message: 'todo added successfully'
                });
            }).catch(err => {
                res.send({
                    message: err.message
                });
            });
        }
    });

    fastify.put('/:list_id/:todo_id', { preHandler: fastify.isAuthenticated, schema: todoSchema, attachValidation: true }, (req, res) => {
        if ( req.validationError ) {
            res.code(400).send(req.validationError);
        } else {
            const user = fastify.firebase.auth().currentUser;
            const ref = opts.db.ref(`${fastify.constants.REFERENCES.TODO_LIST}/${req.params.list_id}/todo/${req.params.todo_id}`);
            let datetime = new Date().toISOString();
            ref.update({
                title: req.body.title, // todo_item title
                updated_at: datetime,
            }).then(() => {
                res.code(201).send({
                    message: 'todo updated successfully'
                });
            }).catch(err => {
                res.send({
                    message: err.message
                });
            });
        }
    });

    fastify.get('/:list_id/:todo_id', { preHandler: fastify.isAuthenticated }, (req, res) => {
        const ref = opts.db.ref(`${fastify.constants.REFERENCES.TODO_LIST}/${req.params.list_id}/todo/${req.params.todo_id}`);

        ref.on('value', result => {
            res.send({
                data: {
                    todo: result
                }
            });
        });
    });

    fastify.get('/:list_id', { preHandler: fastify.isAuthenticated }, (req, res) => {
        const ref = opts.db.ref(`${fastify.constants.REFERENCES.TODO_LIST}/${req.params.list_id}`);

        ref.on('value', result => {
            res.send({
                data: {
                    list: result
                }
            });
        });
    });

    fastify.delete('/:list_id/:todo_id', { preHandler: fastify.isAuthenticated }, (req, res) => {
        const ref = opts.db.ref(`${fastify.constants.REFERENCES.TODO_LIST}/${req.params.list_id}/todo/${req.params.todo_id}`);
        ref.remove((result) => {
            res.send({
                message: 'todo deleted successfully'
            });
        });
    });

    next();
};
