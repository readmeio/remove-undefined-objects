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

console.log(removeUndefinedObjects({ key: [], key2: 123 }));
// { key2: 123 }
```

## Behavior

Any items with the following value will be removed by default:

- Empty object, `{}`
- Empty array, `[]`
- Undefined, `undefined`

The following items will NOT be removed:

- Empty string, `''`
- Null, `null`

## Options

### `preserveEmptyArray`

Optional boolean.
If provided, empty arrays `[]` will not get removed

```js
import removeUndefinedObjects from 'remove-undefined-objects';

console.log(
  removeUndefinedObjects({ key1: [], key2: [undefined], key3: { key4: 'a', key5: [] } }, { preserveEmptyArray: true }),
);
// { key1: [], key2: [], key3: { key4: 'a', key5: [] } }
```

### `removeAllFalsy`

Optional boolean.
If provided, the empty string `''` and `null` will be removed as well.

```js
import removeUndefinedObjects from 'remove-undefined-objects';

console.log(removeUndefinedObjects({ key1: null, key2: 123, key3: '' }, { removeAllFalsy: true }));
// { key2: 123 }
```
