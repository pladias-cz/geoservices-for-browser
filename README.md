# pladias-geoservices
JS module for consuming [Pladias](pladias.cz) geowebservices by using OpenLayers. 


### sample usage in package.json
```json
{
  "dependencies": {
    "pladias-geoservices": "krkabol/pladias-geoservices#v0.2.0"
  }
}
```

Since v0.2 the .env file has to be used to configure geoserver URL.

Add to the webpack.config.js:
```js
const webpack = require('webpack');
const dotenv = require('dotenv');
const env = dotenv.config().parsed;

...
plugins: [
    new webpack.DefinePlugin({ //https://webpack.js.org/plugins/define-plugin/
        'process.env': JSON.stringify(env)
    })
]

```
and create .env file next to webpack.config.js

## TBD 
* divide content into general and site-specific