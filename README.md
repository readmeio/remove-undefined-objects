# remove-undefined-objects

[![Build](https://github.com/readmeio/remove-undefined-objects/workflows/CI/badge.svg)](https://github.com/readmeio/remove-undefined-objects/) [![](https://img.shields.io/npm/v/remove-undefined-objects)](https://npm.im/remove-undefined-objects)

[![](https://raw.githubusercontent.com/readmeio/.github/main/oss-header.png)](https://readme.io)

## Installation

```sh
npm install --save remove-undefined-objects
```

## Usage

```js
import removeUndefinedObjects from 'remove-undefined-objects';

console.log(removeUndefinedObjects({key: [], key2: 123}));
// { key2: 123 }
```

## Behavior

Any items with the following value will be removed:

* Empty object, `{}`
* Empty array, `[]`
* Undefined, `undefined`

The following items will NOT be removed:

* Empty string, `''`
* Null, `null`
