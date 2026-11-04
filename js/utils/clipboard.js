/**************************************************************
 * CLIPBOARD UTILITIES (js/utils/clipboard.js)
 **************************************************************/

function fallbackCopyTextToClipboard(textValue) {
    const clipboardTextarea = document.createElement('textarea');
    clipboardTextarea.value = textValue;
    clipboardTextarea.setAttribute('readonly', '');
    clipboardTextarea.style.position = 'fixed';
    clipboardTextarea.style.opacity = '0';
    document.body.appendChild(clipboardTextarea);
    clipboardTextarea.select();
    try {
        document.execCommand('copy');
    } catch {
        // Ignore legacy execCommand errors
    }
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
