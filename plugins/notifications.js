'use strict';

const fp = require('fastify-plugin');

function notifications (fastify, options, next) {
    fastify.decorate('pushNotifications', {
        subscribeToTopic: (admin, registrationTokens, topic) => {
            admin.messaging().subscribeToTopic(registrationTokens, topic)
                .then(function(response) {
                    // See the MessagingTopicManagementResponse reference documentation
                    // for the contents of response.
                    console.log('Successfully subscribed to topic:', response);
                })
                .catch(function(error) {
                    console.log('Error subscribing to topic:', error);
                });
        },

        sendNotification: (admin, title, body, topic) => {
            const message = {
                notification: {
                    title: title,
                    body: body
                },
                topic: topic
            };
            admin.messaging().send(message)
                .then((response) => {
                    // Response is a message ID string.
                    console.log('Successfully sent message:', response);
                })
                .catch((error) => {
                    console.log('Error sending message:', error);
                });
        }

    });
    next();
}

module.exports = fp(notifications);
