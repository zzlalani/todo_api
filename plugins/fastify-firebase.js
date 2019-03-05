'use strict';

const fp = require('fastify-plugin');
const Firebase = require('firebase');

/**'
 * fastify firebase Plugin
 * @param fastify
 * @param options
 * @param next
 */
function fastifyFirebase (fastify, options, next) {
    fastify.decorate('firebase', Firebase);
    next();
}

module.exports = fp(fastifyFirebase);
