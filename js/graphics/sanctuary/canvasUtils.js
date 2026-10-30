/**************************************************************
 * SANCTUARY CANVAS PRIMITIVES & GEOMETRY UTILITIES
 **************************************************************/

export const PIXEL_UNIT = 4;

export function snapToPixel(value) {
    return Math.floor(value / PIXEL_UNIT) * PIXEL_UNIT;
}

export function drawRect(context, x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(
        Math.floor(x),
        Math.floor(y),
        Math.floor(width),
        Math.floor(height)
    );
}

export function isPointInRect(pointX, pointY, rect) {
    return (
        pointX >= rect.x &&
        pointX <= rect.x + rect.w &&
        pointY >= rect.y &&
        pointY <= rect.y + rect.h
    );
}

export function drawPixelLine(context, startX, startY, endX, endY, color, stepSize = 2) {
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const distance = Math.hypot(deltaX, deltaY);
    const totalSteps = Math.max(1, Math.ceil(distance / stepSize));

    context.fillStyle = color;
    for (let stepIndex = 0; stepIndex <= totalSteps; stepIndex++) {
        const interpolationRatio = stepIndex / totalSteps;
        const pixelX = Math.floor((startX + deltaX * interpolationRatio) / stepSize) * stepSize;
        const pixelY = Math.floor((startY + deltaY * interpolationRatio) / stepSize) * stepSize;
        context.fillRect(pixelX, pixelY, stepSize, stepSize);
    }
}

export function drawFloatingPixelLabel(context, centerX, topY, text, borderColor) {
    context.font = '11px "IBM Plex Mono", monospace';
    const textWidth = context.measureText(text).width;
    const boxWidth = Math.ceil(textWidth + 18);
    const boxHeight = 22;
    const boxX = Math.floor(centerX - boxWidth / 2);
    const boxY = Math.floor(topY - boxHeight / 2);

    drawRect(context, boxX - 2, boxY - 2, boxWidth + 4, boxHeight + 4, '#0D0D0F');
    drawRect(context, boxX, boxY, boxWidth, boxHeight, '#141116');
    context.strokeStyle = borderColor;
    context.lineWidth = 2;
    context.strokeRect(boxX, boxY, boxWidth, boxHeight);

    context.fillStyle = borderColor;
    context.textAlign = 'center';
    context.fillText(text, centerX, boxY + 15);
}

function fallbackCopyTextToClipboard(textValue) {
    const clipboardTextarea = document.createElement('textarea');
    clipboardTextarea.value = textValue;
    document.body.appendChild(clipboardTextarea);
    clipboardTextarea.select();
    document.execCommand('copy');
    document.body.removeChild(clipboardTextarea);
}

export function copyTextToClipboard(textValue) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textValue).catch(() => {
            fallbackCopyTextToClipboard(textValue);
        });
        return;
    }
    fallbackCopyTextToClipboard(textValue);
}
