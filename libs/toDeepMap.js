/**
 * Validates a cost for a node
 *
 * @private
 * @param {number} val - Cost to validate
 * @return {bool}
 */
function isValidNode(val) {
  const cost = Number(val);

  if (isNaN(cost) || cost <= 0) {
    return false;
  }

  return true;
}

/**
 * Creates a deep `Map` from the passed object.
 *
 * @param  {Object} source - Object to populate the map with
 * @return {Map} New map with the passed object data
 */
export function toDeepMap(source) {
  const map = new Map();
  const keys = Object.keys(source);

  keys.forEach((key) => {
    const val = source[key];

    if (val !== null && typeof val === "object" && !Array.isArray(val)) {
      return map.set(key, toDeepMap(val));
    }

    if (!isValidNode(val)) {
      throw new Error(`Invalid node: ${key}: ${val}`);
    }

    return map.set(key, Number(val));
  });

  return map;
}
