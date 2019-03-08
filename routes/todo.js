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

            // send push notifications if the list is collaborative
            ref.on('value', (snapshot) => {
                if (snapshot.val().type === fastify.constants.TYPES.COLLABORATIVE) {
                    fastify.pushNotifications.sendNotification(opts.admin, `New todo created`, `New todo item is created in list ${snapshot.val().title} with title ${req.body.title}`, req.params.list_id);
                }
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

            // send push notifications if the list is collaborative
            const listRef = opts.db.ref(`${fastify.constants.REFERENCES.TODO_LIST}/${req.params.list_id}`);
            listRef.on('value', (snapshot) => {
                if (snapshot.val().type === fastify.constants.TYPES.COLLABORATIVE) {
                    fastify.pushNotifications.sendNotification(opts.admin, `Todo item updated`, `Todo item in list ${snapshot.val().title} updated to title ${req.body.title}`, req.params.list_id);
                }
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

        ref.remove().then(() => {
            res.send({
                message: 'todo deleted successfully'
            });
        }).catch(err => {
            res.send({
                message: err.message
            });
        });

        // send push notifications if the list is collaborative
        const listRef = opts.db.ref(`${fastify.constants.REFERENCES.TODO_LIST}/${req.params.list_id}`);
        listRef.on('value', (snapshot) => {
            if (snapshot.val().type === fastify.constants.TYPES.COLLABORATIVE) {
                fastify.pushNotifications.sendNotification(opts.admin, `Todo item deleted`, `Todo item in list ${snapshot.val().title} deleted`, req.params.list_id);
            }
        });
    });

    next();
};
