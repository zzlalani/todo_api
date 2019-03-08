const test = require('ava');
const fastify = require('../app');

test('Test Auth Register Api with status code 200', async t => {
    const res = await fastify.inject({
        method: 'POST',
        url: '/register',
        payload: {
            email: 'zzlalani@gmail.com',
            password: '123123'
        }
    });
    t.is(res.statusCode, 200);
});

test('Test Auth Register Api with status code 400', async t => {
    const res = await fastify.inject({
        method: 'POST',
        url: '/register',
        payload: {
            password: '123123'
        }
    });
    t.is(res.statusCode, 400);
});
