## Philosophy

This library is based on the idea that there are at most four main components to rendering a web page:

1. The HTML itself, or a template that produces the HTML (given)
2. Some server-side logic to run when the page is requested (optional)
3. CSS (optional)
4. JS (optional)

Rather than manually wire these things together, why not use filesystem convention to automate the process?  Page components can be automatically injected if applicable, and as a bonus your file layout will be organized and consistent.

## What Does This Actually Do?

This library simply injects middleware to run server-side code for a page, as well as expose the paths of JS\CSS in a way that can be consumed by your chosen view engine (HTML templating library).  It does not call `res.render` \ `app.render` or serve requests in any way.  You are free to inject your own middleware after `express-engine` in order to further process what this library provides before finally rendering your page.

## Express Compatibility

Internally, this library only uses `app.get`, and should be compatible with any version of Express that exposes this method.

## Usage

`engine(app, [optional partial or full configuration]);`

The four components of a page are injected as follows:

1. HTML

For each file found in `app.get('views')`, a corresponding URL will be registered.

ex:

```js
app.set('views', path.join(__dirname, 'views'));
```

    "views/dashboard.jade" -> yourserver.com/dashboard
    "views/user/profile.jade" -> yourserver.com/user/profile
    
2. Server-side logic ("controllers")

If a `.js` file with a name matching a view is found in `controllers_location` (see configuration below), a corresponding controller will be registered for that view.

ex:

    "controllers/dashboard.js"
    "views/dashboard.jade" -> yourserver.com/dashboard

Controllers should be modules of the following format:

```js
module.exports = function(req, res, callback) { ... }
```

It is important to note that `callback` here is a standard Node.js-style callback, *not* an Express callback (commonly `next`).  `callback(error)` will result in `next(error)` being called under the covers, but `callback(null, someData)` will attach `someData` to res.locals[`controller_result_property`] (see configuration below) and then call `next()` under the covers with no arguments.

3. CSS

If a `.css` file with a name matching a view is found in `public_location`/`stylesheets_location` (see configuration below), the path to the css file (minus the `public_location` prefix) will be attached to res.locals[`stylesheets_location_property`]

ex:

    "public/stylesheets/dashboard.css"
    "views/dashboard.jade" -> yourserver.com/dashboard
    res.locals[`stylesheets_location_property`] === "/stylesheets/dashboard.css"

4. JS

If a `.js` file with a name matching a view is found in `public_location`/`javascripts_location` (see configuration below), the path to the css file (minus the `public_location` prefix) will be attached to res.locals[`javascripts_location_property`]

ex:

    "public/javascripts/dashboard.js"
    "views/dashboard.jade" -> yourserver.com/dashboard
    res.locals[`javascripts_location_property`] === "/javascripts/dashboard.js"

## Configuration

Below is the default configuration, a partial or full configuration can be specified (see Usage section above).  Partial configurations will be merged against this default.

    {
        public_location: 'public',
        javascripts_location: 'javascripts',
        javascripts_location_property: '__javascriptFile',
        stylesheets_location: 'stylesheets',
        stylesheets_location_property: '__stylsheetFile',
        controllers_location: 'controllers',
        controller_result_property: '__data',
        view_location_property: '__view',
        url_mappings: {}
    }

## Tests

  To run the test suite, first install the dependencies, then run `npm test`:

```bash
$ npm install
$ npm test
```
