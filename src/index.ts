function isObject(obj: unknown) {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

function isEmptyObject(obj: unknown) {
  return typeof obj === 'object' && obj !== null && !Object.keys(obj).length;
}

interface RemovalOptions {
  removeAllFalsy?: boolean;
}

// Modified from here: https://stackoverflow.com/a/43781499
function stripEmptyObjects(obj: any, options: RemovalOptions = {}) {
  const cleanObj = obj;

  if (obj === null && options.removeAllFalsy) {
    return undefined;
  }

  if (!isObject(obj) && !Array.isArray(cleanObj)) {
    return cleanObj;
  }

  if (!Array.isArray(cleanObj)) {
    Object.keys(cleanObj).forEach(key => {
      let value = cleanObj[key];

      if (typeof value !== 'object') {
        return;
      }

      if (value === null) {
        if (options.removeAllFalsy) {
          delete cleanObj[key];
        }
        return;
      }

      value = stripEmptyObjects(value, options);

      if (isEmptyObject(value)) {
        delete cleanObj[key];
      } else {
        cleanObj[key] = value;
      }
    });

    return cleanObj;
  }

  cleanObj.forEach((o, idx) => {
    let value = o;
    if (typeof value === 'object' && value !== null) {
      value = stripEmptyObjects(value, options);

      if (isEmptyObject(value)) {
        delete cleanObj[idx];
      } else {
        cleanObj[idx] = value;
      }
    } else if (value === null) {
      // Null entries within an array should be removed.
      delete cleanObj[idx];
    }
  });

  // Since deleting a key from an array will retain an undefined value in that array, we need to
  // filter them out.
  return cleanObj.filter(el => el !== undefined);
}

export default function removeUndefinedObjects<T>(obj?: T, options?: RemovalOptions): T | undefined {
  if (obj === undefined) {
    return undefined;
  }

  // JSON.stringify removes undefined values. Though `[undefined]` will be converted with this to
  // `[null]`, we'll clean that up next.
  // eslint-disable-next-line try-catch-failsafe/json-parse
  let withoutUndefined = JSON.parse(JSON.stringify(obj));

  // Then we recursively remove all empty objects and nullish arrays.
  withoutUndefined = stripEmptyObjects(withoutUndefined, options);

  // If the only thing that's leftover is an empty object then return nothing.
  if (isEmptyObject(withoutUndefined)) return undefined;

  return withoutUndefined;
}
