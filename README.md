# geoservices-for-browser
JS module for consuming [Pladias](pladias.cz) geowebservices by using OpenLayers. 


### sample usage in package.json
```json
{
  "dependencies": {
    "geoservices-for-browser": "pladias-cz/geoservices-for-browser#v0.3.1"
  }
}
```

Since v0.2 the .env file has to be used to configure geoserver URL.

Add to the webpack.config.js:
```js
const webpack = require('webpack');
const dotenv = require('dotenv');
const env = dotenv.config().parsed;

//... pure Webpack
plugins: [
    new webpack.DefinePlugin({ //https://webpack.js.org/plugins/define-plugin/
        'process.env': JSON.stringify(env)
    })
]
// Encore
    Encore.addPlugin(new webpack.DefinePlugin({
        'process.env': JSON.stringify(env)
    });

```
and create .env file next to webpack.config.js

## TBD 
* divide content into general and site-specific