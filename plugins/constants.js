'use strict';

const fp = require('fastify-plugin');


function constants (fastify, options, next) {
    fastify.decorate('constants', Object.freeze({
        REFERENCES: {
            TODO_LIST: 'todo_list',
            TODO: 'todo'
        },
        TYPES: {
            PERSONAL: 1,
            COLLABORATIVE: 2
        }
    }));
    next();
}

module.exports = fp(constants);
