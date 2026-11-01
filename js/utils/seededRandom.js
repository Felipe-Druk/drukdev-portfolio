/**************************************************************
 * PSEUDO-RANDOM NUMBER GENERATION (js/utils/seededRandom.js)
 **************************************************************/

export function createSeededRandom(seedValue) {
    let state = (seedValue >>> 0) || 1;
    return function nextRandom() {
        state = (state + 0x6D2B79F5) >>> 0;
        let bitMix = Math.imul(state ^ (state >>> 15), 1 | state);
        bitMix = (bitMix + Math.imul(bitMix ^ (bitMix >>> 7), 61 | bitMix)) ^ bitMix;
        return ((bitMix ^ (bitMix >>> 14)) >>> 0) / 4294967296;
    };
}
