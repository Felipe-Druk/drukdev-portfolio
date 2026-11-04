/**************************************************************
 * MATHEMATICAL UTILITIES (js/utils/mathUtils.js)
 **************************************************************/

export const PORTRAIT_ASPECT_RATIO_THRESHOLD = 0.88;

export function clamp(value, minValue, maxValue) {
    return Math.max(minValue, Math.min(maxValue, value));
}

export function isPortraitAspectRatio(width, height) {
    return width / Math.max(1, height) < PORTRAIT_ASPECT_RATIO_THRESHOLD;
}
