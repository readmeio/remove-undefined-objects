function isObject(obj: unknown) {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

function isEmptyObject(obj: unknown) {
  return typeof obj === 'object' && obj !== null && !Object.keys(obj).length;
}

// Modified from here: https://stackoverflow.com/a/43781499
function stripEmptyObjects(obj: any) {
  let cleanObj = obj;

  if (!isObject(obj) && !Array.isArray(cleanObj)) {
    return cleanObj;
  } else if (obj === null) {
    return undefined;
  }

  Object.keys(cleanObj).forEach(key => {
    let value = cleanObj[key];

    if (typeof value === 'object' && !Array.isArray(cleanObj) && value !== null) {
      // Recurse, strip out empty objects from children
      value = stripEmptyObjects(value);

      // Then remove all empty objects from the top level object
      if (isEmptyObject(value)) {
        delete cleanObj[key];
      } else {
        cleanObj[key] = value;
      }
    } else if (value === null) {
      delete cleanObj[key];
    }
  });

  if (Array.isArray(cleanObj)) {
    // Since deleting a key from an array will retain an undefined value in that array, we need to
    // filter them out.
    cleanObj = cleanObj.filter(function (el) {
      return el !== undefined;
    });
  }

  return cleanObj;
}

export default function removeUndefinedObjects(obj?: unknown) {
  if (obj === undefined) {
    return undefined;
  }

  // JSON.stringify removes undefined values. Though `[undefined]` will be converted with this to
  // `[null]`, we'll clean that up next.
  let withoutUndefined = JSON.parse(JSON.stringify(obj));

  // Then we recursively remove all empty objects and nullish arrays.
  withoutUndefined = stripEmptyObjects(withoutUndefined);

  // If the only thing that's leftover is an empty object then return nothing.
  if (isEmptyObject(withoutUndefined)) return undefined;

  return withoutUndefined;
}
