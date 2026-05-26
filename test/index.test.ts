import { describe, expect, it } from 'vitest';

import removeUndefinedObjects from '../src/index.js';

describe('typings', () => {
  it('should not blow away typings from supplied objects', () => {
    const obj = removeUndefinedObjects({
      key: 'buster',
    });

    expect(obj).toBeDefined();
  });
});

it('should leave primitives alone', () => {
  expect(removeUndefinedObjects(1234)).toBe(1234);
  expect(removeUndefinedObjects('1234')).toBe('1234');
  expect(removeUndefinedObjects(null)).toBeNull();
  expect(removeUndefinedObjects()).toBeUndefined();
  expect(removeUndefinedObjects()).toBeUndefined();
});

it('should leave only truthy primitives alone when removeAllFalsy is true', () => {
  expect(removeUndefinedObjects(1234, { removeAllFalsy: true })).toBe(1234);
  expect(removeUndefinedObjects('1234', { removeAllFalsy: true })).toBe('1234');
  expect(removeUndefinedObjects(null, { removeAllFalsy: true })).toBeUndefined();
  expect(removeUndefinedObjects(undefined, { removeAllFalsy: true })).toBeUndefined();
});

it("should also remove '' and null values when removeAllFalsy is true", () => {
  expect(removeUndefinedObjects({ value: 1234 }, { removeAllFalsy: true })).toStrictEqual({ value: 1234 });
  expect(removeUndefinedObjects({ value: '1234' }, { removeAllFalsy: true })).toStrictEqual({ value: '1234' });
  expect(removeUndefinedObjects({ value: null }, { removeAllFalsy: true })).toBeUndefined();
  expect(removeUndefinedObjects({ value: undefined }, { removeAllFalsy: true })).toBeUndefined();
});

it('should not remove empty arrays when preserveEmptyArray is true', () => {
  expect(removeUndefinedObjects({ value: [] }, { preserveEmptyArray: true })).toStrictEqual({ value: [] });
  expect(removeUndefinedObjects({ value: [undefined] }, { preserveEmptyArray: true })).toStrictEqual({ value: [] });
  expect(
    removeUndefinedObjects(
      { key1: [], key2: [undefined], nested: { key3: 'a', key4: [] } },
      { preserveEmptyArray: true },
    ),
  ).toStrictEqual({ key1: [], key2: [], nested: { key3: 'a', key4: [] } });
  expect(
    removeUndefinedObjects(
      { value: { a: 'a', nested: { b: 'b', nested2: { c: [undefined], d: [] } } } },
      { preserveEmptyArray: true },
    ),
  ).toStrictEqual({ value: { a: 'a', nested: { b: 'b', nested2: { c: [], d: [] } } } });
});

it('should leave alone non-falsey values when preserveEmptyArray is true', () => {
  expect(removeUndefinedObjects({ value: { a: [1, 2, 3] }, b: null }, { preserveEmptyArray: true })).toStrictEqual({
    value: { a: [1, 2, 3] },
    b: null,
  });
  expect(
    removeUndefinedObjects(
      { value: { a: [1, undefined], nested: { b: 'b', c: [undefined], d: [] } } },
      { preserveEmptyArray: true },
    ),
  ).toStrictEqual({ value: { a: [1], nested: { b: 'b', c: [], d: [] } } });
});

it('should remove empty objects with only empty properties', () => {
  const obj = {
    a: {
      b: {},
      c: {
        d: {},
      },
    },
  };

  expect(removeUndefinedObjects(obj)).toBeUndefined();
});

it('should remove empty objects with only undefined properties', () => {
  const obj = {
    a: {
      b: undefined,
      c: {
        d: undefined,
      },
    },
  };

  expect(removeUndefinedObjects(obj)).toBeUndefined();
});

it('should not remove empty objects when preserveEmptyObject is true', () => {
  expect(removeUndefinedObjects({}, { preserveEmptyObject: true })).toStrictEqual({});
  expect(removeUndefinedObjects({ value: {} }, { preserveEmptyObject: true })).toStrictEqual({ value: {} });
  expect(removeUndefinedObjects({ value: { nested: {} } }, { preserveEmptyObject: true })).toStrictEqual({
    value: { nested: {} },
  });
});

it('should preserve objects that become empty after removing undefined properties', () => {
  expect(removeUndefinedObjects({ value: { nested: undefined } }, { preserveEmptyObject: true })).toStrictEqual({
    value: {},
  });
  expect(
    removeUndefinedObjects(
      {
        value: {
          nested: {
            deeper: undefined,
          },
        },
      },
      { preserveEmptyObject: true },
    ),
  ).toStrictEqual({ value: { nested: {} } });
});

it('should remove empty arrays from within object', () => {
  const obj = {
    a: {
      b: undefined,
      c: {
        d: undefined,
      },
    },
    d: [1234, undefined],
    e: [],
    f: null,
    g: [null, undefined, null],
  };

  expect(removeUndefinedObjects(obj)).toStrictEqual({
    d: [1234],
    f: null,
  });
});

it('should remove empty arrays and falsy values from within object when removeAllFalsy is true', () => {
  const obj = {
    a: {
      b: undefined,
      c: {
        d: undefined,
      },
    },
    d: [1234, undefined],
    e: [],
    f: null,
    g: [null, undefined, null],
  };

  expect(removeUndefinedObjects(obj, { removeAllFalsy: true })).toStrictEqual({
    d: [1234],
  });
});

it('should remove undefined and null values from arrays', () => {
  expect(removeUndefinedObjects([undefined, undefined])).toBeUndefined();
  expect(removeUndefinedObjects([null])).toBeUndefined();
  expect(removeUndefinedObjects(['1234', null, undefined, { a: null, b: undefined }, '   ', ''])).toStrictEqual([
    '1234',
    {
      a: null,
    },
    '   ',
    '',
  ]);
});

it('should not remove empty object values from arrays when preserveEmptyObject is true', () => {
  expect(removeUndefinedObjects([{}, { a: undefined }, { b: 'b' }], { preserveEmptyObject: true })).toStrictEqual([
    {},
    {},
    { b: 'b' },
  ]);
  expect(
    removeUndefinedObjects({ value: [{}, { a: undefined }, { b: [] }] }, { preserveEmptyObject: true }),
  ).toStrictEqual({
    value: [{}, {}, {}],
  });
});

it('should remove empty object values from arrays when preserveEmptyObjectsInArrays is false', () => {
  expect(
    removeUndefinedObjects([{}, { a: undefined }, { b: 'b' }], {
      preserveEmptyObject: true,
      preserveEmptyObjectsInArrays: false,
    }),
  ).toStrictEqual([{ b: 'b' }]);

  expect(
    removeUndefinedObjects(
      {
        topLevelEmptyObject: {},
        nested: {
          emptyObject: {},
        },
        array: [{}, { emptyObject: {} }, { value: 'value' }],
      },
      {
        preserveEmptyObject: true,
        preserveEmptyObjectsInArrays: false,
      },
    ),
  ).toStrictEqual({
    topLevelEmptyObject: {},
    nested: {
      emptyObject: {},
    },
    array: [{ emptyObject: {} }, { value: 'value' }],
  });

  expect(
    removeUndefinedObjects(
      { value: [{}, { a: undefined }] },
      {
        preserveEmptyArray: true,
        preserveEmptyObject: true,
        preserveEmptyObjectsInArrays: false,
      },
    ),
  ).toStrictEqual({ value: [] });
});

it('should preserve empty object values from arrays when preserveEmptyObjectsInArrays is true', () => {
  expect(
    removeUndefinedObjects([{}, { a: undefined }, { b: 'b' }], {
      preserveEmptyObject: false,
      preserveEmptyObjectsInArrays: true,
    }),
  ).toStrictEqual([{}, {}, { b: 'b' }]);
});

it('should not remove null values from arrays when preserveArrayNulls is true', () => {
  expect(removeUndefinedObjects([null], { preserveNullishArrays: true })).toStrictEqual([null]);
  expect(removeUndefinedObjects([undefined], { preserveNullishArrays: true })).toBeUndefined();
  expect(removeUndefinedObjects([null, undefined], { preserveNullishArrays: true })).toStrictEqual([null]);
  expect(
    removeUndefinedObjects([null, undefined, { a: null, b: undefined }], { preserveNullishArrays: true }),
  ).toStrictEqual([null, { a: null }]);
  expect(
    removeUndefinedObjects(
      { a: 'a', empty_nested: { nested2: { nested3: undefined } }, nested_array: { b: [null, 1, undefined, 2] } },
      { preserveNullishArrays: true },
    ),
  ).toStrictEqual({ a: 'a', nested_array: { b: [null, 1, 2] } });
});
