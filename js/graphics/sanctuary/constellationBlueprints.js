/**************************************************************
 * SKY CONSTELLATION BLUEPRINTS — STATIC GEOMETRY & NODES
 * (js/graphics/sanctuary/constellationBlueprints.js)
 **************************************************************/

export const CONSTELLATION_BLUEPRINTS = [
    {
        id: 'github',
        type: 'social',
        relativeX: 0.14,
        relativeY: 0.22,
        portraitRelativeX: 0.20,
        portraitRelativeY: 0.17,
        rotationAngle: -0.18,
        nodes: [
            [-22, -16], [-38, 0], [-22, 16],
            [-7, 20], [0, 0], [7, -20],
            [22, -16], [38, 0], [22, 16]
        ],
        edges: [
            [0, 1], [1, 2],
            [3, 4], [4, 5],
            [6, 7], [7, 8]
        ]
    },
    {
        id: 'youtube',
        type: 'social',
        relativeX: 0.29,
        relativeY: 0.15,
        portraitRelativeX: 0.52,
        portraitRelativeY: 0.15,
        rotationAngle: 0.14,
        nodes: [
            [-36, -20], [36, -20], [36, 20], [-36, 20],
            [-10, -11], [-10, 11], [15, 0]
        ],
        edges: [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [4, 5], [5, 6], [6, 4]
        ]
    },
    {
        id: 'cv',
        type: 'cv',
        relativeX: 0.44,
        relativeY: 0.17,
        portraitRelativeX: 0.50,
        portraitRelativeY: 0.30,
        rotationAngle: -0.10,
        nodes: [
            [-22, -22], [10, -22], [22, -10], [22, 22], [-22, 22],
            [10, -10],
            [-12, -2], [10, -2],
            [-12, 10], [12, 10]
        ],
        edges: [
            [0, 1], [1, 2], [2, 3], [3, 4], [4, 0],
            [1, 5], [5, 2],
            [6, 7], [8, 9]
        ]
    },
    {
        id: 'linkedin',
        type: 'social',
        relativeX: 0.59,
        relativeY: 0.22,
        portraitRelativeX: 0.20,
        portraitRelativeY: 0.30,
        rotationAngle: -0.13,
        nodes: [
            [-22, -18], [-22, -4], [-22, 18],
            [-6, 18], [-6, -4], [7, -9], [21, -3], [21, 18]
        ],
        edges: [
            [0, 1], [1, 2],
            [3, 4], [4, 5], [5, 6], [6, 7]
        ]
    },
    {
        id: 'mail',
        type: 'email',
        relativeX: 0.74,
        relativeY: 0.18,
        portraitRelativeX: 0.80,
        portraitRelativeY: 0.31,
        rotationAngle: 0.16,
        nodes: [
            [-36, -20], [36, -20], [36, 20], [-36, 20],
            [0, 5]
        ],
        edges: [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [0, 4], [1, 4]
        ]
    }
];
