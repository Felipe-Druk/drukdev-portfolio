/**************************************************************
 * SANCTUARY SCENE, CELESTIAL & CLOUD PALETTES (js/config/palettes/sanctuaryPalettes.js)
 **************************************************************/

import { DRUK_CORE_PALETTE } from './corePalette.js';
import { interpolateHexColor } from '../../utils/colorMath.js';

export const SANCTUARY_SCENE_PALETTE = Object.freeze({
    skyTop: '#07080C',
    skyMid: '#120E18',
    skyBottom: '#1E1622',
    mountainLeft: '#0D0C12',
    mountainCenter: '#100E16',
    mountainRight: '#0B0A10',
    moonHalo: 'rgba(185, 43, 146, 0.16)',
    moonShadow: '#09090E',
    sunHalo: 'rgba(255, 176, 0, 0.22)',
    sunOuterRing: '#E07A2A',
    sunInnerRing: '#FFB000',
    sunCore: '#FFF5D6',
    pollenGold: '#FFB000',
    pollenIvory: '#FFF5D6',
    pollenWarm: '#D4957A',
    waterBank: '#1A3347',
    waterDeep: '#0E2233',
    waterMid: '#132D42',
    waterHighlight: '#2C5E7A',
    waterFoam: '#7AD7F0',
    rippleStrokeRgb: '216, 226, 235',
    trunkDark: '#3D271E',
    trunkLight: '#5C3A2B',
    abyssSoilShadow: '#080D0A',
    constellationMutedLabel: '#8E8582',
    constellationHoverBg: 'rgba(13, 13, 15, 0.85)',
    crtAmbientGlowHover: 'rgba(0, 255, 65, 0.28)',
    crtAmbientGlowIdle: 'rgba(0, 255, 65, 0.12)'
});

export const CELESTIAL_STAGES = Object.freeze({
    night: Object.freeze({
        skyTop: SANCTUARY_SCENE_PALETTE.skyTop,
        skyMid: SANCTUARY_SCENE_PALETTE.skyMid,
        skyBottom: SANCTUARY_SCENE_PALETTE.skyBottom,
        mountainFar: SANCTUARY_SCENE_PALETTE.mountainCenter,
        mountainMid: SANCTUARY_SCENE_PALETTE.mountainLeft,
        mountainNear: SANCTUARY_SCENE_PALETTE.mountainRight,
        waterDeep: SANCTUARY_SCENE_PALETTE.waterDeep,
        waterInner: SANCTUARY_SCENE_PALETTE.waterMid,
        waterRim: SANCTUARY_SCENE_PALETTE.waterBank,
        waterHighlight: SANCTUARY_SCENE_PALETTE.waterHighlight,
        constellationEdgeIdle: DRUK_CORE_PALETTE.dragonBase,
        constellationEdgeHover: DRUK_CORE_PALETTE.dragonLight,
        constellationStarBright: DRUK_CORE_PALETTE.steelLight,
        constellationStarDim: DRUK_CORE_PALETTE.bronzeWarm,
        constellationLabel: SANCTUARY_SCENE_PALETTE.constellationMutedLabel
    }),
    sunset: Object.freeze({
        skyTop: '#1A0F24',
        skyMid: '#5E2340',
        skyBottom: '#D48244',
        mountainFar: '#2A162D',
        mountainMid: '#211124',
        mountainNear: '#170B1A',
        waterDeep: '#2A1829',
        waterInner: '#8A4E3B',
        waterRim: '#3E2434',
        waterHighlight: '#D4957A',
        constellationEdgeIdle: '#A84A5C',
        constellationEdgeHover: '#FFF5D6',
        constellationStarBright: '#FFF5D6',
        constellationStarDim: '#FFB000',
        constellationLabel: '#F3D5B5'
    }),
    day: Object.freeze({
        skyTop: '#1B334B',
        skyMid: '#35607A',
        skyBottom: '#8CA8AC',
        mountainFar: '#283D4E',
        mountainMid: '#1D2D3A',
        mountainNear: '#15222D',
        waterDeep: '#1F4E6B',
        waterInner: '#2B688A',
        waterRim: '#2C5E7A',
        waterHighlight: '#4A89A8',
        constellationEdgeIdle: '#8A4E3B',
        constellationEdgeHover: '#FFB000',
        constellationStarBright: '#FFF5D6',
        constellationStarDim: '#FFB000',
        constellationLabel: '#F3D5B5'
    })
});

export const CLOUD_PALETTES = Object.freeze({
    ethereal: Object.freeze({
        night: Object.freeze({
            light: '#56616E',
            mid: '#2B3138',
            shadow: '#141116',
            accent: '#D8E2EB'
        }),
        sunset: Object.freeze({
            light: '#F3D5B5',
            mid: '#D4957A',
            shadow: '#7A1F73',
            accent: '#FFB000'
        }),
        day: Object.freeze({
            light: '#F4F8FB',
            mid: '#D8E2EB',
            shadow: '#9BA7B4',
            accent: '#7AD7F0'
        })
    }),
    storm: Object.freeze({
        night: Object.freeze({
            light: '#00E5FF',
            mid: '#2B3138',
            shadow: '#3D1247',
            accent: '#B92B92'
        }),
        sunset: Object.freeze({
            light: '#B92B92',
            mid: '#3D1247',
            shadow: '#1A0F24',
            accent: '#00E5FF'
        }),
        day: Object.freeze({
            light: '#7AD7F0',
            mid: '#2B3138',
            shadow: '#3D1247',
            accent: '#00E5FF'
        })
    }),
    aurora: Object.freeze({
        night: Object.freeze({
            light: '#00F5D4',
            mid: '#1F4E6B',
            shadow: '#0E2233',
            accent: '#7AD7F0'
        }),
        sunset: Object.freeze({
            light: '#7AD7F0',
            mid: '#1F4E6B',
            shadow: '#0E2233',
            accent: '#00F5D4'
        }),
        day: Object.freeze({
            light: '#A8F9EE',
            mid: '#1F4E6B',
            shadow: '#0E2233',
            accent: '#00F5D4'
        })
    }),
    crimson: Object.freeze({
        night: Object.freeze({
            light: '#D4957A',
            mid: '#B92B92',
            shadow: '#3D1247',
            accent: '#F3D5B5'
        }),
        sunset: Object.freeze({
            light: '#F3D5B5',
            mid: '#D4957A',
            shadow: '#3D1247',
            accent: '#FFB000'
        }),
        day: Object.freeze({
            light: '#F3D5B5',
            mid: '#D4957A',
            shadow: '#7A1F73',
            accent: '#B92B92'
        })
    })
});

let activeWeatherKey = 'ethereal';

export function getActiveWeatherKey() {
    return activeWeatherKey;
}

export function setActiveWeatherKey(weatherKey) {
    if (CLOUD_PALETTES[weatherKey]) {
        activeWeatherKey = weatherKey;
    }
    return activeWeatherKey;
}

export function getActiveCloudPalette(celestialProgress = 0) {
    const weatherStages = CLOUD_PALETTES[activeWeatherKey] || CLOUD_PALETTES.ethereal;
    const clampedProgress = Math.max(0, Math.min(1, Number.isFinite(celestialProgress) ? celestialProgress : 0));

    if (clampedProgress === 0) return weatherStages.night;
    if (clampedProgress === 0.5) return weatherStages.sunset;
    if (clampedProgress === 1) return weatherStages.day;

    const isFirstHalf = clampedProgress < 0.5;
    const fromStage = isFirstHalf ? weatherStages.night : weatherStages.sunset;
    const toStage = isFirstHalf ? weatherStages.sunset : weatherStages.day;
    const stageFactor = isFirstHalf ? clampedProgress / 0.5 : (clampedProgress - 0.5) / 0.5;

    return {
        light: interpolateHexColor(fromStage.light, toStage.light, stageFactor),
        mid: interpolateHexColor(fromStage.mid, toStage.mid, stageFactor),
        shadow: interpolateHexColor(fromStage.shadow, toStage.shadow, stageFactor),
        accent: interpolateHexColor(fromStage.accent, toStage.accent, stageFactor)
    };
}

export function getInterpolatedScenePalette(progress = 0) {
    const clampedProgress = Math.max(0, Math.min(1, Number.isFinite(progress) ? progress : 0));

    if (clampedProgress === 0) {
        return CELESTIAL_STAGES.night;
    }
    if (clampedProgress === 0.5) {
        return CELESTIAL_STAGES.sunset;
    }
    if (clampedProgress === 1) {
        return CELESTIAL_STAGES.day;
    }

    const isFirstHalf = clampedProgress < 0.5;
    const fromStage = isFirstHalf ? CELESTIAL_STAGES.night : CELESTIAL_STAGES.sunset;
    const toStage = isFirstHalf ? CELESTIAL_STAGES.sunset : CELESTIAL_STAGES.day;
    const stageFactor = isFirstHalf ? clampedProgress / 0.5 : (clampedProgress - 0.5) / 0.5;

    const interpolatedPalette = {};
    const stageKeys = Object.keys(CELESTIAL_STAGES.night);
    for (let index = 0; index < stageKeys.length; index++) {
        const key = stageKeys[index];
        interpolatedPalette[key] = interpolateHexColor(fromStage[key], toStage[key], stageFactor);
    }

    return interpolatedPalette;
}
