/**************************************************************
 * COLOR UTILITIES & MATHEMATICAL INTERPOLATIONS (js/utils/colorMath.js)
 **************************************************************/

import { clamp } from './mathUtils.js';

export function parseHexColorToRgb(hexColor) {
    const cleanHex = hexColor.replace('#', '');
    return {
        red: parseInt(cleanHex.slice(0, 2), 16),
        green: parseInt(cleanHex.slice(2, 4), 16),
        blue: parseInt(cleanHex.slice(4, 6), 16)
    };
}

export function formatRgbChannelToHex(channelValue) {
    const clampedValue = Math.max(0, Math.min(255, Math.round(channelValue)));
    return clampedValue.toString(16).padStart(2, '0').toUpperCase();
}

export function interpolateHexColor(startHex, endHex, interpolationFactor) {
    const clampedFactor = clamp(interpolationFactor, 0, 1);
    const startRgb = parseHexColorToRgb(startHex);
    const endRgb = parseHexColorToRgb(endHex);

    const red = startRgb.red + (endRgb.red - startRgb.red) * clampedFactor;
    const green = startRgb.green + (endRgb.green - startRgb.green) * clampedFactor;
    const blue = startRgb.blue + (endRgb.blue - startRgb.blue) * clampedFactor;

    return `#${formatRgbChannelToHex(red)}${formatRgbChannelToHex(green)}${formatRgbChannelToHex(blue)}`;
}

const DEFAULT_ABYSS_RGB = Object.freeze(parseHexColorToRgb('#080D0A'));

export function shadeHexColorByDepth(hexColor, depthRatio, shadowRgb = DEFAULT_ABYSS_RGB) {
    const clampedRatio = clamp(depthRatio, 0, 1);
    const darkenStrength = Math.min(0.84, Math.pow(clampedRatio, 1.05) * 0.82);
    const sourceRgb = parseHexColorToRgb(hexColor);

    const red = Math.round(sourceRgb.red + (shadowRgb.red - sourceRgb.red) * darkenStrength);
    const green = Math.round(sourceRgb.green + (shadowRgb.green - sourceRgb.green) * darkenStrength);
    const blue = Math.round(sourceRgb.blue + (shadowRgb.blue - sourceRgb.blue) * darkenStrength);

    return `rgb(${red}, ${green}, ${blue})`;
}
