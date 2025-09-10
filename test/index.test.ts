import { describe, expect, it, test } from 'vitest';

import removeUndefinedObjects from '../src/index.js';

describe('typings', () => {
  it('should not blow away typings from supplied objects', () => {
    const obj = removeUndefinedObjects({
      key: 'buster',
    });

    expect(obj).toBeDefined();
  });
});

test('should leave primitives alone', () => {
  expect(removeUndefinedObjects(1234)).toBe(1234);
  expect(removeUndefinedObjects('1234')).toBe('1234');
  expect(removeUndefinedObjects(null)).toBeNull();
  expect(removeUndefinedObjects()).toBeUndefined();
  expect(removeUndefinedObjects(undefined)).toBeUndefined();
});

test('should leave only truthy primitives alone when removeAllFalsy is true', () => {
  expect(removeUndefinedObjects(1234, { removeAllFalsy: true })).toBe(1234);
  expect(removeUndefinedObjects('1234', { removeAllFalsy: true })).toBe('1234');
  expect(removeUndefinedObjects(null, { removeAllFalsy: true })).toBeUndefined();
  expect(removeUndefinedObjects(undefined, { removeAllFalsy: true })).toBeUndefined();
});

test("should also remove '' and null values when removeAllFalsy is true", () => {
  expect(removeUndefinedObjects({ value: 1234 }, { removeAllFalsy: true })).toStrictEqual({ value: 1234 });
  expect(removeUndefinedObjects({ value: '1234' }, { removeAllFalsy: true })).toStrictEqual({ value: '1234' });
  expect(removeUndefinedObjects({ value: null }, { removeAllFalsy: true })).toBeUndefined();
  expect(removeUndefinedObjects({ value: undefined }, { removeAllFalsy: true })).toBeUndefined();
});

test('should not remove empty arrays when preserveEmptyArray is true', () => {
  expect(removeUndefinedObjects({ value: [] }, { preserveEmptyArray: true })).toStrictEqual({ value: [] });
  expect(removeUndefinedObjects({ value: [undefined] }, { preserveEmptyArray: true })).toStrictEqual({ value: [] });
  expect(
    removeUndefinedObjects(
      { value: { a: 'a', nested: { b: 'b', nested2: { c: [undefined], d: [] } } } },
      { preserveEmptyArray: true },
    ),
  ).toStrictEqual({ value: { a: 'a', nested: { b: 'b', nested2: { c: [], d: [] } } } });
});

test('should leave alone non-falsey values when preserveEmptyArray is true', () => {
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

test('should remove empty objects with only empty properties', () => {
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

test('should remove empty objects with only undefined properties', () => {
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

test('should remove empty arrays from within object', () => {
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

test('should remove empty arrays and falsy values from within object when removeAllFalsy is true', () => {
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

test('should remove undefined and null values from arrays', () => {
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
