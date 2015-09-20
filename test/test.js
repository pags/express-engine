var request = require('supertest'),
    chai = require('chai'),
    expect = chai.expect,
    DEFAULT_CONFIG = require('../config'),
    app = require('./app');

describe('express-engine', function() {

    it('it picks up pages with no assets or controllers', function(done) {
        app.get('/index', function(req, res, next) {
            try {
                expect(res.locals).to.not.be.empty;
                expect(res.locals[DEFAULT_CONFIG.view_location_property]).to.equal('index');
                expect(res.locals[DEFAULT_CONFIG.javascripts_location_property]).to.be.undefined;
                expect(res.locals[DEFAULT_CONFIG.stylesheets_location_property]).to.be.undefined;
                expect(res.locals[DEFAULT_CONFIG.controller_result_property]).to.be.undefined;
            } catch (e) {
                done(e);

                return;
            }

            next();
        });

        request(app).get('/index').end(function(error, res) {
            done(error);
        });
    });

    it('picks up javascript, css, and controllers at root level', function(done) {
        app.get('/dashboard', function(req, res, next) {
            try {
                expect(res.locals).to.not.be.empty;
                expect(res.locals[DEFAULT_CONFIG.view_location_property]).to.equal('dashboard');
                expect(res.locals[DEFAULT_CONFIG.javascripts_location_property]).to.equal('/' + DEFAULT_CONFIG.javascripts_location + '/dashboard.js');
                expect(res.locals[DEFAULT_CONFIG.stylesheets_location_property]).to.equal('/css/dashboard.css');
                expect(res.locals[DEFAULT_CONFIG.controller_result_property].foo).to.equal('bar');
            } catch (e) {
                done(e);

                return;
            }

            next();
        });

        request(app).get('/dashboard').end(function(error, res) {
            done(error);
        });
    });

    it('picks up javascript, css, and controllers at nested level', function(done) {
        app.get('/secure/secrets', function(req, res, next) {
            try {
                expect(res.locals).to.not.be.empty;
                expect(res.locals[DEFAULT_CONFIG.view_location_property]).to.equal('secure/secrets');
                expect(res.locals[DEFAULT_CONFIG.javascripts_location_property]).to.equal('/' + DEFAULT_CONFIG.javascripts_location + '/secure/secrets.js');
                expect(res.locals[DEFAULT_CONFIG.stylesheets_location_property]).to.equal('/css/secure/secrets.css');
                expect(res.locals[DEFAULT_CONFIG.controller_result_property].fizz).to.equal('buzz');
            } catch (e) {
                done(e);

                return;
            }

            next();
        });

        request(app).get('/secure/secrets').end(function(error, res) {
            done(error);
        });
    });

    it('picks up custom urls', function(done) {
        app.get('/options', function(req, res, next) {
            try {
                expect(res.locals).to.not.be.empty;
                expect(res.locals[DEFAULT_CONFIG.view_location_property]).to.equal('settings');
                expect(res.locals[DEFAULT_CONFIG.javascripts_location_property]).to.equal('/' + DEFAULT_CONFIG.javascripts_location + '/settings.js');
                expect(res.locals[DEFAULT_CONFIG.stylesheets_location_property]).to.equal('/css/settings.css');
                expect(res.locals[DEFAULT_CONFIG.controller_result_property].bat).to.equal('baz');
            } catch (e) {
                done(e);

                return;
            }

            next();
        });

        request(app).get('/options').end(function(error, res) {
            done(error);
        });
    });

    it('picks up custom urls at nested level', function(done) {
        app.get('/things', function(req, res, next) {
            try {
                expect(res.locals).to.not.be.empty;
                expect(res.locals[DEFAULT_CONFIG.view_location_property]).to.equal('user1/items');
                expect(res.locals[DEFAULT_CONFIG.javascripts_location_property]).to.equal('/' + DEFAULT_CONFIG.javascripts_location + '/user1/items.js');
                expect(res.locals[DEFAULT_CONFIG.stylesheets_location_property]).to.equal('/css/user1/items.css');
                expect(res.locals[DEFAULT_CONFIG.controller_result_property]['1']).to.equal('2');
            } catch (e) {
                done(e);

                return;
            }

            next();
        });

        request(app).get('/things').end(function(error, res) {
            done(error);
        });
    });

    it('picks up a collection of custom urls (part 1)', function(done) {
        app.get('/profile', function(req, res, next) {
            try {
                expect(res.locals).to.not.be.empty;
                expect(res.locals[DEFAULT_CONFIG.view_location_property]).to.equal('profile');
                expect(res.locals[DEFAULT_CONFIG.javascripts_location_property]).to.equal('/' + DEFAULT_CONFIG.javascripts_location + '/profile.js');
                expect(res.locals[DEFAULT_CONFIG.stylesheets_location_property]).to.equal('/css/profile.css');
                expect(res.locals[DEFAULT_CONFIG.controller_result_property].a).to.equal('b');
            } catch (e) {
                done(e);

                return;
            }

            next();
        });

        request(app).get('/profile').end(function(error, res) {
            done(error);
        });
    });

    it('picks up a collection of custom urls (part 2)', function(done) {
        app.get('/userProfile', function(req, res, next) {
            try {
                expect(res.locals).to.not.be.empty;
                expect(res.locals[DEFAULT_CONFIG.view_location_property]).to.equal('profile');
                expect(res.locals[DEFAULT_CONFIG.javascripts_location_property]).to.equal('/' + DEFAULT_CONFIG.javascripts_location + '/profile.js');
                expect(res.locals[DEFAULT_CONFIG.stylesheets_location_property]).to.equal('/css/profile.css');
                expect(res.locals[DEFAULT_CONFIG.controller_result_property].a).to.equal('b');
            } catch (e) {
                done(e);

                return;
            }

            next();
        });

        request(app).get('/userProfile').end(function(error, res) {
            done(error);
        });
    });

});
