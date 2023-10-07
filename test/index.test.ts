import { describe, test, it, expect } from 'vitest';

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
