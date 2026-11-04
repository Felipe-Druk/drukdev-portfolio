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

export function areRectsIntersecting(rectA, rectB) {
    return (
        rectA.x < rectB.x + rectB.w &&
        rectA.x + rectA.w > rectB.x &&
        rectA.y < rectB.y + rectB.h &&
        rectA.y + rectA.h > rectB.y
    );
}

export function removeItemSwapAndPop(array, index) {
    const lastItem = array.pop();
    if (index < array.length) {
        array[index] = lastItem;
    }
}
