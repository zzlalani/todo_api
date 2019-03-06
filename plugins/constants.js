'use strict';

const fp = require('fastify-plugin');


function constants (fastify, options, next) {
    fastify.decorate('constants', Object.freeze({
        REFERENCES: {
            TODO_LIST: 'todo_list',
            TODO: 'todo'
        }
    }));
    next();
}

module.exports = fp(constants);
