/**************************************************************
 * CENTRALIZED CONTACT & SOCIAL MEDIA CONFIGURATION
 * ------------------------------------------------------------
 * Edita este archivo para actualizar tus enlaces en toda la web.
 * Si dejas cualquier red social vacía (''), su botón se ocultará
 * automáticamente en la interfaz.
 **************************************************************/

export const CONTACT_LINKS = {
    // Dirección de correo principal (se muestra y copia al portapapeles)
    email: 'fedalto@fi.uba.ar',

    // Redes sociales y plataformas de desarrollo
    // Deja el valor en '' para ocultar el botón automáticamente en la UI
    socials: {
        github: 'https://github.com/Felipe-Druk',
        linkedin: 'https://www.linkedin.com/in/felipe-dalto-informatica/',
        youtube: 'https://www.youtube.com/@DrukDev',
        itchio: '',
        discord: '',
        twitter: ''
    },

    // Rutas locales por idioma para abrir o descargar tu CV en PDF (dejar en '' para ocultar)
    cv: {
        es: './assets/docs/CV-Felipe-Druk-ES.pdf',
        en: './assets/docs/CV-Felipe-Druk-EN.pdf'
    }
};

export function getLocalizedCvPath(language) {
    const cvConfig = CONTACT_LINKS.cv;
    if (!cvConfig) return '';
    if (typeof cvConfig === 'string') return cvConfig.trim();
    if (typeof cvConfig === 'object') {
        const localizedPath = cvConfig[language];
        return typeof localizedPath === 'string' ? localizedPath.trim() : '';
    }
    return '';
}
