/**************************************************************
 * DUNGEON DATA SOURCE — RPG CLASSES, PROJECTS, EXPERIENCE & SEALS
 * ------------------------------------------------------------
 * Edita este archivo para actualizar tus proyectos, experiencia,
 * materias de FIUBA y certificados de Boot.dev.
 * Cada ítem usa `tags` ('backend', 'algorithms', 'gamedev', 'fullstack')
 * para filtrarse por clase o mostrarse completo en Modo Omnisciente.
 **************************************************************/

export const OMNISCIENT_CLASS_ID = 'all';

export const CLASS_SPRITES = {
    backend: [
        '....3333....',
        '..33111133..',
        '.3114444113.',
        '.3143333413.',
        '314322223413',
        '314321123413',
        '314321123413',
        '314322223413',
        '.3143333413.',
        '.3114444113.',
        '..33111133..',
        '....3333....'
    ],
    algorithms: [
        '..33333333..',
        '.3222222223.',
        '.3211111123.',
        '.3213333123.',
        '.3211111123.',
        '.3213331123.',
        '.3211111123.',
        '.3213333123.',
        '.3222222223.',
        '..33333333..',
        '....3113....',
        '....3..3....'
    ],
    gamedev: [
        '.........33.',
        '........313.',
        '.......313..',
        '......313...',
        '.....313....',
        '..3.313.....',
        '..3313......',
        '...333......',
        '..23.33.....',
        '.22...3.....',
        '22..........',
        '2...........'
    ],
    fullstack: [
        '..33333333..',
        '.3111111113.',
        '312222222213',
        '312333333213',
        '312311113213',
        '312313313213',
        '.3123113213.',
        '.3123333213.',
        '..31222213..',
        '...311113...',
        '....3113....',
        '.....33.....'
    ]
};

export const DUNGEON_CLASSES = [
    {
        id: 'backend',
        code: 'CLS-01',
        name: {
            es: 'TECHNOMANCER',
            en: 'TECHNOMANCER'
        },
        role: {
            es: 'Backend & Systems Architect',
            en: 'Backend & Systems Architect'
        },
        summary: {
            es: 'Arquitectura de microservicios, concurrencia, sistemas de bajo nivel, automatización en Linux/Bash y persistencia SQL.',
            en: 'Microservices architecture, concurrency, low-level systems, Linux/Bash automation, and SQL persistence.'
        },
        weapons: [
            'Go',
            'Python',
            'Rust',
            'C',
            'C++',
            'Bash',
            'Docker',
            'Linux',
            'PostgreSQL',
            'Microservices'
        ],
        stats: [
            { label: 'SYS / ARCH', value: 94 },
            { label: 'CONCURRENCY', value: 90 },
            { label: 'DB / LINUX', value: 92 }
        ]
    },
    {
        id: 'algorithms',
        code: 'CLS-02',
        name: {
            es: 'LOREKEEPER',
            en: 'LOREKEEPER'
        },
        role: {
            es: 'Algorithms, Data & Teaching',
            en: 'Algorithms, Data & Teaching'
        },
        summary: {
            es: 'Docencia universitaria en Teoría de Algoritmos (FIUBA), divulgación visual con Manim en YouTube y análisis de datos.',
            en: 'University teaching in Algorithm Theory (FIUBA), visual CS education with Manim on YouTube, and data analytics.'
        },
        weapons: [
            'Algorithm Theory',
            'Python',
            'SQL Avanzado',
            'Manim',
            'Pandas',
            'Matplotlib',
            'Data Structures',
            'OBS Studio'
        ],
        stats: [
            { label: 'ALGORITHMS', value: 96 },
            { label: 'DATA / SQL', value: 91 },
            { label: 'PEDAGOGY', value: 95 }
        ]
    },
    {
        id: 'gamedev',
        code: 'CLS-03',
        name: {
            es: 'WORLDBUILDER',
            en: 'WORLDBUILDER'
        },
        role: {
            es: 'Game Dev & Creative Coding',
            en: 'Game Dev & Creative Coding'
        },
        summary: {
            es: 'Motores 2D desde cero, físicas vectoriales, generación procedural en HTML5 Canvas y síntesis de sonido 8-bit.',
            en: 'Custom 2D engines, vector physics, procedural generation on HTML5 Canvas, and 8-bit Web Audio synthesis.'
        },
        weapons: [
            'Python / Pygame',
            'HTML5 Canvas',
            'JavaScript ES6',
            'TypeScript',
            '2D Physics',
            'Procedural Gen',
            'Web Audio API'
        ],
        stats: [
            { label: '2D PHYSICS', value: 92 },
            { label: 'PROCEDURAL', value: 94 },
            { label: 'WEB AUDIO', value: 89 }
        ]
    },
    {
        id: 'fullstack',
        code: 'CLS-04',
        name: {
            es: 'VANGUARD',
            en: 'VANGUARD'
        },
        role: {
            es: 'Full-Stack, UX/UI & Agile',
            en: 'Full-Stack, UX/UI & Agile'
        },
        summary: {
            es: 'Desarrollo de aplicaciones web escalables, diseño de interfaces con identidad propia, prácticas ágiles (Scrum/XP) y TDD.',
            en: 'Scalable web applications, distinctive UX/UI design systems, agile methodologies (Scrum/XP), and TDD.'
        },
        weapons: [
            'TypeScript',
            'JavaScript',
            'Docker',
            'UX/UI Design',
            'Scrum',
            'XP',
            'TDD',
            'Clean Code',
            'Git'
        ],
        stats: [
            { label: 'FULL-STACK', value: 90 },
            { label: 'UX / UI', value: 89 },
            { label: 'AGILE / TDD', value: 93 }
        ]
    }
];

export const DUNGEON_EXPERIENCE = [
    {
        id: 'fiuba-ta',
        organization: 'Facultad de Ingeniería — UBA (FIUBA)',
        role: {
            es: 'Ayudante Docente Adjunto — Teoría de Algoritmos',
            en: 'Teaching Assistant — Algorithm Theory'
        },
        period: {
            es: 'Ago 2025 - Actualidad',
            en: 'Aug 2025 - Present'
        },
        description: {
            es: 'Enseñanza de complejidad computacional, programación dinámica, redes de flujo y estructuras de datos avanzadas. Producción de material audiovisual con Manim y OBS para el canal educativo DrukDev.',
            en: 'Teaching computational complexity, dynamic programming, network flows, and advanced data structures. Producing visual algorithm animations with Manim and OBS for the DrukDev channel.'
        },
        tags: ['algorithms', 'backend']
    },
    {
        id: 'fcc-data',
        organization: 'FIUBA Consulting Club',
        role: {
            es: 'Analista de Datos',
            en: 'Data Analyst'
        },
        period: {
            es: 'Ene 2025 - Actualidad',
            en: 'Jan 2025 - Present'
        },
        description: {
            es: 'Procesamiento de métricas de eventos, limpieza de datos con Python/Pandas y construcción de visualizaciones estratégicas para la toma de decisiones de la junta directiva.',
            en: 'Event metrics processing, data pipelines with Python/Pandas, and strategic visualizations for executive board decision-making.'
        },
        tags: ['algorithms', 'fullstack']
    },
    {
        id: 'fcc-ux',
        organization: 'FIUBA Consulting Club',
        role: {
            es: 'Community Manager & UX/UI',
            en: 'Community Manager & UX/UI'
        },
        period: {
            es: 'Feb 2024 - Ene 2025',
            en: 'Feb 2024 - Jan 2025'
        },
        description: {
            es: 'Diseño de identidad visual digital, prototipado UX/UI y coordinación de comunicación técnica para la comunidad estudiantil.',
            en: 'Digital brand identity design, UX/UI prototyping, and technical communication management.'
        },
        tags: ['fullstack']
    }
];

export const DUNGEON_PROJECTS = [
    {
        id: 'microservices-arch',
        title: {
            es: 'Arquitectura de Microservicios',
            en: 'Microservices Architecture'
        },
        stack: ['Go', 'Python', 'Docker', 'PostgreSQL'],
        description: {
            es: 'Diseño e implementación de cart-service en Go con persistencia PostgreSQL contenerizada en Docker e integración con admindService en Python.',
            en: 'Design and implementation of cart-service in Go backed by Dockerized PostgreSQL and integrated with admindService in Python.'
        },
        repoUrl: 'https://github.com/Felipe-Druk',
        tags: ['backend', 'fullstack']
    },
    {
        id: 'qalife-cli',
        title: {
            es: 'Qalife CLI',
            en: 'Qalife CLI'
        },
        stack: ['Bash', 'Git', 'Linux CLI'],
        description: {
            es: 'Desarrollo y gestión completa del ciclo de vida de una herramienta de línea de comandos en Bash para automatización hasta su release v0.3.1.',
            en: 'End-to-end development and release lifecycle management of a Bash command-line automation tool up to v0.3.1.'
        },
        repoUrl: 'https://github.com/Felipe-Druk',
        tags: ['backend']
    },
    {
        id: 'pokedex-go',
        title: {
            es: 'Pokedex in Go',
            en: 'Pokedex in Go'
        },
        stack: ['Go', 'CLI', 'PokéAPI', 'In-Memory Cache'],
        description: {
            es: 'REPL interactivo de línea de comandos en Go que consume la PokéAPI con sistema propio de caché en memoria para minimizar latencia.',
            en: 'Interactive CLI REPL written in Go consuming PokéAPI with a custom in-memory caching layer for low-latency exploration.'
        },
        repoUrl: 'https://github.com/Felipe-Druk',
        tags: ['backend', 'gamedev']
    },
    {
        id: 'asteroids-pygame',
        title: {
            es: 'Asteroids Arcade',
            en: 'Asteroids Arcade'
        },
        stack: ['Python', 'Pygame', '2D Vector Physics'],
        description: {
            es: 'Recreación arcade con físicas vectoriales 2D, subdivisión dinámica de asteroides y detección de colisiones orientada a objetos.',
            en: 'Classic arcade implementation featuring 2D vector physics, dynamic asteroid splitting, and OOP collision detection.'
        },
        repoUrl: 'https://github.com/Felipe-Druk',
        tags: ['gamedev']
    },
    {
        id: 'granbazaar',
        title: {
            es: 'BackOffice GranBazaar & Bazaar App',
            en: 'BackOffice GranBazaar & Bazaar App'
        },
        stack: ['TypeScript', 'JavaScript', 'Docker', 'Git'],
        description: {
            es: 'Panel administrativo BackOffice y aplicación de mercado escalable contenerizada con Docker bajo flujo de trabajo ágil.',
            en: 'Administrative BackOffice dashboard and scalable marketplace application containerized with Docker.'
        },
        repoUrl: 'https://github.com/Felipe-Druk',
        tags: ['fullstack', 'backend']
    },
    {
        id: 'drukdev-sanctuary',
        title: {
            es: 'DrukDev Sanctuary & DrukSystem OS',
            en: 'DrukDev Sanctuary & DrukSystem OS'
        },
        stack: ['Vanilla JS ES6', 'HTML5 Canvas', 'Web Audio API'],
        description: {
            es: 'Escenario pixel-art procedural con biomas interactivos, sintetizador de audio 8-bit, monitor CRT con intérprete CLI y 3 cartuchos arcade.',
            en: 'Procedural pixel-art sanctuary with interactive biomes, 8-bit Web Audio synth, CRT terminal OS, and 3 playable arcade cartridges.'
        },
        repoUrl: 'https://github.com/Felipe-Druk',
        tags: ['gamedev', 'fullstack']
    }
];

export const DUNGEON_EDUCATION = {
    institution: 'Universidad de Buenos Aires — Facultad de Ingeniería (FIUBA)',
    degree: {
        es: 'Ingeniería en Informática (2021 - Actualidad)',
        en: 'Computer Engineering / Informatics Engineering (2021 - Present)'
    },
    courses: [
        {
            name: { es: 'Sistemas Operativos', en: 'Operating Systems' },
            tags: ['backend']
        },
        {
            name: { es: 'Programación Concurrente', en: 'Concurrent Programming' },
            tags: ['backend']
        },
        {
            name: { es: 'Redes', en: 'Computer Networks' },
            tags: ['backend', 'fullstack']
        },
        {
            name: { es: 'Seguridad Informática', en: 'Information Security' },
            tags: ['backend', 'fullstack']
        },
        {
            name: { es: 'Organización del Computador', en: 'Computer Organization' },
            tags: ['backend']
        },
        {
            name: { es: 'Teoría de Algoritmos', en: 'Algorithm Theory' },
            tags: ['algorithms', 'backend']
        },
        {
            name: { es: 'Aprendizaje Automático', en: 'Machine Learning' },
            tags: ['algorithms']
        },
        {
            name: { es: 'Ciencia de Datos', en: 'Data Science' },
            tags: ['algorithms']
        },
        {
            name: { es: 'Ingeniería de Software I y II', en: 'Software Engineering I & II' },
            tags: ['fullstack', 'backend']
        }
    ]
};

// Edita o agrega aquí nuevos certificados de Boot.dev u otras plataformas.
// Si defines `url: 'https://...'`, el sello mostrará un enlace de verificación clicable.
export const DUNGEON_CERTIFICATIONS = [
    {
        id: 'bootdev-dsa-python',
        issuer: 'Boot.dev',
        title: {
            es: 'Data Structures & Algorithms in Python',
            en: 'Data Structures & Algorithms in Python'
        },
        url: '',
        tags: ['algorithms', 'backend']
    },
    {
        id: 'bootdev-fp-python',
        issuer: 'Boot.dev',
        title: {
            es: 'Functional Programming in Python',
            en: 'Functional Programming in Python'
        },
        url: '',
        tags: ['backend', 'algorithms']
    },
    {
        id: 'bootdev-oop-python',
        issuer: 'Boot.dev',
        title: {
            es: 'Object Oriented Programming in Python',
            en: 'Object Oriented Programming in Python'
        },
        url: '',
        tags: ['backend', 'gamedev', 'fullstack']
    },
    {
        id: 'bootdev-memory-c',
        issuer: 'Boot.dev',
        title: {
            es: 'Memory Management in C',
            en: 'Memory Management in C'
        },
        url: '',
        tags: ['backend', 'gamedev']
    },
    {
        id: 'bootdev-sql',
        issuer: 'Boot.dev',
        title: {
            es: 'Learn SQL',
            en: 'Learn SQL'
        },
        url: '',
        tags: ['backend', 'algorithms', 'fullstack']
    }
];

export function filterItemsByClass(items, classId) {
    if (!classId || classId === OMNISCIENT_CLASS_ID) {
        return items;
    }
    return items.filter((item) => Array.isArray(item.tags) && item.tags.includes(classId));
}

export function getWeaponsByClass(classId) {
    if (!classId || classId === OMNISCIENT_CLASS_ID) {
        const uniqueWeapons = new Set();
        DUNGEON_CLASSES.forEach((rpgClass) => {
            rpgClass.weapons.forEach((weapon) => uniqueWeapons.add(weapon));
        });
        return Array.from(uniqueWeapons);
    }
    const targetClass = DUNGEON_CLASSES.find((rpgClass) => rpgClass.id === classId);
    return targetClass ? targetClass.weapons : [];
}
