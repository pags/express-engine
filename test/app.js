var express = require('express'),
    app = express(),
    path = require('path'),
    engine = require('../index');

app.set('views', path.join(__dirname, 'views'));

engine(app, {
    stylesheets_location: 'css',
    url_mappings: {
        'profile': ['/profile', '/userProfile'],
        'settings': '/options',
        'user1/items': '/things'
    }
});

app.listen(8080);

module.exports = app;
