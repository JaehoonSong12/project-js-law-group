// static/js/motor-vehicle-accident.js — page module for /motor-vehicle-accident
import * as multiLang from '../ext-module-i18n.js';
import * as Bootstrap from '../ext-module-bs.js';
import * as Util from '../core-module.js';
import * as FontAwesome from '../ext-module-fa.js';

export default async function main() {
    console.log('[static/js/motor-vehicle-accident.js] Main function execution started');

    Util.setupWindowFocusRefresh();

    FontAwesome.initThemeIcons(['cthm001', 'cthm002']);
    document.addEventListener('click', (e) => {
        if (e.target.closest('#cthm001') || e.target.closest('#cthm002')) {
            e.preventDefault();
            Bootstrap.switchTheme();
            FontAwesome.updateThemeIcons();
        }
    });

    Util.enableDebugMode('debug-i18n', 'data-i18n');

    try {
        await multiLang.initI18n(multiLang.getBaseLocale());
        multiLang.applyTranslations('data-i18n', multiLang.getBaseLocale());
    } catch (error) {
        console.error('[motor-vehicle-accident] Error: Failed to initialize i18n:', error);
        return;
    }

    // Wire floating language switcher (same IDs as index wizard)
    const switcherIds = ['i18n001', 'i18n002', 'i18n005', 'i18n006'];
    switcherIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                const localeCode = el.getAttribute('value-i18n');
                if (localeCode) multiLang.switchLanguage(localeCode);
            });
        }
    });
}
