## Getting Started

**install**

```console
$ yarn add service-gen-loader -D
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