## Usage

```js
var engine = require('express-engine');
var express = require('express');
var app = express();
var path = require('path');

app.set('views', path.join(__dirname, 'views'));

engine(app);

app.listen(3000);
```

## Tests

  To run the test suite, first install the dependencies, then run `npm test`:

```bash
$ npm install
$ npm test
```
