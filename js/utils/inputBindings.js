/**************************************************************
 * INPUT BINDING UTILITIES — NORMALIZED TOUCH & MOUSE ACTIONS
 * (js/utils/inputBindings.js)
 **************************************************************/

export function bindImmediatePressAction(elementOrId, actionCallback) {
    if (typeof actionCallback !== 'function') return null;

    const targetElement = typeof elementOrId === 'string'
        ? document.getElementById(elementOrId)
        : elementOrId;
    if (!targetElement) return null;

    const handlePress = (event) => {
        if (event && typeof event.preventDefault === 'function') {
            event.preventDefault();
        }
        actionCallback(event);
    };

    targetElement.addEventListener('mousedown', handlePress);
    targetElement.addEventListener('touchstart', handlePress, { passive: false });

    return targetElement;
}
