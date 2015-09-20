## Usage

```js
var engine = require('express-engine');
var app = express();
var path = require('path');

app.set('views', path.join(__dirname, 'views'));

engine(app);

app.listen(3000);
```
