'use strict';

const fp = require('fastify-plugin');

/**
 * is user authenticated
 * @param fastify
 * @param options
 * @param next
 */
function authenticated(fastify, options, next) {
    fastify.decorate('isAuthenticated', function (req, res, next) {
        if ( fastify.firebase && fastify.firebase.auth() && fastify.firebase.auth().currentUser !== null ) {
            next();
        } else {
            res.code(401).send('Unauthorized');
        }
    });
    next();
}

module.exports = fp(authenticated);
