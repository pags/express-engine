var fs = require('fs'),
    path = require('path'),
    cwd = process.cwd(),
    DEFAULT_CONFIG = require('./config');

/**
 * Register express-engine for a given Express Application.
 *
 * @param  {Object} app          Express Application.
 * @param  {Object} [userConfig] User supplied configuration, will be merged into (not override) default configuration.
 */
module.exports = function(app, userConfig) {
    var config = {},
        key;

    for (key in DEFAULT_CONFIG) {
        config[key] = DEFAULT_CONFIG[key];
    }

    if (userConfig && typeof userConfig === 'object') {
        for (key in userConfig) {
            config[key] = userConfig[key];
        }
    }

    (function traverse(directory) {
        fs.readdirSync(directory).forEach(function(file) {
            var endPoint = directory + '/' + file;

            if (fs.lstatSync(endPoint).isDirectory()) {
                traverse(endPoint);
            } else {
                var fileName = directory.replace(app.get('views'), '') + '/' + path.basename(file, path.extname(file)),
                    baseFileName = fileName.substring(1, fileName.length),
                    urlMappings = config.url_mappings[baseFileName],
                    urls = (typeof urlMappings === 'string' || urlMappings instanceof Array) ? urlMappings : fileName,
                    controller,
                    javascriptFile,
                    stylesheetFile;

                if (!(urls instanceof Array)) {
                    urls = [urls];
                }


                if (fs.existsSync(path.normalize(cwd + '/' + config.controllers_location) + fileName + '.js')) {
                    controller = require(path.normalize(cwd + '/' + config.controllers_location) + fileName + '.js');
                }

                if (fs.existsSync(path.normalize(cwd + '/' + config.public_location + '/' + config.javascripts_location) + fileName + '.js')) {
                    javascriptFile = path.normalize('/' + config.javascripts_location) + fileName + '.js';
                }

                if (fs.existsSync(path.normalize(cwd + '/' + config.public_location + '/' + config.stylesheets_location) + fileName + '.css')) {
                    stylesheetFile = path.normalize('/' + config.stylesheets_location) + fileName + '.css';
                }

                urls.forEach(function(url) {
                    if (url[0] !== '/') {
                        url = '/' + url;
                    }

                    app.get(url, function(req, res, next) {
                        res.locals[config.javascripts_location_property] = javascriptFile;
                        res.locals[config.stylesheets_location_property] = stylesheetFile;
                        res.locals[config.view_location_property] = baseFileName;

                        next();
                    });

                    if (controller) {
                        app.get(url, function(req, res, next) {
                            controller(req, res, function(err, result) {
                                if (!res.headersSent) {
                                    if (err) {
                                        next(err);
                                    } else {
                                        res.locals[config.controller_result_property] = result;

                                        next();
                                    }
                                }
                            });
                        });
                    }
                });
            }
        });
    }(app.get('views')));
};
