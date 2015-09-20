## Philosophy

This library is based on the idea that there are at most four main components involved in rendering a web page:

1. The HTML itself, or a template that produces the HTML (given)
2. Some server-side logic to run when the page is requested (optional)
3. CSS (optional)
4. JS (optional)

Rather than manually wire these things together, why not use filesystem convention to automate the process?  This allows page components to be automatically injected if applicable, and as a bonus your file layout will be organized and consistent.

## What Does This Actually Do?

This library simply injects middleware to run server-side code, as well as expose paths to JS\CSS, in a way that can be consumed by your chosen view engine (HTML templating library).  It does not call `res.render` \ `app.render` or send HTTP responses.  Responses must be sent as usual and you are free to inject your own middleware after `express-engine` in order to further process what this library provides.

## Express Compatibility

Internally, this library only uses `app.get`, and should be compatible with any version of Express that exposes this method.

## Usage

`engine(app, optional partial or full configuration);`

The four components of a page are injected as follows:

##### 1. HTML

For each file found in `app.get('views')`, a corresponding URL will be registered.

ex:

```js
app.set('views', path.join(__dirname, 'views'));
```

    "views/dashboard.jade" -> yourserver.com/dashboard
    "views/user/profile.jade" -> yourserver.com/user/profile
    
In order to aid in the rendering process, the name of the view file suitable for passing into `res.render` will be attached to res.locals.__view (or whatever is configured under `view_location_property`)
    
##### 2. Server-side logic ("controllers")

If a `.js` file with a name matching a view is found in the `controllers` directory (or whatever is configured under `controllers_location`), a corresponding controller will be registered for that view.

ex:

    "controllers/dashboard.js" -> "views/dashboard.jade" -> yourserver.com/dashboard
    "controllers/user/profile.js" -> "views/user/profile.jade" -> yourserver.com/user/profile

Controllers should be modules of the following format:

```js
module.exports = function(req, res, callback) { ... }
```

It is important to note that `callback` here is a standard Node.js-style callback, *not* an Express callback (commonly `next`).  `callback(error)` will result in `next(error)` being called under the covers, but `callback(null, someData)` will attach `someData` to res.locals.__data (or whatever is configured under `controller_result_property`) and then call `next()` under the covers with no arguments.

##### 3. CSS

If a `.css` file with a name matching a view is found in `public/stylesheets` directory (or whatever is configured under `public_location`/`stylesheets_location`), the path to the css file (minus the `public_location` prefix) will be attached to res.locals.__stylesheetFile (or whatever is configured under `stylesheets_location_property`)

ex:

    "public/stylesheets/dashboard.css" -> "views/dashboard.jade" -> yourserver.com/dashboard
    res.locals.__stylesheetFile === "/stylesheets/dashboard.css"
    "public/stylesheets/user/profile.css" -> "views/user/profile.jade" -> yourserver.com/user/profile
    res.locals.__stylesheetFile === "/stylesheets/user/profile.css"

##### 4. JS

If a `.js` file with a name matching a view is found in the `public/javascripts` directory (or whatever is configured under `public_location`/`javascripts_location`), the path to the js file (minus the `public_location` prefix) will be attached to res.locals.__javascriptFile (or whatever is configured under `javascripts_location_property`)

ex:

    "public/javascripts/dashboard.js" -> "views/dashboard.jade" -> yourserver.com/dashboard
    res.locals.__javascriptFile === "/javascripts/dashboard.js"
    "public/javascripts/user/profile.js" -> "views/user/profile.jade" -> yourserver.com/user/profile
    res.locals.__javascriptFile === "/javascripts/user/profile.js"

This is particularly useful if you use a module system like require.js and have a single entry point for all of your page's JS.

## How Do I Hook This Up To My Templates?

In order for this library to remain unopinionated about your chosen templating engine, it's up to you to provide the final injection point of JS\CSS into your HTML.  The best practice would be to set up a single master template like this:

```html
<html>
<head>
(if stylesheet path)<link rel="stylesheet" href="stylesheet path">
</head>
<body>
    (insert body block based on data from controller)
    (if javascript path)<script src="javascript path" type="text/javascript"></script>
</body>
</html>
```

## Configuration

Below is the default configuration.  A partial or full custom configuration can be specified (see Usage section above).  Partial configurations will be merged against the default.

    {
        public_location: 'public',
        javascripts_location: 'javascripts',
        javascripts_location_property: '__javascriptFile',
        stylesheets_location: 'stylesheets',
        stylesheets_location_property: '__stylesheetFile',
        controllers_location: 'controllers',
        controller_result_property: '__data',
        view_location_property: '__view',
        url_mappings: {}
    }
    
`url_mappings` allows any set of page components to be mapped to any URL.

ex:

    url_mappings: { index : '/' }
    "views/index.jade" -> yourserver.com/ (or just yourserver.com)

This mapping will apply to all relevant JS\CSS as well.  Values in `url_mappings` can be either a String, or an Array of String.

## Tests

  To run the test suite, first install the dependencies, then run `npm test`:

```bash
$ npm install
$ npm test
```
