/**
 * ID Helper Utility
 * Normalizes ID fields from backend responses
 * Supabase uses 'id', but we support both 'id' and '_id' for compatibility
 */

/**
 * Get the ID from an object, preferring 'id' over '_id'
 * @param {Object} obj - Object that may have 'id' or '_id' property
 * @returns {string|number|null} - The ID value or null if not found
 */
export const getId = (obj) => {
  if (!obj) return null;
  return obj.id || obj._id || null;
};

/**
 * Normalize an object to use 'id' instead of '_id'
 * @param {Object} obj - Object that may have '_id' property
 * @returns {Object} - Object with 'id' property (and '_id' for backward compatibility)
 */
export const normalizeId = (obj) => {
  if (!obj) return obj;
  if (obj._id && !obj.id) {
    return { ...obj, id: obj._id };
  }
  return obj;
};

/**
 * Normalize an array of objects to use 'id' consistently
 * @param {Array} arr - Array of objects
 * @returns {Array} - Array with normalized IDs
 */
export const normalizeIds = (arr) => {
  if (!Array.isArray(arr)) return arr;
  return arr.map(normalizeId);
};
