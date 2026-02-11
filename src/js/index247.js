// event-driven programming
import * as multiLang from '../ext-module-i18n.js';
import * as Bootstrap from '../ext-module-bs.js';
import * as Util from '../core-module.js';
import * as FontAwesome from '../ext-module-fa.js';

/**
 * Initializes the 24/7 emergency page with default locale and wires up UI controls.
 * @returns {Promise<void>} Promise that resolves when initialization is complete
 */
export default async function main() {
    
    console.log('[src/js/index247.js] Main function execution started');

    Util.setupWindowFocusRefresh();

    Util.loadFragment('nav', 'nav247.html').then(() => {
    Util.loadFragment('footer', 'footer247.html').then(async () => {
        FontAwesome.initThemeIcons(['cthm001', 'cthm002']);
        document.addEventListener('click', (e) => {
            if (e.target.closest('#cthm001') || e.target.closest('#cthm002')) {
                e.preventDefault();
                Bootstrap.switchTheme();
                FontAwesome.updateThemeIcons();
            }
        });

        // Enable debug mode for i18n elements
        Util.enableDebugMode('debug-i18n', 'data-i18n');

        // Initialize with default locale (English)
        try {
            await multiLang.initI18n(multiLang.getBaseLocale());
            multiLang.applyTranslations("data-i18n", multiLang.getBaseLocale());
            
            // Apply appropriate styles after translations
            // Note: Contact sections use HTML content, so we style them
            Bootstrap.setStyleContact('tfs-contact-address');
            Bootstrap.setStyleContact('tfs-contact-phone');
            Bootstrap.setStyleContact('tfs-contact-hours');
        } catch (error) {
            console.error('[tfs] Error: Failed to initialize i18n:', error);
            return;
        }

        // Helper function to switch language and apply appropriate styles
        const switchLanguageWithStyles = async (localeCode) => {
            await multiLang.switchLanguage(localeCode);
            Bootstrap.setStyleContact('tfs-contact-address');
            Bootstrap.setStyleContact('tfs-contact-phone');
            Bootstrap.setStyleContact('tfs-contact-hours');
        };

        // Wire up desktop language dropdown - English
        const enDesktop = document.getElementById('i18n001');
        if (enDesktop) {
            enDesktop.addEventListener('click', (e) => {
                e.preventDefault();
                const localeCode = enDesktop.getAttribute('value-i18n');
                if (localeCode) switchLanguageWithStyles(localeCode);
            });
        } else {
            console.warn('[tfs] Warning: Element with ID "i18n001" not found.');
        }

        // Wire up desktop language dropdown - Korean
        const koDesktop = document.getElementById('i18n002');
        if (koDesktop) {
            koDesktop.addEventListener('click', (e) => {
                e.preventDefault();
                const localeCode = koDesktop.getAttribute('value-i18n');
                if (localeCode) switchLanguageWithStyles(localeCode);
            });
        } else {
            console.warn('[tfs] Warning: Element with ID "i18n002" not found.');
        }

        // Wire up mobile language dropdown - English
        const enMobile = document.getElementById('i18n003');
        if (enMobile) {
            enMobile.addEventListener('click', (e) => {
                e.preventDefault();
                const localeCode = enMobile.getAttribute('value-i18n');
                if (localeCode) switchLanguageWithStyles(localeCode);
            });
        } else {
            console.warn('[tfs] Warning: Element with ID "i18n003" not found.');
        }

        // Wire up mobile language dropdown - Korean
        const koMobile = document.getElementById('i18n004');
        if (koMobile) {
            koMobile.addEventListener('click', (e) => {
                e.preventDefault();
                const localeCode = koMobile.getAttribute('value-i18n');
                if (localeCode) switchLanguageWithStyles(localeCode);
            });
        } else {
            console.warn('[tfs] Warning: Element with ID "i18n004" not found.');
        }

        // Wire up desktop language dropdown - Japanese
        const jaDesktop = document.getElementById('i18n005');
        if (jaDesktop) {
            jaDesktop.addEventListener('click', (e) => {
                e.preventDefault();
                const localeCode = jaDesktop.getAttribute('value-i18n');
                if (localeCode) switchLanguageWithStyles(localeCode);
            });
        } else {
            console.warn('[tfs] Warning: Element with ID "i18n005" not found.');
        }

        // Wire up desktop language dropdown - Spanish
        const esDesktop = document.getElementById('i18n006');
        if (esDesktop) {
            esDesktop.addEventListener('click', (e) => {
                e.preventDefault();
                const localeCode = esDesktop.getAttribute('value-i18n');
                if (localeCode) switchLanguageWithStyles(localeCode);
            });
        } else {
            console.warn('[tfs] Warning: Element with ID "i18n006" not found.');
        }

        // Wire up mobile language dropdown - Japanese
        const jaMobile = document.getElementById('i18n007');
        if (jaMobile) {
            jaMobile.addEventListener('click', (e) => {
                e.preventDefault();
                const localeCode = jaMobile.getAttribute('value-i18n');
                if (localeCode) switchLanguageWithStyles(localeCode);
            });
        } else {
            console.warn('[tfs] Warning: Element with ID "i18n007" not found.');
        }

        // Wire up mobile language dropdown - Spanish
        const esMobile = document.getElementById('i18n008');
        if (esMobile) {
            esMobile.addEventListener('click', (e) => {
                e.preventDefault();
                const localeCode = esMobile.getAttribute('value-i18n');
                if (localeCode) switchLanguageWithStyles(localeCode);
            });
        } else {
            console.warn('[tfs] Warning: Element with ID "i18n008" not found.');
        }
    });
    });
}
