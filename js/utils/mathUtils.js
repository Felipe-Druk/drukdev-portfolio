/**************************************************************
 * MATHEMATICAL UTILITIES (js/utils/mathUtils.js)
 **************************************************************/

export function clamp(value, minValue, maxValue) {
    return Math.max(minValue, Math.min(maxValue, value));
}
