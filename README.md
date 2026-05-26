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

Optional boolean or context map.
Controls whether empty arrays will not get removed.

```js
import removeUndefinedObjects from 'remove-undefined-objects';

console.log(removeUndefinedObjects({ key1: [], key2: [undefined], nested: { key3: 'a', key4: [] } }));
// { nested: { key3: 'a' } }

console.log(
  removeUndefinedObjects(
    { key1: [], key2: [undefined], nested: { key3: 'a', key4: [] } },
    { preserveEmptyArray: true },
  ),
);
// { key1: [], key2: [], nested: { key3: 'a', key4: [] } }
```

To preserve empty arrays only in certain locations, provide a context map:

```js
console.log(removeUndefinedObjects([], { preserveEmptyArray: { root: true } }));
// []

console.log(
  removeUndefinedObjects(
    { key1: [], key2: [undefined], key3: [[], ['value']] },
    { preserveEmptyArray: { objectProperty: true } },
  ),
);
// { key1: [], key2: [], key3: [['value']] }

console.log(removeUndefinedObjects([[], [undefined], ['value']], { preserveEmptyArray: { arrayItem: true } }));
// [[], [], ['value']]
```

### `preserveEmptyObject`

Optional boolean or context map.
Controls whether empty objects will not be removed.

```js
import removeUndefinedObjects from 'remove-undefined-objects';

console.log(removeUndefinedObjects({ key1: {}, key2: { nested: undefined }, key3: 123 }));
// { key3: 123 }

console.log(
  removeUndefinedObjects({ key1: {}, key2: { nested: undefined }, key3: 123 }, { preserveEmptyObject: true }),
);
// { key1: {}, key2: {}, key3: 123 }
```

To preserve empty objects only in certain locations, provide a context map:

```js
console.log(removeUndefinedObjects({}, { preserveEmptyObject: { root: true } }));
// {}

console.log(removeUndefinedObjects({ key1: [{}, { nested: undefined }, { key: 'value' }] }));
// { key1: [{ key: 'value' }] }

console.log(
  removeUndefinedObjects(
    { key1: [{}, { nested: undefined }, { key: 'value' }], key2: {}, key3: { nested: undefined } },
    { preserveEmptyObject: { objectProperty: true } },
  ),
);
// { key1: [{ key: 'value' }], key2: {}, key3: {} }

console.log(
  removeUndefinedObjects([{}, { nested: undefined }, { key: 'value' }], { preserveEmptyObject: { arrayItem: true } }),
);
// [{}, {}, { key: 'value' }]
```

Supported preservation contexts are:

- `root`: the cleaned input value itself.
- `objectProperty`: a value assigned to an object property.
- `arrayItem`: a value contained directly in an array.

### `preserveNullishArrays`

Optional boolean.
If provided, null values in arrays will be preserved instead of being removed.

```js
import removeUndefinedObjects from 'remove-undefined-objects';

console.log(removeUndefinedObjects({ key1: [null, undefined], key2: 123, key3: null }));
// { key2: 123, key3: null }
console.log(
  removeUndefinedObjects({ key1: [null, undefined], key2: 123, key3: null }, { preserveNullishArrays: true }),
);
// { key1: [null], key2: 123, key3: null }
```

### `removeAllFalsy`

Optional boolean.
If provided, the empty string `''` and `null` will be removed as well.

```js
import removeUndefinedObjects from 'remove-undefined-objects';

console.log(removeUndefinedObjects({ key1: null, key2: 123, key3: '' }, { removeAllFalsy: true }));
// { key2: 123 }
```
