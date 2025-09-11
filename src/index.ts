function isObject(obj: unknown) {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

function isEmptyObject(obj: unknown) {
  return typeof obj === 'object' && obj !== null && !Object.keys(obj).length;
}

interface RemovalOptions {
  preserveNullishArrays?: boolean;
  removeAllFalsy?: boolean;
}

// Remove objects that has undefined value or recursively contain undefined values
// biome-ignore lint/suspicious/noExplicitAny: This method does its own type assertions.
function removeUndefined(obj: any): any {
  if (obj === undefined) {
    return undefined;
  }
  // Preserve null
  if (obj === null) {
    return null;
  }
  // Remove undefined in arrays
  if (Array.isArray(obj)) {
    return obj.map(removeUndefined).filter(item => item !== undefined);
  }
  if (typeof obj === 'object') {
    // biome-ignore lint/suspicious/noExplicitAny: We're just passing around the object values
    const cleaned: Record<string, any> = {};
    Object.entries(obj).forEach(([key, value]) => {
      const cleanedValue = removeUndefined(value);
      if (cleanedValue !== undefined) {
        cleaned[key] = cleanedValue;
      }
    });
    return cleaned;
  }
  return obj;
}

// Modified from here: https://stackoverflow.com/a/43781499
// biome-ignore lint/suspicious/noExplicitAny: This method does its own type assertions.
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
    } else if (value === null && (options.removeAllFalsy || !options.preserveNullishArrays)) {
      // Null entries within an array should be removed by default, unless explicitly preserved
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

  // If array nulls are preserved, use the custom removeUndefined function so that
  // undefined values in arrays aren't converted to nulls, which stringify does
  // If we're not preserving array nulls (default behavior), it doesn't matter that the undefined array values are converted to nulls
  let withoutUndefined = options?.preserveNullishArrays ? removeUndefined(obj) : JSON.parse(JSON.stringify(obj));

  // Then we recursively remove all empty objects and nullish arrays
  withoutUndefined = stripEmptyObjects(withoutUndefined, options);

  // If the only thing that's leftover is an empty object then return nothing.
  if (isEmptyObject(withoutUndefined)) return undefined;

  return withoutUndefined;
}
