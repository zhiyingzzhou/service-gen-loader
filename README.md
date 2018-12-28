## Getting Started

**install**

```console
$ npm install service-gen-loader --save-dev
```

**service-mapping.json**

```js
import mapping from './service-mapping.json';
```

Then add the loader to your `webpack` config. For example:

**webpack.config.js**

```js
module.exports = {
    module: {
        rules: [
            {
                test: /-mapping.json$/,
                use: [
                    {
                        loader: 'service-gen-loader',
                        options: {
                            fileName: 'service.js',
                            declareFileName: 'service.d.ts',
                            filePath: (ctx) => {
                                return ctx.context;
                            },
                            declareFilePath: (ctx) => {
                                return path.resolve(ctx.context, '../types');
                            }
                        }
                    }
                ]
            }
        ]
    }
}
```