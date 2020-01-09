# CAR FOR YOU Example

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

> A [@pika/pack](https://github.com/pikapkg/pack) build plugin.
> Adds a Node.js distribution to your package, built & optimized to run on [Node.js](https://nodejs.org/). If no other distribution is included with your package, many other tools & bundlers can understand this format as well.

## Installation
```
npm install @carforyou/pika-plugin-build-standalone-node
```

## Usage

```json
{
  "name": "example-pkg",
  "version": "1.0.0",
  "@pika/pack": {
    "pipeline": [
      ["@pika/plugin-standard-pkg"],
      ["@carforyou/pika-plugin-build-standalone-node", {}]
    ]
  }
}
```

Only works with `@pika/plugin-ts-standard-pkg` as it currently relies on typescript to write the source file.
In your `tsconfig.pika.json`, include the separate source `node.ts`:
```
"include": ["src/index.ts", "src/node.ts"],
```

Add your node-specific code to `src/node.ts`.

For more information about @pika/pack & help getting started, [check out the main project repo](https://github.com/pikapkg/pack).


## Options

- `"sourcemap"` (Default: `"true"`): Adds a [source map](https://www.html5rocks.com/en/tutorials/developertools/sourcemaps/) for this build.
- `"minNodeVersion"` (Default: `"8"`): This plugin will build your package for the current minimum [Node.js LTS](https://github.com/nodejs/Release) major version. This option allows you to target later versions of Node.js only.
- `"entrypoint"` (Default: `"main"`): Customize the package.json manifest entrypoint set by this plugin. Accepts either a string, an array of strings, or `null` to disable entrypoint. Changing this is not recommended for most usage.

## Result

1. Adds a Node.js distribution to your built package: `dist-node/node.js` based on `dist-src/node.js`
  1. Common.js (CJS) Module Syntax
  1. Transpiled to run on Node.js LTS (Currently, supports Node.js version v6+)
1. Adds a "main" entrypoint to your built `package.json` manifest.


## Development
```
npm run build
```

You can link your local npm package to integrate it with any local project:
```
cd pika-plugin-build-standalone-node-pkg
npm run build

cd carforyou-listings-web
npm link ../pika-plugin-build-standalone-node-pkg/pkg
```

## Release a new version

Releasing is done using semantic release on the ci after merging into the default branch.

